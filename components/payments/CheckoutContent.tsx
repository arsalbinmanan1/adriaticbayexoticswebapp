'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Car } from '@/lib/cars-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SquarePaymentForm from './SquarePaymentForm'
import StepProgress from './StepProgress'
import { checkoutSchema, CheckoutFormData } from '@/lib/validation/checkout'
import { calculateAmounts, AddOn } from '@/lib/payments/calculateAmounts'
import { AVAILABLE_ADDONS } from '@/lib/constants/addons'
import { 
  User, 
  Calendar, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Swal from 'sweetalert2'


interface CheckoutContentProps {
  car: Car
  initialPromoCode?: string
}

const STEPS = ['Information', 'Add-ons', 'Review', 'Payment']

export default function CheckoutContent({ car, initialPromoCode }: CheckoutContentProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount: number, type: string } | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema) as any,
    defaultValues: {
      pickupLocation: 'Orlando, FL',
      dropoffLocation: 'Orlando, FL',
      addOnSelection: [],
      hasAdditionalDriver: false,
      agreeToTerms: false
    },
    mode: 'onChange'
  })


  const watchedFields = watch()

  // --- Exit Confirmation ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step < 4) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [step])


  // --- Autosave Logic ---
  useEffect(() => {
    const saved = localStorage.getItem('checkout_draft')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        Object.keys(parsed).forEach(key => {
          setValue(key as any, parsed[key])
        })
      } catch (e) {
        console.error('Failed to load draft:', e)
      }
    }
  }, [setValue])

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('checkout_draft', JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // --- Auto-apply promo code from URL ---
  useEffect(() => {
    if (initialPromoCode && !appliedPromo) {
      setValue('promoCode', initialPromoCode)
      // Auto-apply the promo code after a short delay to ensure form is ready
      const timer = setTimeout(() => {
        applyPromoCode()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [initialPromoCode, appliedPromo, setValue])

  // --- Calculations ---
  const calculatePricing = () => {
    let days = 1
    if (watchedFields.pickupDatetime && watchedFields.dropoffDatetime) {
      const start = new Date(watchedFields.pickupDatetime)
      const end = new Date(watchedFields.dropoffDatetime)
      if (end > start) {
        const diffTime = Math.abs(end.getTime() - start.getTime())
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      }
    }

    const selectedAddOns = AVAILABLE_ADDONS.filter(a => 
      watchedFields.addOnSelection?.includes(a.id)
    )

    return calculateAmounts({
      dailyRate: car.pricing.perDay,
      numberOfDays: days,
      discountValue: appliedPromo?.discount,
      discountType: appliedPromo?.type as any,
      addOns: selectedAddOns,
      deliveryFee: watchedFields.dropoffLocation === 'Delivery' ? 150 : 0,
      fixedDeposit: car.pricing.deposit // Use car's actual deposit amount
    })

  }

  const pricing = calculatePricing()

  // --- Step Navigation ---
  const nextStep = async () => {
    let fieldsToValidate: any[] = []
    if (step === 1) {
      fieldsToValidate = [
        'customerName', 'customerEmail', 'customerPhone', 'customerDob',
        'customerAddressStreet', 'customerAddressCity', 'customerAddressState', 'customerAddressZip',
        'licenseNumber', 'licenseState', 'licenseExpiration'
      ]
    } else if (step === 2) {
      fieldsToValidate = ['pickupDatetime', 'dropoffDatetime', 'pickupLocation', 'dropoffLocation']
    }

    const isValid = await trigger(fieldsToValidate as any)
    if (isValid) {
      setStep(s => s + 1)
      window.scrollTo(0, 0)
    } else {
      // Collect specific error messages
      const errorMessages = fieldsToValidate
        .map(field => (errors as any)[field]?.message)
        .filter(msg => !!msg)
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Validation Errors',
        html: `<div class="text-left text-xs space-y-1">
          ${errorMessages.map(msg => `<div>• ${msg}</div>`).join('')}
        </div>`,
        showConfirmButton: false,
        timer: 4000,
        background: '#18181b',
        color: '#fff',
        iconColor: '#ef4444'
      })
    }



  }

  const prevStep = () => {
    setStep(s => s - 1)
    window.scrollTo(0, 0)
  }

  const handleBookingSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          ...data,
          addOns: AVAILABLE_ADDONS.filter(a => data.addOnSelection.includes(a.id)),
          deliveryFee: 0,
        })
      })

      const resData = await response.json()
      if (resData.success) {
        setBookingId(resData.bookingId)
        setStep(4)
        localStorage.removeItem('checkout_draft')
        
        Swal.fire({
          icon: 'success',
          title: 'Booking Created!',
          text: 'Information verified. Finalizing your reservation...',
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        })
      } else {
        setError(resData.error || 'Failed to create booking')
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: resData.error || 'Something went wrong while processing your request.',
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        })
      }

    } catch (err) {
      console.error('[CHECKOUT] Booking creation runtime error:', err);
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }


  const applyPromoCode = async () => {
    const code = watchedFields.promoCode
    if (!code) return
    
    setError(null)
    
    try {
      // Calculate rental days
      const pickupDate = new Date(watchedFields.pickupDatetime)
      const dropoffDate = new Date(watchedFields.dropoffDatetime)
      const rentalDays = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))
      
      const response = await fetch('/api/marketing/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          carId: car.id,
          rentalDays
        })
      })
      
      const data = await response.json()
      
      if (data.valid) {
        setAppliedPromo({ 
          code: data.code, 
          discount: data.discount_value, 
          type: data.discount_type 
        })
        Swal.fire({
          icon: 'success',
          title: 'Promo Applied!',
          text: `${data.discount_value}${data.discount_type === 'percentage' ? '%' : '$'} discount applied`,
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#10b981',
          timer: 2000
        })
      } else {
        setError(data.message || 'Invalid promo code')
        setAppliedPromo(null)
        Swal.fire({
          icon: 'error',
          title: 'Invalid Code',
          text: data.message || 'This promo code is not valid',
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        })
      }
    } catch (err) {
      console.error('Promo validation error:', err)
      setError('Failed to validate promo code')
      setAppliedPromo(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <StepProgress currentStep={step} steps={STEPS} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form Column */}
        <div className="lg:col-span-2 space-y-6">
          
          <form id="checkout-form" onSubmit={handleSubmit(handleBookingSubmit as any)}>

            
            {/* STEP 1: Personal & Driver Info */}
            {step === 1 && (
              <Card className="bg-zinc-900 border-zinc-800 animate-in fade-in slide-in-from-right-4 duration-300">
                <CardContent className="p-8 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <User className="w-6 h-6 text-yellow-500" />
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormGroup label="Full Name" error={errors.customerName?.message}>
                        <input {...register('customerName')} className={errors.customerName ? errorInputStyles : inputStyles} placeholder="Emanuel Adriatic" />
                      </FormGroup>
                      <FormGroup label="Email Address" error={errors.customerEmail?.message}>
                        <input {...register('customerEmail')} className={errors.customerEmail ? errorInputStyles : inputStyles} placeholder="emanuel@example.com" />
                      </FormGroup>
                      <FormGroup label="Phone Number" error={errors.customerPhone?.message}>
                        <input {...register('customerPhone')} className={errors.customerPhone ? errorInputStyles : inputStyles} placeholder="+1 (727) 000-0000" />
                      </FormGroup>
                      <FormGroup label="Date of Birth" error={errors.customerDob?.message}>
                        <input {...register('customerDob')} type="date" className={errors.customerDob ? errorInputStyles : inputStyles} />
                      </FormGroup>

                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-yellow-500" />
                      Residential Address
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <FormGroup label="Street Address" error={errors.customerAddressStreet?.message}>
                          <input {...register('customerAddressStreet')} className={errors.customerAddressStreet ? errorInputStyles : inputStyles} placeholder="123 Exotic Ave" />
                        </FormGroup>
                      </div>
                      <FormGroup label="City" error={errors.customerAddressCity?.message}>
                        <input {...register('customerAddressCity')} className={errors.customerAddressCity ? errorInputStyles : inputStyles} placeholder="Tampa" />
                      </FormGroup>
                      <FormGroup label="State" error={errors.customerAddressState?.message}>
                        <input {...register('customerAddressState')} className={errors.customerAddressState ? errorInputStyles : inputStyles} placeholder="FL" />
                      </FormGroup>
                      <FormGroup label="ZIP Code" error={errors.customerAddressZip?.message}>
                        <input {...register('customerAddressZip')} className={errors.customerAddressZip ? errorInputStyles : inputStyles} placeholder="33602" />
                      </FormGroup>

                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-yellow-500" />
                      Driver&apos;s License
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormGroup label="License Number" error={errors.licenseNumber?.message}>
                        <input {...register('licenseNumber')} className={errors.licenseNumber ? errorInputStyles : inputStyles} placeholder="A-123-456-789" />
                      </FormGroup>
                      <FormGroup label="State / Country" error={errors.licenseState?.message}>
                        <input {...register('licenseState')} className={errors.licenseState ? errorInputStyles : inputStyles} placeholder="Florida" />
                      </FormGroup>
                      <FormGroup label="Expiration Date" error={errors.licenseExpiration?.message}>
                        <input {...register('licenseExpiration')} type="date" className={errors.licenseExpiration ? errorInputStyles : inputStyles} />
                      </FormGroup>

                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={nextStep} className={actionButtonStyles}>
                      Rental Details <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 2: Rental Configuration & Add-ons */}
            {step === 2 && (
              <Card className="bg-zinc-900 border-zinc-800 animate-in fade-in slide-in-from-right-4 duration-300">
                <CardContent className="p-8 space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-yellow-500" />
                      Rental Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormGroup label="Pickup Date & Time" error={errors.pickupDatetime?.message}>
                        <input {...register('pickupDatetime')} type="datetime-local" className={errors.pickupDatetime ? errorInputStyles : inputStyles} />
                      </FormGroup>
                      <FormGroup label="Dropoff Date & Time" error={errors.dropoffDatetime?.message}>
                        <input {...register('dropoffDatetime')} type="datetime-local" className={errors.dropoffDatetime ? errorInputStyles : inputStyles} />
                      </FormGroup>

                      <FormGroup label="Pickup Location" error={errors.pickupLocation?.message}>
                        <select {...register('pickupLocation')} className={errors.pickupLocation ? errorInputStyles : inputStyles}>
                          <option>Orlando, FL</option>
                          <option>Miami, FL</option>
                          <option>Tampa, FL</option>
                          <option>St Petersburg, FL</option>
                          <option>Clearwater, FL</option>
                          <option>New Port Richey, FL</option>
                          <option>Sarasota, FL</option>
                        </select>
                      </FormGroup>
                      <FormGroup label="Dropoff Location" error={errors.dropoffLocation?.message}>
                        <select {...register('dropoffLocation')} className={errors.dropoffLocation ? errorInputStyles : inputStyles}>
                          <option>Orlando, FL</option>
                          <option>Miami, FL</option>
                          <option>Tampa, FL</option>
                          <option>St Petersburg, FL</option>
                          <option>Clearwater, FL</option>
                          <option>New Port Richey, FL</option>
                          <option>Sarasota, FL</option>
                        </select>
                      </FormGroup>



                      {/* Delivery Option Toggle */}
                      <div className="md:col-span-2">
                        <div 
                          onClick={() => {
                            const val = watchedFields.dropoffLocation === 'Delivery' 
                            setValue('dropoffLocation', val ? 'Orlando, FL' : 'Delivery')
                            // If delivery is selected, we could set a fixed delivery fee
                          }}
                          className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all
                            ${watchedFields.dropoffLocation === 'Delivery' ? 'bg-yellow-500/10 border-yellow-500' : 'bg-zinc-800 border-zinc-800'}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-yellow-500">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">VIP Doorstep Delivery</p>
                              <p className="text-zinc-500 text-[10px] uppercase font-black">Professional delivery to your location (+$150)</p>
                            </div>
                          </div>
                          <div className={`w-12 h-6 rounded-full relative transition-colors ${watchedFields.dropoffLocation === 'Delivery' ? 'bg-yellow-500' : 'bg-zinc-700'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${watchedFields.dropoffLocation === 'Delivery' ? 'left-7' : 'left-1'}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Plus className="w-6 h-6 text-yellow-500" />
                      Enhance Your Experience
                    </h2>
                    <div className="space-y-4">
                      {AVAILABLE_ADDONS.map((addon) => (
                        <div 
                          key={addon.id}
                          onClick={() => {
                            const current = watchedFields.addOnSelection || []
                            if (current.includes(addon.id)) {
                              setValue('addOnSelection', current.filter(id => id !== addon.id))
                            } else {
                              setValue('addOnSelection', [...current, addon.id])
                            }
                          }}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                            ${watchedFields.addOnSelection?.includes(addon.id) 
                              ? 'bg-red-600/10 border-red-600' 
                              : 'bg-zinc-800 border-zinc-800 hover:border-zinc-700'}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border
                              ${watchedFields.addOnSelection?.includes(addon.id) ? 'bg-red-600 border-red-600' : 'border-zinc-600'}`}>
                              {watchedFields.addOnSelection?.includes(addon.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <div>
                              <p className="text-white font-bold">{addon.name}</p>
                              <p className="text-zinc-500 text-xs">{addon.type === 'per_day' ? `$${addon.price}/day` : `$${addon.price} flat fee`}</p>
                            </div>
                          </div>
                          <span className="text-white font-bold">${addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" onClick={prevStep} variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 rounded-full h-14 px-8">
                       <ChevronLeft className="w-5 h-5 mr-2" /> Back
                    </Button>
                    <Button type="button" onClick={nextStep} className={actionButtonStyles}>
                      Review Booking <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <Card className="bg-zinc-900 border-zinc-800 animate-in fade-in slide-in-from-right-4 duration-300">
                <CardContent className="p-8 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Review Your Booking</h2>
                    
                    <div className="space-y-6">
                      <ReviewSection title="Personal" icon={<User className="w-4 h-4" />}>
                        <p>{watchedFields.customerName}</p>
                        <p className="text-zinc-500 text-xs">{watchedFields.customerEmail} • {watchedFields.customerPhone}</p>
                      </ReviewSection>

                      <ReviewSection title="Rental Period" icon={<Calendar className="w-4 h-4" />}>
                        <p>From: {new Date(watchedFields.pickupDatetime).toLocaleString()}</p>
                        <p>To: {new Date(watchedFields.dropoffDatetime).toLocaleString()}</p>
                        <p className="text-red-500 text-xs font-bold mt-1 uppercase tracking-widest">{pricing.remainingBalance > 0 ? `${Math.ceil(pricing.rentalSubtotal / car.pricing.perDay)} Days Total` : ''}</p>
                      </ReviewSection>

                      <ReviewSection title="Locations" icon={<MapPin className="w-4 h-4" />}>
                        <p>Pickup: {watchedFields.pickupLocation}</p>
                        <p>Dropoff: {watchedFields.dropoffLocation}</p>
                      </ReviewSection>

                      <ReviewSection title="Extras" icon={<Plus className="w-4 h-4" />}>
                        {watchedFields.addOnSelection?.length ? (
                          <ul className="list-disc list-inside text-sm">
                            {AVAILABLE_ADDONS.filter(a => watchedFields.addOnSelection.includes(a.id)).map(a => (
                              <li key={a.id}>{a.name}</li>
                            ))}
                          </ul>
                        ) : <p className="text-zinc-600">No extras selected</p>}
                      </ReviewSection>

                      {/* Terms & Conditions */}
                      <div className="pt-6 space-y-4">
                        <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-800 text-[10px] text-zinc-500 space-y-2">
                          <p className="font-bold text-zinc-400 uppercase tracking-widest">Rental Agreement Summary</p>
                          <p>By checking the box below, you agree to our <span className="text-red-500 underline cursor-pointer">Terms of Service</span>, <span className="text-red-500 underline cursor-pointer">Cancellation Policy</span>, and <span className="text-red-500 underline cursor-pointer">Refund Policy</span>. You acknowledge that a security deposit is required and is refundable subject to vehicle inspection.</p>
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative flex items-center mt-1">
                            <input 
                              type="checkbox" 
                              {...register('agreeToTerms')}
                              className="peer sr-only" 
                            />
                            <div className={`w-5 h-5 border-2 rounded transition-all 
                              ${errors.agreeToTerms ? 'border-red-500' : 'border-zinc-700'}
                              peer-checked:bg-red-600 peer-checked:border-red-600`}
                            ></div>
                            <CheckCircle2 className="absolute w-3 h-3 text-white opacity-0 transition-opacity peer-checked:opacity-100 left-1" />
                          </div>
                          <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            I have read and agree to the Adriatic Bay Exotics Rental Agreement and Policies.
                          </span>
                        </label>
                        {errors.agreeToTerms && (
                          <p className="text-[10px] text-red-500 font-bold ml-8">{errors.agreeToTerms.message}</p>
                        )}
                      </div>

                    </div>
                  </div>


                  {error && (
                    <div className="p-4 bg-red-600/10 border border-red-600/20 text-red-500 rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                  <div className="flex justify-between pt-4">
                    <Button type="button" onClick={prevStep} variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 rounded-full h-14 px-8">
                       <ChevronLeft className="w-5 h-5 mr-2" /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={actionButtonStyles}
                    >
                      {isSubmitting ? 'Confirming...' : 'Confirm & Proceed to Payment'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          </form>

          {/* STEP 4: Payment - Rendered outside the form and after the form is closed */}
          {step === 4 && bookingId && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SquarePaymentForm 
                bookingId={bookingId}
                amount={pricing.securityDepositAmount}
                buyerEmail={watchedFields.customerEmail}
                buyerName={watchedFields.customerName}
                onSuccess={() => {
                  console.log(`[CHECKOUT] Payment success for ${bookingId}. Redirecting to success page...`);
                  window.location.href = `/checkout/success?bookingId=${bookingId}`
                }}
                onError={(err) => {
                  console.error(`[CHECKOUT] Payment error:`, err);
                  setError(err);
                }}
              />
            </div>
          )}


        </div>

        {/* Sidebar Summary Column */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 sticky top-32 overflow-hidden shadow-2xl">
            <div className="h-48 overflow-hidden relative">
              <img src={car.images.gallery[0] || car.images.main} alt={car.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <p className="text-[10px] text-yellow-400 font-black uppercase tracking-[0.2em]">{car.brand}</p>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{car.name}</h3>
              </div>
            </div>
            
            <CardContent className="p-6 space-y-6">
              
              {/* Breakdown */}
              <div className="space-y-3">
                <SummaryRow label={`Base Rental (${Math.ceil(pricing.rentalSubtotal / car.pricing.perDay)} Days)`} value={`$${pricing.rentalSubtotal.toFixed(2)}`} />
                {pricing.addOnsTotal > 0 && <SummaryRow label="Extras & Add-ons" value={`$${pricing.addOnsTotal.toFixed(2)}`} />}
                {pricing.deliveryFee > 0 && <SummaryRow label="Delivery Fee" value={`$${pricing.deliveryFee.toFixed(2)}`} />}
                {pricing.discountApplied > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-green-500 font-bold uppercase">Discount</span>
                    <span className="text-green-500 font-bold">-${pricing.discountApplied.toFixed(2)}</span>
                  </div>
                )}
                <SummaryRow label="Sales Tax (7%)" value={`$${pricing.taxAmount.toFixed(2)}`} />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-none mb-1">Total Rental Contract</p>
                  <p className="text-3xl font-black text-white italic tracking-tighter">${pricing.totalRentalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Due Now Box */}
              <div className="p-5 bg-red-600/10 border border-red-600/20 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-12 h-12 text-red-600" />
                </div>
                <div className="relative z-10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">Amount Due Now</span>
                    <span className="text-white font-black italic text-xl">${pricing.securityDepositAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-tight">
                    This is the <span className="text-white font-bold">Security Deposit</span> required to lock in your car. 
                    The remaining balance of <span className="text-white font-bold">${(pricing.totalRentalAmount).toFixed(2)}</span> will be charged upon vehicle pickup.
                  </p>
                </div>
              </div>

              {/* Promo Input */}
              {step < 4 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Have a promo code?</p>
                  <div className="flex gap-2">
                    <input 
                      {...register('promoCode')} 
                      className={`flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg text-xs outline-none transition-all placeholder:text-zinc-600
                        ${appliedPromo ? 'border-2 border-green-500/50' : errors.promoCode ? 'border-2 border-red-500/50' : 'border border-zinc-700 focus:ring-1 focus:ring-yellow-500'}`}
                      placeholder="ENTER CODE"
                      disabled={!!appliedPromo}
                    />

                    {appliedPromo ? (
                      <button 
                        onClick={() => {
                          setAppliedPromo(null)
                          setValue('promoCode', '')
                        }} 
                        type="button" 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        onClick={applyPromoCode} 
                        type="button" 
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {appliedPromo && (
                    <div className="flex items-center gap-2 text-green-400 text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {appliedPromo.type === 'percentage' 
                          ? `${appliedPromo.discount}% discount applied!` 
                          : `$${appliedPromo.discount} discount applied!`
                        }
                      </span>
                    </div>
                  )}
                  {error && !appliedPromo && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 space-y-3">
                <BadgeItem text="Free cancellation up to 48h before" />
                <BadgeItem text="24/7 VIP Dedicated Support" />
                <BadgeItem text="PCI-DSS Compliant Payments" />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

// --- Sub-components ---

function FormGroup({ label, children, error }: { label: string, children: React.ReactNode, error?: string }) {
  return (
    <div className="space-y-2">
      <label className={`text-xs uppercase font-black tracking-widest transition-colors ${error ? 'text-red-500' : 'text-zinc-500'}`}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
}


function SummaryRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-zinc-500 uppercase font-bold tracking-tight">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  )
}

function BadgeItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
      <ShieldCheck className="w-3 h-3 text-red-600" />
      {text}
    </div>
  )
}

function ReviewSection({ title, children, icon }: { title: string, children: React.ReactNode, icon: React.ReactNode }) {
  return (
    <div className="space-y-2 pb-4 border-b border-zinc-800 last:border-0">
      <div className="flex items-center gap-2 text-yellow-500">
        {icon}
        <h4 className="text-[10px] font-black uppercase tracking-widest">{title}</h4>
      </div>
      <div className="text-white text-sm">
        {children}
      </div>
    </div>
  )
}

const inputStyles = "w-full bg-zinc-800 border-zinc-700 text-white px-5 py-4 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all placeholder:text-zinc-600 text-sm font-medium [color-scheme:dark]"
const errorInputStyles = "w-full bg-zinc-800 border-red-500/50 text-white px-5 py-4 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all placeholder:text-zinc-600 text-sm font-medium [color-scheme:dark] border-2 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
const actionButtonStyles = "bg-red-600 hover:bg-red-700 text-white h-14 rounded-full px-10 text-sm font-black uppercase tracking-widest flex items-center shadow-lg shadow-red-600/20 active:scale-95 transition-all disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"

