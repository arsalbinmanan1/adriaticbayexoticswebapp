import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
// Square integration disabled: import removed
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

        // Square disabled: skip environment checks

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

        // Square disabled: confirm booking immediately without payment
        const { error: bookingUpdateError } = await supabase
            .from('bookings')
            .update({
                payment_status: 'unpaid',
                status: 'confirmed',
                square_payment_link_id: null,
                expires_at: null
            })
            .eq('id', bookingId)

        if (bookingUpdateError) {
            console.error('[API: CREATE-CHECKOUT-SESSION] Failed to confirm booking when payments disabled:', bookingUpdateError)
            return NextResponse.json({ error: 'Failed to confirm booking' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Payments disabled. Booking confirmed and visible in admin panel.'
        })

    } catch (error) {
        console.error(`[API: CREATE-CHECKOUT-SESSION] FATAL ERROR:`, error);
        const isDev = process.env.NODE_ENV !== 'production'
        const debug = isDev && error instanceof Error
            ? { name: error.name, message: error.message }
            : undefined

        return NextResponse.json({ error: 'Payments are disabled.', debug }, { status: 500 })
    }
}
