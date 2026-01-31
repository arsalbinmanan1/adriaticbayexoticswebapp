import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * API Route: /api/bookings/availability
 * Checks if a specific car is available for a date range.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const carId = searchParams.get('carId')
        const pickup = searchParams.get('pickup')
        const dropoff = searchParams.get('dropoff')

        if (!carId || !pickup || !dropoff) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
        }

        const supabase = createAdminClient()

        const { data, error } = await supabase
            .rpc('check_booking_availability', {
                p_car_id: carId,
                p_pickup: pickup,
                p_dropoff: dropoff,
                p_buffer_hours: 4
            })

        if (error) throw error

        const result = Array.isArray(data) ? data[0] : data

        return NextResponse.json({
            available: result.is_available,
            message: result.message,
            conflictId: result.conflict_id
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to check availability' }, { status: 500 })
    }
}
