import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { squareClient } from '@/lib/square/client'

/**
 * API Route: /api/payments/verify-payment
 * Verifies Square payment status and updates booking
 */
export async function POST(request: Request) {
    try {
        const { bookingId } = await request.json()

        if (!bookingId) {
            return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // 1. Fetch booking with payment link ID
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*, square_payment_link_id')
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) {
            console.error(`[VERIFY-PAYMENT] Booking not found: ${bookingId}`)
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // 2. If already confirmed, return success
        if (booking.status === 'confirmed' && booking.payment_status === 'paid') {
            return NextResponse.json({
                success: true,
                alreadyConfirmed: true,
                booking: {
                    id: booking.id,
                    reference: booking.booking_reference,
                    status: booking.status,
                    paymentStatus: booking.payment_status
                }
            })
        }

        // 3. Verify payment with Square if we have a payment link ID
        if (!booking.square_payment_link_id) {
            return NextResponse.json({
                success: false,
                status: 'MISSING_PAYMENT_LINK',
                message: 'Payment link not found for this booking.'
            }, { status: 409 })
        }

        try {
            const result = await squareClient.checkout.paymentLinks.get({
                id: booking.square_payment_link_id
            })

            const orderId = result.paymentLink?.orderId
            if (!orderId) {
                return NextResponse.json({
                    success: false,
                    status: 'MISSING_ORDER_ID',
                    message: 'Payment link does not have an order ID yet.'
                }, { status: 202 })
            }

            const orderResult = await squareClient.orders.get({ orderId })
            const orderStatus = orderResult.order?.state
            console.log(`[VERIFY-PAYMENT] Order status:`, orderStatus)

            if (orderStatus !== 'COMPLETED') {
                return NextResponse.json({
                    success: false,
                    status: orderStatus || 'UNKNOWN',
                    message: 'Payment not completed yet.'
                }, { status: 202 })
            }

            // Update booking status to confirmed
            const { error: updateError } = await supabase
                .from('bookings')
                .update({
                    status: 'confirmed',
                    payment_status: 'paid',
                    updated_at: new Date().toISOString()
                })
                .eq('id', bookingId)

            if (updateError) {
                console.error(`[VERIFY-PAYMENT] Failed to update booking:`, updateError)
                throw updateError
            }

            console.log(`[VERIFY-PAYMENT] Booking ${bookingId} confirmed successfully`)

            return NextResponse.json({
                success: true,
                booking: {
                    id: booking.id,
                    reference: booking.booking_reference,
                    status: 'confirmed',
                    paymentStatus: 'paid'
                }
            })

        } catch (squareError) {
            console.error(`[VERIFY-PAYMENT] Square API error:`, squareError)
            return NextResponse.json({ error: 'Failed to verify payment with Square' }, { status: 502 })
        }

    } catch (error) {
        console.error(`[VERIFY-PAYMENT] Error:`, error)
        return NextResponse.json({
            error: 'Failed to verify payment'
        }, { status: 500 })
    }
}
