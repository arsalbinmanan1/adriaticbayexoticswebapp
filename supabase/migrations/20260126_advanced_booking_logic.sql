/*
  Adriatic Bay Exotics - Advanced Booking Logic (Module 4)
  Description: Enhances booking lifecycle management, availability checks with buffers, 
  and automated reference generation.
*/

-- 1. MODIFICATIONS TO BOOKINGS TABLE
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS reference_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '15 minutes'),
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS modified_at TIMESTAMPTZ DEFAULT NOW();

-- 2. REFERENCE NUMBER GENERATION
-- Format: ABE-YYYY-RANDOM (e.g., ABE-2026-X7Y2)
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
DECLARE
    new_ref TEXT;
    done BOOLEAN := FALSE;
BEGIN
    IF NEW.reference_number IS NOT NULL THEN
        RETURN NEW;
    END IF;

    WHILE NOT done LOOP
        new_ref := 'ABE-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 6));
        
        -- Check if it exists
        IF NOT EXISTS (SELECT 1 FROM bookings WHERE reference_number = new_ref) THEN
            done := TRUE;
        END IF;
    END LOOP;

    NEW.reference_number := new_ref;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_reference ON bookings;
CREATE TRIGGER trg_generate_reference
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION generate_booking_reference();

-- 3. ENHANCED AVAILABILITY CHECK WITH BUFFER
-- p_buffer_hours: Default 4 hours for cleaning/maintenance
CREATE OR REPLACE FUNCTION check_booking_availability(
    p_car_id UUID,
    p_pickup TIMESTAMPTZ,
    p_dropoff TIMESTAMPTZ,
    p_buffer_hours INTEGER DEFAULT 4
) RETURNS TABLE (
    is_available BOOLEAN,
    conflict_id UUID,
    message TEXT
) AS $$
DECLARE
    buffer_pickup TIMESTAMPTZ;
    buffer_dropoff TIMESTAMPTZ;
BEGIN
    buffer_pickup := p_pickup - (p_buffer_hours || ' hours')::INTERVAL;
    buffer_dropoff := p_dropoff + (p_buffer_hours || ' hours')::INTERVAL;

    -- 1. Check if car exists and is available for rent generally
    IF NOT EXISTS (SELECT 1 FROM cars WHERE id = p_car_id AND status = 'available') THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Vehicle is currently offline for maintenance or unavailable.';
        RETURN;
    END IF;

    -- 2. Check for overlapping bookings (excluding cancelled)
    -- Include a buffer for turnaround
    SELECT id INTO conflict_id
    FROM bookings
    WHERE car_id = p_car_id
    AND status NOT IN ('cancelled', 'completed')
    AND (
        (p_pickup, p_dropoff) OVERLAPS (pickup_datetime - (p_buffer_hours || ' hours')::INTERVAL, dropoff_datetime + (p_buffer_hours || ' hours')::INTERVAL)
    )
    LIMIT 1;

    IF conflict_id IS NOT NULL THEN
        RETURN QUERY SELECT FALSE, conflict_id, 'Vehicle is booked or in turnaround buffer during this period.';
    ELSE
        RETURN QUERY SELECT TRUE, NULL::UUID, 'Vehicle is available.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CANCELLATION & REFUND LOGIC
-- Rules:
-- > 48h: 100% refund
-- 24h-48h: 50% refund
-- < 24h: 0% refund
CREATE OR REPLACE FUNCTION process_booking_cancellation(
    p_booking_id UUID,
    p_reason TEXT,
    p_admin_id UUID DEFAULT NULL
) RETURNS TABLE (
    success BOOLEAN,
    refund_amount DECIMAL(12, 2),
    message TEXT
) AS $$
DECLARE
    v_pickup TIMESTAMPTZ;
    v_deposit DECIMAL(12, 2);
    v_hours_diff NUMERIC;
    v_refund DECIMAL(12, 2);
BEGIN
    -- 1. Fetch booking info
    SELECT pickup_datetime, deposit_amount INTO v_pickup, v_deposit
    FROM bookings
    WHERE id = p_booking_id AND status != 'cancelled';

    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 0.00, 'Booking not found or already cancelled.';
        RETURN;
    END IF;

    -- 2. Calculate time difference
    v_hours_diff := EXTRACT(EPOCH FROM (v_pickup - NOW())) / 3600;

    -- 3. Determine refund
    IF v_hours_diff >= 48 THEN
        v_refund := v_deposit;
    ELSIF v_hours_diff >= 24 THEN
        v_refund := v_deposit * 0.5;
    ELSE
        v_refund := 0.00;
    END IF;

    -- 4. Update booking
    UPDATE bookings
    SET 
        status = 'cancelled',
        cancellation_reason = p_reason,
        internal_notes = COALESCE(internal_notes, '') || ' | Cancelled by ' || COALESCE(p_admin_id::text, 'customer') || ' at ' || NOW(),
        modified_at = NOW()
    WHERE id = p_booking_id;

    RETURN QUERY SELECT TRUE, v_refund, 'Booking cancelled successfully.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. EXPIRED BOOKING CLEANUP
-- Clears bookings in 'pending' status that haven't been paid within 15 mins
CREATE OR REPLACE FUNCTION cleanup_expired_bookings()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE bookings
    SET status = 'cancelled',
        cancellation_reason = 'System: Unpaid booking expired',
        modified_at = NOW()
    WHERE status = 'pending'
    AND expires_at < NOW();

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
