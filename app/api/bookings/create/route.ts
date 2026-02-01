import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculateAmounts } from '@/lib/payments/calculateAmounts'

/**
 * API Route: /api/bookings/create
 * Creates a new booking in 'pending' status.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            carId,
            customerName,
            customerEmail,
            customerPhone,
            licenseNumber,
            pickupDatetime,
            dropoffDatetime,
            pickupLocation,
            dropoffLocation,
            promoCode
        } = body

        const supabase = createAdminClient()

        // 0. Idempotency check - prevent duplicate bookings
        const idempotencyKey = `${carId}-${customerEmail}-${pickupDatetime}-${dropoffDatetime}`
        const { data: existingDraftBooking } = await supabase
            .from('bookings')
            .select('id, status, deposit_amount')
            .eq('car_id', carId)
            .eq('customer_email', customerEmail)
            .eq('pickup_datetime', pickupDatetime)
            .eq('dropoff_datetime', dropoffDatetime)
            .in('status', ['pending', 'confirmed'])
            .maybeSingle()

        if (existingDraftBooking) {
            console.log(`[BOOKING CREATE] Duplicate booking detected: ${existingDraftBooking.id}`)
            return NextResponse.json({
                success: true,
                bookingId: existingDraftBooking.id,
                amount: existingDraftBooking.deposit_amount,
                message: 'Booking already exists'
            })
        }

        // 1. Cleanup expired bookings to free up availability
        const { data: cleanedCount, error: cleanupError } = await supabase.rpc('cleanup_expired_bookings')
        if (cleanupError) {
            console.error('[BOOKING CREATE] CRITICAL: Cleanup failed:', cleanupError)
            // Continue anyway - availability check will still work
        } else {
            console.log(`[BOOKING CREATE] Cleaned up ${cleanedCount || 0} expired bookings`)
        }

        // 1. Fetch Car Details
        const { data: car, error: carError } = await supabase
            .from('cars')
            .select('*')
            .eq('id', carId)
            .single()

        if (carError || !car) {
            return NextResponse.json({ error: 'Car not found' }, { status: 404 })
        }



        // 2. Check for conflicts using advanced availability function
        const { data: availability, error: conflictError } = await supabase
            .rpc('check_booking_availability', {
                p_car_id: carId,
                p_pickup: pickupDatetime,
                p_dropoff: dropoffDatetime,
                p_buffer_hours: 4, // 4 hour turnaround buffer
                p_exclude_booking_id: null // Explicitly set to null for new bookings
            })

        if (conflictError) throw conflictError

        // availability returns a set of (is_available, conflict_id, message)
        const availResult = Array.isArray(availability) ? availability[0] : availability;

        if (!availResult.is_available) {
            return NextResponse.json({
                error: availResult.message || 'Car is not available for these dates',
                conflictId: availResult.conflict_id
            }, { status: 409 })
        }

        // 2.1 Validate Customer Age and Email, then check blacklist
        if (body.customerDob) {
            const dob = new Date(body.customerDob)
            const age = new Date().getFullYear() - dob.getFullYear()
            if (age < 21) {
                return NextResponse.json({ error: 'You must be at least 21 years old to rent a vehicle.' }, { status: 400 })
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(customerEmail)) {
            return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 })
        }

        // Check if customer is blacklisted
        const { data: isBlacklisted } = await supabase.rpc('is_customer_blacklisted', { p_email: customerEmail })
        if (isBlacklisted) {
            return NextResponse.json({ error: 'This account is restricted from making new bookings. Please contact support.' }, { status: 403 })
        }


        // 3. Optional: Check for unique email (prevent duplicate spam/bookings)
        const { data: existingBooking } = await supabase
            .from('bookings')
            .select('id')
            .eq('customer_email', customerEmail)
            .eq('status', 'pending')
            .limit(1)
            .single()

        if (existingBooking) {
            // Not necessarily an error, but good to know
            console.log(`Customer with email ${customerEmail} already has a pending booking.`)
        }


        // 3. Calculate Number of Days
        const start = new Date(pickupDatetime)
        const end = new Date(dropoffDatetime)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        // 4. Handle Promo Code (atomic validation and increment)
        let discountValue = 0
        let discountType: 'percentage' | 'fixed' | undefined = undefined

        if (promoCode) {
            // Use database function for atomic validation and increment
            const { data: promoResult, error: promoError } = await supabase
                .rpc('validate_and_increment_promo', {
                    p_code: promoCode.toUpperCase(),
                    p_rental_days: numberOfDays,
                    p_car_id: carId
                })

            if (promoError) {
                console.error('[BOOKING CREATE] Promo validation error:', promoError)
                return NextResponse.json({ error: 'Failed to validate promo code' }, { status: 500 })
            }

            const result = Array.isArray(promoResult) ? promoResult[0] : promoResult

            if (!result.valid) {
                return NextResponse.json({ error: result.message }, { status: 400 })
            }

            discountValue = Number(result.discount_value)
            discountType = result.discount_type as 'percentage' | 'fixed'
        }

        // 5. Calculate Final Amounts
        const pricing = calculateAmounts({
            dailyRate: Number(car.daily_rate),
            numberOfDays,
            discountValue,
            discountType,
            addOns: body.addOns || [],
            deliveryFee: body.deliveryFee || 0,
            fixedDeposit: Number(car.security_deposit) // Use car's actual deposit
        })

        // 6. Insert Booking
        const { data: booking, error: insertError } = await supabase
            .from('bookings')
            .insert({
                car_id: carId,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                customer_dob: body.customerDob,
                customer_address_street: body.customerAddressStreet,
                customer_address_city: body.customerAddressCity,
                customer_address_state: body.customerAddressState,
                customer_address_zip: body.customerAddressZip,
                license_number: licenseNumber,
                license_state: body.licenseState,
                license_expiration: body.licenseExpiration,
                has_additional_driver: body.hasAdditionalDriver || false,
                additional_driver_info: body.additionalDriverInfo || {},
                pickup_datetime: pickupDatetime,
                dropoff_datetime: dropoffDatetime,
                pickup_location: pickupLocation,
                dropoff_location: dropoffLocation,
                base_rate: car.daily_rate,
                number_of_days: numberOfDays,
                subtotal: pricing.rentalSubtotal,
                tax: pricing.taxAmount,
                fees: pricing.addOnsTotal + pricing.deliveryFee,
                total_amount: pricing.totalRentalAmount,
                discount_amount: pricing.discountApplied,
                promo_code: promoCode,
                discount_type: discountType,
                deposit_amount: pricing.securityDepositAmount,
                status: 'confirmed', // Default to confirmed instead of pending
                payment_status: 'unpaid'
            })
            .select()
            .single()


        if (insertError) throw insertError

        return NextResponse.json({
            success: true,
            bookingId: booking.id,
            amount: pricing.securityDepositAmount
        })

    } catch (error: any) {
        console.error('[Booking Creation Error]:', error)
        return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 })
    }
}
