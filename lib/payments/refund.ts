import { squareClient, parseSquareError } from '@/lib/square/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { v4 as uuidv4 } from 'uuid'

/**
 * Refund Utility
 * Handles full or partial refunds for bookings.
 */
export const processRefund = async (params: {
    bookingId: string
    paymentId: string
    amount?: number // If null, full refund
    reason?: string
}) => {
    const { bookingId, paymentId, amount, reason } = params
    const supabase = createAdminClient()

    try {
        // 1. Verify payment exists and belongs to this booking
        const { data: transaction, error: txError } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('square_transaction_id', paymentId)
            .single()

        if (txError || !transaction) {
            throw new Error('Payment transaction not found in database')
        }

        if (transaction.booking_id !== bookingId) {
            throw new Error('Payment does not belong to this booking')
        }

        // 2. Fetch payment from Square and verify status
        const { payment } = await (squareClient.payments as any).get(paymentId)

        if (!payment) {
            throw new Error('Payment not found in Square')
        }

        if (payment.status !== 'COMPLETED') {
            throw new Error(`Cannot refund payment with status: ${payment.status}. Only COMPLETED payments can be refunded.`)
        }

        // 3. Resolve Refund Amount
        let refundAmountBigInt: bigint

        if (amount) {
            refundAmountBigInt = BigInt(Math.round(amount * 100))

            // Verify refund amount doesn't exceed payment amount
            if (refundAmountBigInt > payment.amountMoney.amount) {
                throw new Error('Refund amount cannot exceed original payment amount')
            }
        } else {
            // Full refund
            refundAmountBigInt = payment.amountMoney.amount
        }

        // 4. Execute Square Refund
        const idempotencyKey = uuidv4()
        const { refund } = await (squareClient.refunds as any).refundPayment({
            idempotencyKey,
            paymentId,
            amountMoney: {
                amount: refundAmountBigInt,
                currency: 'USD',
            },
            reason: reason || 'Customer cancellation',
        })

        if (!refund) throw new Error('Square refund failed')

        // 5. Log Refund Transaction
        await supabase.from('payment_transactions').insert({
            booking_id: bookingId,
            square_transaction_id: refund.id,
            payment_type: 'refund',
            amount: Number(refund.amountMoney?.amount || 0) / 100,
            currency: 'USD',
            square_status: refund.status,
        })




        // 6. Update Booking (only cancel if full refund and completed)
        const isFullRefund = refundAmountBigInt >= payment.amountMoney.amount
        const isCompleted = refund.status === 'COMPLETED'

        if (isFullRefund && isCompleted) {
            await supabase.from('bookings').update({
                refund_status: 'fully_refunded',
                status: 'cancelled',
            }).eq('id', bookingId)
        } else if (isCompleted) {
            // Partial refund - update refund status but don't cancel
            await supabase.from('bookings').update({
                refund_status: 'partially_refunded',
            }).eq('id', bookingId)
        } else {
            // Refund pending
            await supabase.from('bookings').update({
                refund_status: 'pending_refund',
            }).eq('id', bookingId)
        }

        return { success: true, refundId: refund.id }
    } catch (error) {
        const errorMsg = parseSquareError(error)
        console.error(`Refund failed for booking ${bookingId}:`, errorMsg)
        return { success: false, error: errorMsg }
    }
}
