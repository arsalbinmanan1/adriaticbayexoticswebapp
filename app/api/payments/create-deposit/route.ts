import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
// Square integration disabled: import removed
import { calculateAmounts } from '@/lib/payments/calculateAmounts'
import { rateLimit, RateLimitPresets, getClientIdentifier } from '@/lib/rate-limit'

/**
 * API Route: /api/payments/create-deposit
 * Handles the creation of a security deposit payment via Square.
 */
export async function POST(request: Request) {
    try {
        // 1. Rate Limiting
        const identifier = getClientIdentifier(request)
        const rateLimitResult = await rateLimit(identifier, RateLimitPresets.payment)

        if (!rateLimitResult.success) {
            console.warn(`[API: CREATE-DEPOSIT] Rate limit exceeded for ${identifier}`);
            return NextResponse.json({
                error: 'Too many payment attempts. Please wait a moment and try again.',
                retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
            }, { status: 429 })
        }

        const { bookingId, sourceId, verificationToken } = await request.json()
        console.log(`[API: CREATE-DEPOSIT] Request received for bookingId: ${bookingId}`);

        if (!bookingId || !sourceId) {
            console.error(`[API: CREATE-DEPOSIT] Missing fields: bookingId=${bookingId}, sourceId=${!!sourceId}`);
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // 2. Check for existing payment (idempotency)
        const { data: existingPayment } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('booking_id', bookingId)
            .eq('payment_type', 'security_deposit')
            .eq('square_status', 'COMPLETED')
            .maybeSingle()

        if (existingPayment) {
            console.log(`[API: CREATE-DEPOSIT] Payment already exists for booking ${bookingId}`);
            return NextResponse.json({
                success: true,
                paymentId: existingPayment.square_transaction_id,
                status: 'COMPLETED',
                amount: existingPayment.amount,
                message: 'Payment already processed'
            })
        }

        // 3. Fetch Booking details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*, cars(daily_rate)')
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) {
            console.error(`[API: CREATE-DEPOSIT] Booking lookup failed for ${bookingId}:`, bookingError);
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        console.log(`[API: CREATE-DEPOSIT] Found booking for ${booking.customer_name}. Total due: ${booking.total_amount}`);

        // 4. Fetch Promo Code if applied
        let promoData = null
        if (booking.promo_code) {
            const { data: promo } = await supabase
                .from('promo_codes')
                .select('*')
                .eq('code', booking.promo_code)
                .eq('status', 'active')
                .single()
            promoData = promo
        }

        // 5. Calculate Amounts SERVER-SIDE (never trust client)
        const serverPricing = calculateAmounts({
            dailyRate: Number(booking.cars.daily_rate),
            numberOfDays: booking.number_of_days,
            discountValue: promoData?.discount_value ? Number(promoData.discount_value) : 0,
            discountType: promoData?.discount_type as any,
            addOns: booking.fees ? [{ id: 'total-fees', name: 'Add-ons & Fees', price: Number(booking.fees), type: 'fixed' }] : [],
            deliveryFee: 0,
            fixedDeposit: Number(booking.deposit_amount) // Use stored deposit amount
        })

        // 6. Verify amounts match booking (detect tampering)
        const expectedDeposit = serverPricing.securityDepositAmount
        const storedDeposit = Number(booking.deposit_amount) // Use actual stored deposit amount

        if (Math.abs(expectedDeposit - storedDeposit) > 0.01) {
            console.error(`[API: CREATE-DEPOSIT] Amount mismatch! Expected: ${expectedDeposit}, Stored: ${storedDeposit}, BookingID: ${bookingId}`);
            return NextResponse.json({
                error: 'Payment amount verification failed. Please refresh and try again.',
                debug: process.env.NODE_ENV === 'development' ? { expected: expectedDeposit, stored: storedDeposit } : undefined
            }, { status: 400 })
        }

        // Square is disabled: mark booking as confirmed without payment
        const { error: bookingUpdateError } = await supabase
            .from('bookings')
            .update({
                payment_status: 'unpaid',
                status: 'confirmed',
                expires_at: null
            })
            .eq('id', bookingId)

        if (bookingUpdateError) {
            console.error('[API: CREATE-DEPOSIT] Failed to update booking when payments are disabled:', bookingUpdateError)
            return NextResponse.json({ error: 'Failed to confirm booking' }, { status: 500 })
        }

        // Optional: send confirmation email (keep original behavior)
        try {
            const { sendBookingConfirmationEmail } = await import('@/lib/email/send-booking-confirmation');
            const { data: car } = await supabase
                .from('cars')
                .select('make, model, year, images')
                .eq('id', booking.car_id)
                .single();

            if (car) {
                await sendBookingConfirmationEmail({
                    bookingId: booking.id,
                    customerName: booking.customer_name,
                    customerEmail: booking.customer_email,
                    customerPhone: booking.customer_phone,

                    carMake: car.make,
                    carModel: car.model,
                    carYear: car.year,
                    carImage: car.images?.[0] ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${car.images[0]}` : undefined,

                    pickupDatetime: booking.pickup_datetime,
                    dropoffDatetime: booking.dropoff_datetime,
                    pickupLocation: booking.pickup_location,
                    dropoffLocation: booking.dropoff_location,

                    numberOfDays: booking.number_of_days,
                    dailyRate: Number(booking.base_rate),
                    baseRental: booking.subtotal,
                    addOnsTotal: booking.fees || 0,
                    discountAmount: booking.discount_amount || 0,
                    promoCode: booking.promo_code,
                    totalAmount: booking.total_amount,
                    depositPaid: serverPricing.securityDepositAmount,

                    addOns: []
                });
            }
        } catch (emailError) {
            console.error('[API: CREATE-DEPOSIT] Failed to send confirmation email after disabling payments:', emailError);
        }

        return NextResponse.json({
            success: true,
            message: 'Payments are disabled. Booking confirmed and visible in admin panel.',
            bookingId,
            amount: serverPricing.securityDepositAmount
        })

    } catch (error) {
        console.error(`[API: CREATE-DEPOSIT] FATAL ERROR:`, error);
        return NextResponse.json({ error: 'Payments are disabled.' }, { status: 500 })
    }
}
