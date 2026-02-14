'use client'

interface SquarePaymentFormProps {
  bookingId: string
  amount: number
  buyerEmail?: string
  buyerName?: string
  onSuccess: (result: any) => void
  onError: (error: string) => void
}

// Square card form is intentionally disabled in favor of hosted Square Checkout.
export default function SquarePaymentForm(_props: SquarePaymentFormProps) {
  return null
}

