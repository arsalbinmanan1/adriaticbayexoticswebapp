-- Critical Security Fixes Migration
-- Date: 2026-01-28
-- Purpose: Fix critical issues identified in QA audit

-- ============================================================================
-- 1. CREATE MISSING TABLES
-- ============================================================================

-- Webhook Events Table (for idempotency)
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    square_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    event_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_square_id ON webhook_events(square_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(event_type);

-- Webhook Errors Table (for debugging)
CREATE TABLE IF NOT EXISTS webhook_errors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    square_event_id TEXT,
    event_type TEXT,
    error_message TEXT,
    error_stack TEXT,
    event_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_errors_event_id ON webhook_errors(square_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_errors_created ON webhook_errors(created_at DESC);

-- Booking Audit Logs Table (for tracking changes)
CREATE TABLE IF NOT EXISTS booking_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT,
    notes TEXT,
    changed_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_booking ON booking_audit_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON booking_audit_logs(created_at DESC);

-- ============================================================================
-- 2. ADD MISSING INDEXES
-- ============================================================================

-- Index for booking reference lookups
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference_number);

-- Index for expired booking cleanup (partial index for efficiency)
CREATE INDEX IF NOT EXISTS idx_bookings_expires_at ON bookings(expires_at) 
WHERE status = 'pending';

-- Index for payment transaction lookups
CREATE INDEX IF NOT EXISTS idx_payment_booking_type ON payment_transactions(booking_id, payment_type);

-- ============================================================================
-- 3. FIX AVAILABILITY FUNCTION (Add missing parameter)
-- ============================================================================

CREATE OR REPLACE FUNCTION check_booking_availability(
    p_car_id UUID,
    p_pickup TIMESTAMPTZ,
    p_dropoff TIMESTAMPTZ,
    p_buffer_hours INTEGER DEFAULT 4,
    p_exclude_booking_id UUID DEFAULT NULL  -- ← ADDED PARAMETER
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

    -- 2. Check for overlapping bookings (excluding cancelled and specified booking)
    SELECT id INTO conflict_id
    FROM bookings
    WHERE car_id = p_car_id
    AND status NOT IN ('cancelled', 'completed')
    AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)  -- ← EXCLUDE LOGIC
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

-- ============================================================================
-- 4. FIX PROMO CODE VALIDATION (Atomic with row locking)
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_and_increment_promo(
    p_code TEXT,
    p_rental_days INTEGER DEFAULT NULL,
    p_car_id UUID DEFAULT NULL
) RETURNS TABLE (
    valid BOOLEAN,
    message TEXT,
    discount_type TEXT,
    discount_value DECIMAL(12, 2)
) AS $$
DECLARE
    v_promo RECORD;
    v_car_category TEXT;
BEGIN
    -- Lock the promo code row to prevent race conditions
    SELECT * INTO v_promo 
    FROM promo_codes 
    WHERE code = UPPER(p_code)
    FOR UPDATE;  -- ← ROW LOCK

    -- Check if promo exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Invalid promo code'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Check status
    IF v_promo.status != 'active' THEN
        RETURN QUERY SELECT FALSE, 'This promo code is no longer active'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Check dates
    IF v_promo.start_date > NOW() THEN
        RETURN QUERY SELECT FALSE, 'This promo code is not active yet'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    IF v_promo.end_date < NOW() THEN
        RETURN QUERY SELECT FALSE, 'This promo code has expired'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Check usage limits (BEFORE incrementing)
    IF v_promo.max_uses IS NOT NULL AND v_promo.times_used >= v_promo.max_uses THEN
        RETURN QUERY SELECT FALSE, 'This promo code has reached its usage limit'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Check rental days requirement
    IF p_rental_days IS NOT NULL AND v_promo.min_rental_days IS NOT NULL AND p_rental_days < v_promo.min_rental_days THEN
        RETURN QUERY SELECT FALSE, 
            format('This promo code requires a minimum of %s rental days', v_promo.min_rental_days),
            NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Check car category restriction
    IF p_car_id IS NOT NULL AND v_promo.applicable_car_categories IS NOT NULL 
       AND jsonb_array_length(v_promo.applicable_car_categories) > 0 THEN
        SELECT category INTO v_car_category FROM cars WHERE id = p_car_id;
        
        IF v_car_category IS NOT NULL 
           AND NOT (v_promo.applicable_car_categories @> to_jsonb(v_car_category)) THEN
            RETURN QUERY SELECT FALSE, 'This promo code is not applicable to the selected car'::TEXT, NULL::TEXT, NULL::DECIMAL;
            RETURN;
        END IF;
    END IF;

    -- All validations passed - INCREMENT ATOMICALLY
    UPDATE promo_codes 
    SET times_used = times_used + 1,
        updated_at = NOW()
    WHERE code = UPPER(p_code);

    -- Return success with promo details
    RETURN QUERY SELECT 
        TRUE, 
        'Promo code applied successfully'::TEXT,
        v_promo.discount_type::TEXT,
        v_promo.discount_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. FIX RLS POLICIES
-- ============================================================================

-- Drop broken policies that rely on Supabase Auth (which we don't use)
DROP POLICY IF EXISTS "Users can only view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Public can view available cars" ON cars;
DROP POLICY IF EXISTS "Admins have full access to cars" ON cars;
DROP POLICY IF EXISTS "Admins have full access to bookings" ON bookings;

-- Since we use service role for all operations, create simple policies
-- that only allow service role access (API routes handle authorization)

CREATE POLICY "Service role full access to bookings" 
ON bookings FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to cars" 
ON cars FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- For public car viewing, create a specific SELECT policy
CREATE POLICY "Public can view available cars" 
ON cars FOR SELECT 
USING (status = 'available' AND deleted_at IS NULL);

-- ============================================================================
-- 6. ADD ENVIRONMENT VARIABLE DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE webhook_events IS 'Stores processed webhook events for idempotency checking';
COMMENT ON TABLE webhook_errors IS 'Logs webhook processing errors for debugging';
COMMENT ON TABLE booking_audit_logs IS 'Tracks all booking status changes for audit trail';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
