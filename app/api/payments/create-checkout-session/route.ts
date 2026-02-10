import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { squareClient, parseSquareError } from '@/lib/square/client'
import { rateLimit, RateLimitPresets, getClientIdentifier } from '@/lib/rate-limit'
import { normalizePhoneNumber } from '@/lib/validation/phone'

/**
 * API Route: /api/payments/create-checkout-session
 * Creates a Square Checkout session and returns the checkout URL
 */
export async function POST(request: Request) {
    try {
        console.log('[API: CREATE-CHECKOUT-SESSION] Start request')

        // 1. Rate Limiting
        const identifier = getClientIdentifier(request)
        const rateLimitResult = await rateLimit(identifier, RateLimitPresets.payment)

        if (!rateLimitResult.success) {
            console.warn(`[API: CREATE-CHECKOUT-SESSION] Rate limit exceeded for ${identifier}`);
            return NextResponse.json({
                error: 'Too many requests. Please wait a moment and try again.',
                retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
            }, { status: 429 })
        }

        const { bookingId } = await request.json()
        console.log(`[API: CREATE-CHECKOUT-SESSION] Request received for bookingId: ${bookingId}`);

        if (!bookingId) {
            console.error(`[API: CREATE-CHECKOUT-SESSION] Missing bookingId`);
            return NextResponse.json({ error: 'Missing required field: bookingId' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // 2. Fetch Booking details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*, cars(daily_rate, make, model, year)')
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) {
            console.error(`[API: CREATE-CHECKOUT-SESSION] Booking lookup failed for ${bookingId}:`, bookingError);
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        console.log(`[API: CREATE-CHECKOUT-SESSION] Found booking for ${booking.customer_name}. Deposit: ${booking.deposit_amount}`);
        console.log('[API: CREATE-CHECKOUT-SESSION] Booking snapshot', {
            bookingId: booking.id,
            carId: booking.car_id,
            hasCarJoin: !!booking.cars
        })

        const squareLocationId = process.env.SQUARE_LOCATION_ID
        const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN

        if (!squareLocationId || !squareAccessToken) {
            console.error('[API: CREATE-CHECKOUT-SESSION] Square env missing', {
                hasLocationId: !!squareLocationId,
                hasAccessToken: !!squareAccessToken
            })
            return NextResponse.json({
                error: 'Square is not configured. Please contact support.'
            }, { status: 500 })
        }

        if (!booking.cars) {
            console.error('[API: CREATE-CHECKOUT-SESSION] Missing car details on booking', {
                bookingId
            })
            return NextResponse.json({
                error: 'Booking is missing car details. Please contact support.'
            }, { status: 500 })
        }

        // 3. Calculate amount (server-side verification)
        const depositAmount = Number(booking.deposit_amount)

        if (!depositAmount || depositAmount <= 0) {
            console.error(`[API: CREATE-CHECKOUT-SESSION] Invalid deposit amount: ${depositAmount}`);
            return NextResponse.json({ error: 'Invalid deposit amount' }, { status: 400 })
        }

        // 4. Create Square Checkout session
        const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`
        const idempotencyKey = `checkout-${bookingId}-${Date.now()}`.slice(0, 45)

        console.log(`[API: CREATE-CHECKOUT-SESSION] Creating Square Checkout. Idempotency=${idempotencyKey}`);
        console.log('[API: CREATE-CHECKOUT-SESSION] Square payload summary', {
            locationId: squareLocationId,
            amountCents: Math.round(depositAmount * 100),
            redirectUrl: `${checkoutUrl}?bookingId=${bookingId}`
        })

        const normalizedPhone = normalizePhoneNumber(booking.customer_phone)
        const rawPhone = booking.customer_phone || ''
        const maskPhone = (value: string) => {
            const digits = value.replace(/\D/g, '')
            if (digits.length <= 4) return digits
            return `${'*'.repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`
        }

        console.log('[API: CREATE-CHECKOUT-SESSION] Phone formatting', {
            rawMasked: maskPhone(String(rawPhone)),
            normalizedMasked: normalizedPhone ? maskPhone(normalizedPhone) : null,
            normalizedLength: normalizedPhone?.length || 0
        })
        const result = await squareClient.checkout.paymentLinks.create({
            idempotencyKey,
            order: {
                locationId: squareLocationId,
                lineItems: [{
                    name: `Security Deposit - ${booking.cars.year} ${booking.cars.make} ${booking.cars.model}`,
                    quantity: '1',
                    basePriceMoney: {
                        amount: BigInt(Math.round(depositAmount * 100)), // Convert to cents
                        currency: 'USD'
                    }
                }],
                metadata: {
                    bookingId: String(bookingId),
                    customerEmail: booking.customer_email,
                    customerName: booking.customer_name
                }
            },
            checkoutOptions: {
                redirectUrl: `${checkoutUrl}?bookingId=${bookingId}`,
                askForShippingAddress: false,
                acceptedPaymentMethods: {
                    applePay: true,
                    googlePay: true,
                    cashAppPay: false,
                    afterpayClearpay: false
                }
            },
            prePopulatedData: {
                buyerEmail: booking.customer_email,
                buyerPhoneNumber: normalizedPhone || undefined
            }
        })

        const paymentLink = result.paymentLink

        if (!paymentLink || !paymentLink.url) {
            console.error(`[API: CREATE-CHECKOUT-SESSION] Square checkout creation failed`);
            throw new Error('Failed to create checkout session')
        }

        console.log(`[API: CREATE-CHECKOUT-SESSION] Square checkout created: ${paymentLink.id}`);

        // 5. Store the payment link ID in booking for reference
        await supabase
            .from('bookings')
            .update({
                square_payment_link_id: paymentLink.id
            })
            .eq('id', bookingId)

        console.log('[API: CREATE-CHECKOUT-SESSION] Stored payment link on booking', {
            bookingId,
            paymentLinkId: paymentLink.id
        })

        return NextResponse.json({
            success: true,
            checkoutUrl: paymentLink.url,
            paymentLinkId: paymentLink.id
        })

    } catch (error) {
        console.error(`[API: CREATE-CHECKOUT-SESSION] FATAL ERROR:`, error);
        const userMessage = parseSquareError(error)
        const isDev = process.env.NODE_ENV !== 'production'
        const debug = isDev && error instanceof Error
            ? { name: error.name, message: error.message }
            : undefined

        return NextResponse.json({ error: userMessage, debug }, { status: 500 })
    }
}
