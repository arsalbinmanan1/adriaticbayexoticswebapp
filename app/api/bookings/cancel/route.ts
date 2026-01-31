import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { processRefund } from '@/lib/payments/refund'

/**
 * API Route: /api/bookings/cancel
 * Handles customer or admin booking cancellation.
 * Integrates with database logic and Square refund system.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { bookingId, reason, isAdmin } = body

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // 1. Process cancellation in database
        const { data, error } = await supabase
            .rpc('process_booking_cancellation', {
                p_booking_id: bookingId,
                p_reason: reason || 'Cancelled by user',
                p_admin_id: isAdmin ? null : undefined // Could pass actual admin ID if available
            })

        if (error) throw error
        const result = Array.isArray(data) ? data[0] : data

        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 })
        }

        // 2. Handle Square Refund if applicable
        let refundResult = null
        if (result.refund_amount > 0) {
            try {
                // We need the payment transaction ID
                const { data: transaction, error: txError } = await supabase
                    .from('payment_transactions')
                    .select('square_transaction_id')
                    .eq('booking_id', bookingId)
                    .eq('square_status', 'COMPLETED')
                    .eq('payment_type', 'security_deposit')
                    .maybeSingle() // ← Use maybeSingle() to handle no payment case

                if (transaction?.square_transaction_id) {
                    refundResult = await processRefund({
                        bookingId,
                        paymentId: transaction.square_transaction_id,
                        amount: result.refund_amount,
                        reason: `Cancellation Refund: ${reason}`
                    })
                } else {
                    console.log(`[API: CANCEL] No payment to refund for booking ${bookingId}`)
                }


            } catch (refundError: any) {
                console.error('[Refund Error]:', refundError)
                // We don't fail the whole request, but log it for manual intervention
                return NextResponse.json({
                    success: true,
                    message: 'Booking cancelled but refund failed. Manual refund required.',
                    error: refundError.message
                })
            }
        }

        // 3. Trigger Inngest Notifications
        const { inngest } = await import('@/lib/inngest/client')
        await inngest.send({
            name: 'notification/booking.cancelled',
            data: {
                bookingId,
                refundAmount: result.refund_amount,
                reason: reason || 'Cancelled by user'
            }
        })

        return NextResponse.json({
            success: true,
            refundProcessed: refundResult?.success || false,
            refundAmount: result.refund_amount,
            message: result.message
        })

    } catch (error: any) {
        console.error('[Cancellation Error]:', error)
        return NextResponse.json({ error: error.message || 'Failed to cancel booking' }, { status: 500 })
    }
}
