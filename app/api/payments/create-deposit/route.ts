import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { squareClient, parseSquareError } from '@/lib/square/client'
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

        // 7. Create Square Payment with unique idempotency key per attempt
        // Idempotency key max length is 45 characters
        const timestamp = Date.now().toString().slice(-10) // Last 10 digits
        const shortBookingId = String(bookingId).slice(0, 20)
        const idempotencyKey = `dep-${shortBookingId}-${timestamp}`.slice(0, 45)
        console.log(`[API: CREATE-DEPOSIT] Initiating Square payment. Idempotency=${idempotencyKey}`);

        // Create payment note (max 45 chars for Square)
        const bookingRef = String(booking.reference_number || bookingId).slice(0, 20)
        const paymentNote = `Deposit ${bookingRef}`.slice(0, 45)
        const referenceId = String(bookingId).slice(0, 40)

        console.log(`[API: CREATE-DEPOSIT] Payment fields:`, {
            noteLength: paymentNote.length,
            referenceIdLength: referenceId.length,
            note: paymentNote,
            referenceId: referenceId
        });

        const { payment } = await squareClient.payments.create({
            sourceId,
            idempotencyKey,
            amountMoney: {
                amount: BigInt(Math.round(serverPricing.securityDepositAmount * 100)), // Convert to cents
                currency: 'USD',
            },
            locationId: process.env.SQUARE_LOCATION_ID!,
            verificationToken, // Required for 3DS
            note: paymentNote,
            referenceId: referenceId,
        })

        if (!payment) {
            console.error(`[API: CREATE-DEPOSIT] Square payment object is null`);
            throw new Error('Square payment creation failed')
        }

        console.log(`[API: CREATE-DEPOSIT] Square payment SUCCESS: ${payment.id}, Status: ${payment.status}`);

        // 8. Log Transaction in Supabase
        const { error: txError } = await supabase
            .from('payment_transactions')
            .insert({
                booking_id: bookingId,
                square_transaction_id: payment.id,
                payment_type: 'security_deposit',
                amount: Number(payment.amountMoney?.amount || 0) / 100,
                currency: 'USD',
                card_last_4: payment.cardDetails?.card?.last4,
                card_brand: payment.cardDetails?.card?.cardBrand,
                square_status: payment.status,
                receipt_url: payment.receiptUrl,
                processing_fees: payment.processingFee?.[0]?.amountMoney?.amount ? Number(payment.processingFee[0].amountMoney.amount) / 100 : 0,
            })

        if (txError) console.error('[API: CREATE-DEPOSIT] Failed to log transaction:', txError)

        // 9. Update Booking Status (only if payment is COMPLETED)
        if (payment.status === 'COMPLETED') {
            const { error: bookingUpdateError } = await supabase
                .from('bookings')
                .update({
                    payment_status: 'paid',
                    status: 'confirmed',
                    expires_at: null // Clear expiration timer
                })
                .eq('id', bookingId)

            if (bookingUpdateError) console.error('[API: CREATE-DEPOSIT] Failed to update booking:', bookingUpdateError)
            else console.log(`[API: CREATE-DEPOSIT] Booking ${bookingId} updated to CONFIRMED`);
            
            // 10. Send confirmation email
            try {
                const { sendBookingConfirmationEmail } = await import('@/lib/email/send-booking-confirmation');
                
                // Fetch car details for email
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
                        taxAmount: booking.tax,
                        totalAmount: booking.total_amount,
                        depositPaid: serverPricing.securityDepositAmount,
                        
                        addOns: [] // Could fetch from booking data if stored
                    });
                    
                    console.log('[API: CREATE-DEPOSIT] Confirmation email sent successfully');
                }
            } catch (emailError) {
                // Don't fail the payment if email fails
                console.error('[API: CREATE-DEPOSIT] Failed to send confirmation email:', emailError);
            }
        } else {
            console.warn(`[API: CREATE-DEPOSIT] Payment status is ${payment.status}, not updating booking to confirmed`);
        }

        return NextResponse.json({
            success: true,
            paymentId: payment.id,
            status: payment.status,
            amount: serverPricing.securityDepositAmount,
        })

    } catch (error) {
        console.error(`[API: CREATE-DEPOSIT] FATAL ERROR:`, error);
        const userMessage = parseSquareError(error)
        return NextResponse.json({ error: userMessage }, { status: 500 })
    }
}
