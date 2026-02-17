import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
// Square integration disabled: import removed

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

        // Payments are disabled; simply return current booking status.
        if (booking.status === 'confirmed') {
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

        return NextResponse.json({
            success: false,
            status: 'PAYMENTS_DISABLED',
            message: 'Payments are disabled. Booking will be visible in admin panel without payment.'
        }, { status: 200 })

    } catch (error) {
        console.error(`[VERIFY-PAYMENT] Error:`, error)
        return NextResponse.json({
            error: 'Failed to verify payment'
        }, { status: 500 })
    }
}
