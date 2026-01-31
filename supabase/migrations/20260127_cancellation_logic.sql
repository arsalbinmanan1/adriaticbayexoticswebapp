-- Module 4: Cancellation & Refund Logic

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
    -- 1. Fetch booking details
    SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Booking not found'::TEXT, 0::DECIMAL;
        RETURN;
    END IF;

    IF v_booking.status = 'cancelled' THEN
        RETURN QUERY SELECT FALSE, 'Booking is already cancelled'::TEXT, 0::DECIMAL;
        RETURN;
    END IF;

    IF v_booking.status = 'completed' THEN
        RETURN QUERY SELECT FALSE, 'Cannot cancel a completed booking'::TEXT, 0::DECIMAL;
        RETURN;
    END IF;

    v_pickup := v_booking.pickup_datetime;
    v_deposit := v_booking.deposit_amount;
    v_hours_until_pickup := EXTRACT(EPOCH FROM (v_pickup - NOW())) / 3600;

    -- 2. Calculate Refund Percentage based on rules:
    -- Full refund: >48 hours before pickup
    -- 50% refund: 24-48 hours before
    -- No refund: <24 hours before
    IF v_hours_until_pickup > 48 THEN
        v_refund_perc := 1.0;
    ELSIF v_hours_until_pickup >= 24 THEN
        v_refund_perc := 0.5;
    ELSE
        v_refund_perc := 0;
    END IF;

    v_calc_refund := v_deposit * v_refund_perc;

    -- 3. Update Booking Status
    UPDATE bookings
    SET status = 'cancelled',
        cancellation_reason = p_reason,
        cancelled_at = NOW(),
        refund_status = CASE WHEN v_calc_refund > 0 THEN 'pending_refund' ELSE 'no_refund' END,
        updated_at = NOW()
    WHERE id = p_booking_id;

    -- 4. Log to Audit
    INSERT INTO booking_audit_logs (booking_id, old_status, new_status, notes, changed_by)
    VALUES (p_booking_id, v_booking.status, 'cancelled', p_reason, p_admin_id);

    RETURN QUERY SELECT TRUE, 'Booking cancelled successfully'::TEXT, v_calc_refund;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
