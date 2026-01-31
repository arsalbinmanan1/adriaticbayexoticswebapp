-- Module 4: Booking Utility Functions

-- 1. Check Booking Availability (Returns structured info)
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
    -- Check if car is in maintenance or inactive
    SELECT id INTO conflicting_id FROM cars 
    WHERE id = p_car_id AND status != 'available' LIMIT 1;
    
    IF conflicting_id IS NOT NULL THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Vehicle is currently unavailable (Maintenance/Inactive)'::TEXT;
        RETURN;
    END IF;

    -- Check for overlapping bookings
    SELECT id INTO conflicting_id FROM bookings
    WHERE car_id = p_car_id 
    AND status IN ('pending', 'confirmed', 'active')
    AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
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

-- 2. Cleanup Expired Bookings
-- Releases 'pending' bookings that have expired
CREATE OR REPLACE FUNCTION cleanup_expired_bookings()
RETURNS INTEGER AS $$
DECLARE
    cleaned_count INTEGER;
BEGIN
    -- Cancel bookings that have passed their expiration time
    UPDATE bookings
    SET status = 'cancelled',
        cancellation_reason = 'Payment timeout (Abandoned draft)',
        cancelled_at = NOW()
    WHERE status = 'pending'
    AND (
        -- Use expires_at if set, otherwise fall back to created_at + 15 minutes
        (expires_at IS NOT NULL AND expires_at < NOW())
        OR (expires_at IS NULL AND created_at < NOW() - INTERVAL '15 minutes')
    );
    
    GET DIAGNOSTICS cleaned_count = ROW_COUNT;
    RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Blacklist Checker (Used in API or as a function)
CREATE OR REPLACE FUNCTION is_customer_blacklisted(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM blacklisted_customers WHERE email = p_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
