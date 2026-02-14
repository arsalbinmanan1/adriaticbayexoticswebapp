import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * API Route: /api/webhooks/square
 * Handles asynchronous event notifications from Square.
 */
export async function POST(request: Request) {
    const signature = (request.headers.get('x-square-hmacsha256-signature') || '').trim()
    const body = await request.text()

    // Build a best-effort notification URL from forwarded headers (behind proxies) or fall back to request.url
    const forwardedProto = request.headers.get('x-forwarded-proto') || new URL(request.url).protocol.replace(':', '')
    const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || new URL(request.url).host
    const pathname = new URL(request.url).pathname
    const computedUrl = `${forwardedProto}://${forwardedHost}${pathname}`

    // Prefer an explicit env var matching the URL configured in Square dashboard to avoid mismatches
    const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL || computedUrl

    // Debug logging (temporary) to help diagnose signature mismatches; do NOT log secrets
    console.info('[Webhook Debug] request.url=', request.url)
    console.info('[Webhook Debug] computedUrl=', computedUrl)
    console.info('[Webhook Debug] notificationUrlUsedForVerification=', notificationUrl)
    console.info('[Webhook Debug] incomingSignature=', signature)

    const isVerified = verifySquareSignature(
        process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
        notificationUrl,
        signature,
        body
    )

    if (!isVerified) {
        console.error('[Webhook Error]: Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = createAdminClient()

    console.log(`[Webhook Received]: ${event.type}`, event.data.id)
    // Insert a received event record (idempotency anchor) before responding
    try {
        await supabase.from('webhook_events').insert({
            square_event_id: event.id ?? null,
            event_type: event.type ?? null,
            event_payload: event,
            received_at: new Date().toISOString(),
            processed: false
        })
    } catch (insertErr) {
        console.error('[Webhook Insert Error]:', insertErr)
    }

    // Respond immediately so Square treats this delivery as successful
    const immediateResponse = NextResponse.json({ success: true, received: true })

    // Process the event asynchronously (background) so we don't block the HTTP response
    setImmediate(() => {
        ;(async () => {
            try {
                // re-check record & processed flag
                const { data: existingEvent } = await supabase
                    .from('webhook_events')
                    .select('*')
                    .eq('square_event_id', event.id)
                    .maybeSingle()

                if (existingEvent?.processed) {
                    console.log(`[Webhook Background]: Event ${event.id} already processed`)
                    return
                }

                // Processing logic
                switch (event.type) {
                    case 'payment.updated': {
                        const payment = event.data.object.payment
                        const bookingId = payment.reference_id

                        if (bookingId) {
                            await supabase
                                .from('payment_transactions')
                                .update({ square_status: payment.status })
                                .eq('square_transaction_id', payment.id)

                            if (payment.status === 'COMPLETED') {
                                await supabase
                                    .from('bookings')
                                    .update({
                                        deposit_status: 'paid',
                                        payment_status: 'deposit_paid',
                                        status: 'confirmed',
                                        updated_at: new Date().toISOString()
                                    })
                                    .eq('id', bookingId)

                                const { inngest } = await import('@/lib/inngest/client')
                                await inngest.send([
                                    { name: 'notification/booking.confirmed', data: { bookingId } },
                                    {
                                        name: 'notification/payment.succeeded',
                                        data: {
                                            bookingId,
                                            transactionId: payment.id,
                                            amount: payment.amount_money.amount / 100,
                                            brand: payment.card_details?.card?.card_brand,
                                            last4: payment.card_details?.card?.last_4
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
                                await supabase.from('bookings').update({ refund_status: 'fully_refunded' }).eq('id', bookingId)
                            }
                        }
                        break
                    }

                    default:
                        console.log('[Webhook Background] Unhandled event type:', event.type)
                }

                // mark processed
                await supabase
                    .from('webhook_events')
                    .update({ processed: true, processed_at: new Date().toISOString() })
                    .eq('square_event_id', event.id)
            } catch (bgErr: any) {
                console.error('[Webhook Background Error]:', bgErr)
                try {
                    await supabase.from('webhook_errors').insert({
                        square_event_id: event.id,
                        event_type: event.type,
                        error_message: bgErr?.message || String(bgErr),
                        error_stack: bgErr?.stack || '',
                        event_payload: event,
                        created_at: new Date().toISOString()
                    })
                } catch (logErr) {
                    console.error('[Failed to log webhook background error]:', logErr)
                }
            }
        })()
    })

    return immediateResponse
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
    const expectedSignature = hmac.digest('base64').trim()

    // Use timing-safe comparison and ensure buffers are same length
    try {
        const expectedBuf = Buffer.from(expectedSignature)
        const incomingBuf = Buffer.from(signature)
        if (expectedBuf.length !== incomingBuf.length) return false
        return crypto.timingSafeEqual(expectedBuf, incomingBuf)
    } catch (err) {
        console.error('[Webhook Signature Verify Error]:', err)
        return false
    }
}
