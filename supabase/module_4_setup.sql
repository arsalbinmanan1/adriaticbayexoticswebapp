/*
  Adriatic Bay Exotics - MODULE 4 CONSOLIDATED SETUP
  Description: All database changes for Booking System & Logic in one file.
  Includes: Admin Auth, Reference Generation, Availability Checks (with buffers), 
  Cancellation & Refund Logic, Analytics Views, and History Tracking.
*/

-- 1. ADMINS & BLACKLIST TABLES
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blacklisted_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BOOKING REFERENCE GENERATION
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_reference TEXT UNIQUE;

-- We use CASCADE to ensure any triggers depending on these functions are also handled
DROP FUNCTION IF EXISTS generate_booking_reference() CASCADE;
CREATE OR REPLACE FUNCTION generate_booking_reference() 
RETURNS TEXT AS $$
DECLARE
    new_ref TEXT;
    done BOOLEAN := FALSE;
BEGIN
    WHILE NOT done LOOP
        new_ref := 'ABE-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int);
        SELECT NOT EXISTS (SELECT 1 FROM bookings WHERE booking_reference = new_ref) INTO done;
    END LOOP;
    RETURN new_ref;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS set_booking_reference();
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_reference IS NULL THEN
        NEW.booking_reference := generate_booking_reference();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_booking_reference ON bookings;
CREATE TRIGGER trigger_set_booking_reference
BEFORE INSERT ON bookings
FOR EACH ROW EXECUTE PROCEDURE set_booking_reference();

-- 3. AVAILABILITY & CONFLICT LOGIC (4-hour buffer)
DROP FUNCTION IF EXISTS check_booking_conflict(UUID, TIMESTAMPTZ, TIMESTAMPTZ, UUID);
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
        AND status IN ('pending', 'confirmed', 'active')
        AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
        AND (
            (p_pickup, p_dropoff) OVERLAPS (pickup_datetime - v_buffer, dropoff_datetime + v_buffer)
        )
    ) INTO has_conflict;
    RETURN has_conflict;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP FUNCTION IF EXISTS check_booking_availability(UUID, TIMESTAMPTZ, TIMESTAMPTZ, INTEGER, UUID);
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

DROP FUNCTION IF EXISTS get_available_cars(TIMESTAMPTZ, TIMESTAMPTZ);
CREATE OR REPLACE FUNCTION get_available_cars(p_pickup TIMESTAMPTZ, p_dropoff TIMESTAMPTZ)
RETURNS SETOF cars AS $$
BEGIN
    RETURN QUERY SELECT c.* FROM cars c 
    WHERE c.status = 'available' 
    AND c.deleted_at IS NULL
    AND NOT check_booking_conflict(c.id, p_pickup, p_dropoff);
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. UTILITY FUNCTIONS
DROP FUNCTION IF EXISTS cleanup_expired_bookings();
CREATE OR REPLACE FUNCTION cleanup_expired_bookings()
RETURNS VOID AS $$
BEGIN
    UPDATE bookings
    SET status = 'cancelled',
        cancellation_reason = 'Payment timeout (Abandoned draft)',
        cancelled_at = NOW()
    WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP FUNCTION IF EXISTS is_customer_blacklisted(TEXT);
CREATE OR REPLACE FUNCTION is_customer_blacklisted(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM blacklisted_customers WHERE email = p_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CANCELLATION LOGIC
DROP FUNCTION IF EXISTS process_booking_cancellation(UUID, TEXT, UUID);
CREATE OR REPLACE FUNCTION process_booking_cancellation(
    p_booking_id UUID,
    p_reason TEXT,
    p_admin_id UUID DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    refund_amount DECIMAL(12, 2)
) AS $$
DECLARE
    v_booking RECORD;
    v_pickup TIMESTAMPTZ;
    v_deposit DECIMAL(12, 2);
    v_hours_until_pickup INTEGER;
    v_refund_perc DECIMAL(5, 2) := 0;
    v_calc_refund DECIMAL(12, 2) := 0;
BEGIN
    SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id;
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Booking not found'::TEXT, 0::DECIMAL;
        RETURN;
    END IF;
    IF v_booking.status = 'cancelled' THEN
        RETURN QUERY SELECT FALSE, 'Booking is already cancelled'::TEXT, 0::DECIMAL;
        RETURN;
    END IF;

    v_pickup := v_booking.pickup_datetime;
    v_deposit := v_booking.deposit_amount;
    v_hours_until_pickup := EXTRACT(EPOCH FROM (v_pickup - NOW())) / 3600;

    IF v_hours_until_pickup > 48 THEN
        v_refund_perc := 1.0;
    ELSIF v_hours_until_pickup >= 24 THEN
        v_refund_perc := 0.5;
    ELSE
        v_refund_perc := 0;
    END IF;

    v_calc_refund := v_deposit * v_refund_perc;

    UPDATE bookings
    SET status = 'cancelled',
        cancellation_reason = p_reason,
        cancelled_at = NOW(),
        refund_status = CASE WHEN v_calc_refund > 0 THEN 'pending_refund' ELSE 'no_refund' END,
        updated_at = NOW()
    WHERE id = p_booking_id;

    INSERT INTO booking_audit_logs (booking_id, old_status, new_status, notes, changed_by)
    VALUES (p_booking_id, v_booking.status, 'cancelled', p_reason, p_admin_id);

    RETURN QUERY SELECT TRUE, 'Booking cancelled successfully'::TEXT, v_calc_refund;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. HISTORY & ANALYTICS
CREATE TABLE IF NOT EXISTS booking_modifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    modified_by UUID,
    old_data JSONB,
    new_data JSONB,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE VIEW booking_analytics_summary AS
SELECT 
    COUNT(*) as total_bookings,
    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
    ROUND(SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2) as conversion_rate,
    SUM(total_amount) as total_potential_revenue,
    SUM(total_amount) FILTER (WHERE status IN ('confirmed', 'active', 'completed')) as actual_revenue
FROM bookings;

CREATE OR REPLACE VIEW popular_cars_analytics AS
SELECT 
    c.make,
    c.model,
    COUNT(b.id) as booking_count,
    SUM(b.total_amount) as total_revenue
FROM cars c
JOIN bookings b ON c.id = b.car_id
WHERE b.status IN ('confirmed', 'active', 'completed')
GROUP BY c.make, c.model;

CREATE OR REPLACE VIEW promo_code_analytics AS
SELECT 
    promo_code,
    COUNT(*) as use_count,
    SUM(discount_amount) as total_discount_given,
    SUM(total_amount) as total_revenue_generated
FROM bookings
WHERE promo_code IS NOT NULL
GROUP BY promo_code;

-- SEED DATA
INSERT INTO admins (email, password_hash, full_name)
VALUES ('admin@adriaticbayexotics.com', '$2a$10$YOUR_B_CRYPT_HASH_HERE', 'System Admin')
ON CONFLICT (email) DO NOTHING;
