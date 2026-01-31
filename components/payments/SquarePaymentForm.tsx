'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface SquarePaymentFormProps {
  bookingId: string
  amount: number
  buyerEmail?: string
  buyerName?: string
  onSuccess: (result: any) => void
  onError: (error: string) => void
}

/**
 * SquarePaymentForm Component
 * Loads Square Web Payments SDK and renders the secure card input.
 * Includes support for 3D Secure verification.
 */
export default function SquarePaymentForm({ 
  bookingId, 
  amount, 
  buyerEmail,
  buyerName,
  onSuccess, 
  onError 
}: SquarePaymentFormProps) {
  const [payments, setPayments] = useState<any>(null)
  const [card, setCard] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!

  const initializePaymentForm = async () => {
    if (!(window as any).Square) {
      onError('Square SDK not loaded')
      return
    }

    try {
      const paymentsInstance = (window as any).Square.payments(appId, locationId)
      setPayments(paymentsInstance)

      const cardInstance = await paymentsInstance.card()
      await cardInstance.attach('#card-container')
      setCard(cardInstance)
    } catch (e) {
      console.error('Failed to initialize Square:', e)
      onError('Failed to load payment form')
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!card || !payments) return

    console.log('[SQUARE] Payment initiated by user');
    setLoading(true)
    try {
      // 1. Tokenize the card details
      console.log('[SQUARE] Tokenizing card...');
      const result = await card.tokenize()
      
      if (result.status === 'OK') {
        let token = result.token
        let verificationToken = undefined
        console.log('[SQUARE] Tokenization success:', token);

        // 2. Perform 3D Secure verification if required
        try {
          console.log('[SQUARE] Verifying buyer (3DS)...');
          const verificationResults = await payments.verifyBuyer(token, {
            amount: amount.toFixed(2),
            currencyCode: 'USD',
            intent: 'CHARGE',
            billingContact: {
              givenName: buyerName?.split(' ')[0] || 'Customer',
              familyName: buyerName?.split(' ').slice(1).join(' ') || 'User',
              email: buyerEmail,
            },
          })
          verificationToken = verificationResults.token
          console.log('[SQUARE] verificationToken obtained:', verificationToken);
        } catch (vError) {
          console.warn('[SQUARE] 3DS Verification skipped or failed:', vError)
        }
        
        // 3. Submit to backend
        console.log('[SQUARE] Submitting to backend API...');
        const response = await fetch('/api/payments/create-deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId,
            sourceId: token,
            verificationToken,
          }),
        })

        const data = await response.json()
        console.log('[SQUARE] API Response:', data);

        if (data.success) {
          console.log('[SQUARE] SUCCESS! Triggering onSuccess callback');
          onSuccess(data)
        } else {
          console.error('[SQUARE] API Error:', data.error);
          onError(data.error || 'Payment failed')
        }
      } else {
        console.error('[SQUARE] Tokenization errors:', result.errors);
        onError(result.errors?.[0]?.message || 'Card validation failed')
      }
    } catch (e) {
      console.error('[SQUARE] Runtime error:', e)
      onError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="w-full max-w-md mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
      <Script
        src={process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'production' 
          ? "https://web.squarecdn.com/v1/square.js" 
          : "https://sandbox.web.squarecdn.com/v1/square.js"
        }
        onLoad={initializePaymentForm}
      />

      
      <h3 className="text-xl font-bold mb-4 text-white">Complete Security Deposit</h3>
      <p className="text-sm text-zinc-400 mb-6">
        A security deposit of <span className="font-semibold text-white">${amount.toFixed(2)}</span> is required to confirm your booking.
      </p>

      <form id="payment-form" onSubmit={handlePayment}>
        <div id="card-container" className="mb-6 p-4 bg-zinc-800 border border-zinc-700 rounded-md"></div>
        
        <button
          type="submit"
          disabled={loading || !card}
          className={`w-full py-4 px-4 rounded-full font-bold text-white transition-all 
            ${loading ? 'bg-zinc-700 cursor-not-allowed text-zinc-400' : 'bg-red-600 hover:bg-red-700 shadow-lg active:scale-95'}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : `Pay $${amount.toFixed(2)}`}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 grayscale opacity-30">
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">Secure Payment Powered by</span>
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Square_Inc._logo.svg" alt="Square" className="h-3 invert" />
      </div>
    </div>
  )
}

