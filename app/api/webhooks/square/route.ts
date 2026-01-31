import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * API Route: /api/webhooks/square
 * Handles asynchronous event notifications from Square.
 */
export async function POST(request: Request) {
    const signature = request.headers.get('x-square-hmacsha256-signature')
    const body = await request.text()

    // 1. Signature Verification - use actual request URL
    const requestUrl = new URL(request.url).origin + new URL(request.url).pathname
    const isVerified = verifySquareSignature(
        process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
        requestUrl, // Use actual request URL, not env var
        signature!,
        body
    )

    if (!isVerified) {
        console.error('[Webhook Error]: Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = createAdminClient()

    console.log(`[Webhook Received]: ${event.type}`, event.data.id)

    try {
        // 2. Check if event already processed (idempotency)
        const { data: existingEvent } = await supabase
            .from('webhook_events')
            .select('id')
            .eq('square_event_id', event.id)
            .maybeSingle()

        if (existingEvent) {
            console.log(`[Webhook]: Event ${event.id} already processed, skipping`)
            return NextResponse.json({ success: true, message: 'Event already processed' })
        }

        // 3. Process event
        switch (event.type) {
            case 'payment.updated': {
                const payment = event.data.object.payment
                const bookingId = payment.reference_id

                if (bookingId) {
                    // Update transaction
                    await supabase
                        .from('payment_transactions')
                        .update({ square_status: payment.status })
                        .eq('square_transaction_id', payment.id)

                    // Update booking if payment is completed
                    if (payment.status === 'COMPLETED') {
                        const { data: updatedBooking } = await supabase
                            .from('bookings')
                            .update({
                                deposit_status: 'paid',
                                payment_status: 'deposit_paid'
                            })
                            .eq('id', bookingId)
                            .select()
                            .single()

                        // Trigger Inngest Notifications
                        const { inngest } = await import('@/lib/inngest/client')
                        await inngest.send([
                            {
                                name: 'notification/booking.confirmed',
                                data: { bookingId }
                            },
                            {
                                name: 'notification/payment.succeeded',
                                data: {
                                    bookingId,
                                    transactionId: payment.id,
                                    amount: payment.amount_money.amount / 100, // Square amounts are in cents
                                    brand: payment.card_details.card.card_brand,
                                    last4: payment.card_details.card.last_4
                                }
                            }
                        ])
                    }
                }
                break
            }

            case 'refund.updated': {
                const refund = event.data.object.refund
                const bookingId = refund.reference_id

                if (bookingId) {
                    await supabase
                        .from('payment_transactions')
                        .update({ square_status: refund.status })
                        .eq('square_transaction_id', refund.id)

                    if (refund.status === 'COMPLETED') {
                        await supabase
                            .from('bookings')
                            .update({ refund_status: 'fully_refunded' })
                            .eq('id', bookingId)
                    }
                }
                break
            }

            // Add more cases as needed (payment.failed, etc.)
        }

        // 4. Log successful processing
        await supabase.from('webhook_events').insert({
            square_event_id: event.id,
            event_type: event.type,
            event_payload: event,
            processed_at: new Date().toISOString()
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('[Webhook Processing Error]:', error)

        // Log error to database for debugging
        try {
            await supabase.from('webhook_errors').insert({
                square_event_id: event.id,
                event_type: event.type,
                error_message: error.message || 'Unknown error',
                error_stack: error.stack || '',
                event_payload: event
            })

            // Alert admins via Inngest
            const { inngest } = await import('@/lib/inngest/client')
            await inngest.send({
                name: 'notification/webhook.failed',
                data: {
                    eventId: event.id,
                    eventType: event.type,
                    error: error.message,
                    timestamp: new Date().toISOString()
                }
            })
        } catch (logError) {
            // If logging fails, at least log to console
            console.error('[Failed to log webhook error]:', logError)
        }

        return NextResponse.json({ error: 'Internal processing error' }, { status: 500 })
    }
}

/**
 * Verifies the integrity and authenticity of the webhook request.
 */
function verifySquareSignature(
    signatureKey: string,
    notificationUrl: string,
    signature: string,
    body: string
): boolean {
    if (!signature || !signatureKey) return false

    const combined = notificationUrl + body
    const hmac = crypto.createHmac('sha256', signatureKey)
    hmac.update(combined)
    const expectedSignature = hmac.digest('base64')

    return expectedSignature === signature
}
