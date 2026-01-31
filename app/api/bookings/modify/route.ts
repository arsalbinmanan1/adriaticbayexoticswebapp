import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculateAmounts } from '@/lib/payments/calculateAmounts'

/**
 * API Route: /api/bookings/modify
 * Allows admins or users to modify booking details (dates, car).
 * Recalculates pricing and updates record.
 */
export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { bookingId, pickupDatetime, dropoffDatetime, carId } = body

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // 1. Fetch current booking
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('*, cars(*)')
            .eq('id', bookingId)
            .single()

        if (fetchError || !booking) throw new Error('Booking not found')

        // 2. Check availability if dates/car changed
        if (pickupDatetime !== booking.pickup_datetime || dropoffDatetime !== booking.dropoff_datetime || (carId && carId !== booking.car_id)) {
            const { data: availability } = await supabase.rpc('check_booking_availability', {
                p_car_id: carId || booking.car_id,
                p_pickup: pickupDatetime || booking.pickup_datetime,
                p_dropoff: dropoffDatetime || booking.dropoff_datetime,
                p_buffer_hours: 4
            })

            const avail = Array.isArray(availability) ? availability[0] : availability
            if (!avail.is_available) {
                return NextResponse.json({ error: 'Selected dates/car are not available' }, { status: 409 })
            }
        }

        // 3. Recalculate Pricing
        const start = new Date(pickupDatetime || booking.pickup_datetime)
        const end = new Date(dropoffDatetime || booking.dropoff_datetime)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

        const pricing = calculateAmounts({
            dailyRate: Number(booking.cars.daily_rate),
            numberOfDays: days,
            discountValue: booking.discount_amount,
            discountType: booking.discount_type as any,
            addOns: [], // Simplified for now, or fetch existing addons
            deliveryFee: 0
        })

        // 4. Update Booking
        const { error: updateError } = await supabase
            .from('bookings')
            .update({
                pickup_datetime: pickupDatetime || booking.pickup_datetime,
                dropoff_datetime: dropoffDatetime || booking.dropoff_datetime,
                car_id: carId || booking.car_id,
                number_of_days: days,
                subtotal: pricing.rentalSubtotal,
                tax: pricing.taxAmount,
                total_amount: pricing.totalRentalAmount,
                modified_at: new Date().toISOString()

            })
            .eq('id', bookingId)

        if (updateError) throw updateError

        return NextResponse.json({ success: true, message: 'Booking modified successfully' })

    } catch (error: any) {
        console.error('[Modify Error]:', error)
        return NextResponse.json({ error: error.message || 'Failed to modify booking' }, { status: 500 })
    }
}
