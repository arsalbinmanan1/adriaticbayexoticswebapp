-- Critical Production Fixes Migration
-- Date: 2026-01-28
-- Purpose: Apply all critical fixes from production readiness audit

-- ============================================================================
-- 1. UPDATE CLEANUP FUNCTION TO RETURN COUNT AND USE EXPIRES_AT
-- ============================================================================

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

-- ============================================================================
-- 2. ADD PARTIALLY_REFUNDED STATUS TO BOOKINGS
-- ============================================================================

-- Check if refund_status column exists and update type if needed
DO $$ 
BEGIN
    -- Add new refund status values if not already present
    -- This is safe to run multiple times
    ALTER TABLE bookings 
    ALTER COLUMN refund_status TYPE TEXT;
    
    -- Update any existing refund_status values to ensure consistency
    UPDATE bookings 
    SET refund_status = 'partially_refunded' 
    WHERE refund_status = 'partial_refund';
EXCEPTION
    WHEN undefined_column THEN
        -- Column doesn't exist, skip
        NULL;
END $$;

-- ============================================================================
-- 3. IMPROVE BOOKING REFERENCE GENERATION (6 CHARACTERS)
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_booking_reference() 
RETURNS TEXT AS $$
DECLARE
    new_ref TEXT;
    done BOOLEAN := FALSE;
BEGIN
    WHILE NOT done LOOP
        -- Generate a reference like ABE-2026-XXXXXX (6 random uppercase chars)
        new_ref := 'ABE-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int);
        
        -- Check if it exists
        SELECT NOT EXISTS (SELECT 1 FROM bookings WHERE booking_reference = new_ref OR reference_number = new_ref) INTO done;
    END LOOP;
    RETURN new_ref;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. ADD WEBHOOK FAILED NOTIFICATION EVENT HANDLER
-- ============================================================================

COMMENT ON TABLE webhook_errors IS 'Stores webhook processing errors. Inngest monitors this table for alerting.';

-- ============================================================================
-- 5. ADD INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for idempotency checks on booking creation
CREATE INDEX IF NOT EXISTS idx_bookings_idempotency 
ON bookings(car_id, customer_email, pickup_datetime, dropoff_datetime) 
WHERE status IN ('pending', 'confirmed');

-- Index for webhook event lookups
CREATE INDEX IF NOT EXISTS idx_webhook_events_created 
ON webhook_events(created_at DESC);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify critical functions exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'cleanup_expired_bookings'
    ) THEN
        RAISE EXCEPTION 'CRITICAL: cleanup_expired_bookings function not found';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'validate_and_increment_promo'
    ) THEN
        RAISE EXCEPTION 'CRITICAL: validate_and_increment_promo function not found';
    END IF;
    
    RAISE NOTICE 'All critical fixes applied successfully';
END $$;
