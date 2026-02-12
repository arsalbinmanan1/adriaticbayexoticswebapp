-- Ensure unpaid pending bookings do not block availability

CREATE OR REPLACE FUNCTION check_booking_availability(
    p_car_id UUID,
    p_pickup TIMESTAMPTZ,
    p_dropoff TIMESTAMPTZ,
    p_buffer_hours INTEGER DEFAULT 4
)
RETURNS TABLE (
    is_available BOOLEAN,
    conflict_id UUID,
    message TEXT
) AS $$
DECLARE
    v_buffer INTERVAL := (p_buffer_hours || ' hours')::INTERVAL;
    conflicting_id UUID;
BEGIN
    SELECT id INTO conflicting_id FROM cars
    WHERE id = p_car_id AND status != 'available' LIMIT 1;

    IF conflicting_id IS NOT NULL THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Vehicle is currently unavailable (Maintenance/Inactive)'::TEXT;
        RETURN;
    END IF;

    SELECT id INTO conflicting_id FROM bookings
    WHERE car_id = p_car_id
    AND (
        status IN ('confirmed', 'active')
        OR (status = 'pending' AND payment_status IN ('paid', 'deposit_paid'))
    )
    AND (
        (p_pickup, p_dropoff) OVERLAPS (pickup_datetime - v_buffer, dropoff_datetime + v_buffer)
    )
    LIMIT 1;

    IF conflicting_id IS NOT NULL THEN
        RETURN QUERY SELECT FALSE, conflicting_id, 'Vehicle is already booked for these dates (including cleaning buffer)'::TEXT;
        RETURN;
    END IF;

    RETURN QUERY SELECT TRUE, NULL::UUID, 'Available'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_booking_availability(
    p_car_id UUID,
    p_pickup TIMESTAMPTZ,
    p_dropoff TIMESTAMPTZ,
    p_buffer_hours INTEGER DEFAULT 4,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS TABLE (
    is_available BOOLEAN,
    conflict_id UUID,
    message TEXT
) AS $$
DECLARE
    v_buffer INTERVAL := (p_buffer_hours || ' hours')::INTERVAL;
    conflicting_id UUID;
BEGIN
    SELECT id INTO conflicting_id FROM cars
    WHERE id = p_car_id AND status != 'available' LIMIT 1;

    IF conflicting_id IS NOT NULL THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Vehicle is currently unavailable (Maintenance/Inactive)'::TEXT;
        RETURN;
    END IF;

    SELECT id INTO conflicting_id FROM bookings
    WHERE car_id = p_car_id
    AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
    AND (
        status IN ('confirmed', 'active')
        OR (status = 'pending' AND payment_status IN ('paid', 'deposit_paid'))
    )
    AND (
        (p_pickup, p_dropoff) OVERLAPS (pickup_datetime - v_buffer, dropoff_datetime + v_buffer)
    )
    LIMIT 1;

    IF conflicting_id IS NOT NULL THEN
        RETURN QUERY SELECT FALSE, conflicting_id, 'Vehicle is already booked for these dates (including cleaning buffer)'::TEXT;
        RETURN;
    END IF;

    RETURN QUERY SELECT TRUE, NULL::UUID, 'Available'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_booking_conflict(
    p_car_id UUID,
    p_pickup TIMESTAMPTZ,
    p_dropoff TIMESTAMPTZ,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    has_conflict BOOLEAN;
    v_buffer INTERVAL := INTERVAL '4 hours';
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM bookings
        WHERE car_id = p_car_id
        AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
        AND (
            status IN ('confirmed', 'active')
            OR (status = 'pending' AND payment_status IN ('paid', 'deposit_paid'))
        )
        AND (
            (p_pickup, p_dropoff) OVERLAPS (pickup_datetime - v_buffer, dropoff_datetime + v_buffer)
        )
    ) INTO has_conflict;

    RETURN has_conflict;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;
