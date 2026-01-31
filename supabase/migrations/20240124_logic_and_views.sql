/*
  Adriatic Bay Exotics - Functions, Triggers & Views
  Module: 1.5
  Description: Automated logic and reporting.
*/

-- 1. TRIGGERS FOR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. BOOKING CONFLICT CHECKER
-- Returns true if there IS a conflict
CREATE OR REPLACE FUNCTION check_booking_conflict(
    p_car_id UUID,
    p_pickup TIMESTAMPTZ,
    p_dropoff TIMESTAMPTZ,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    has_conflict BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM bookings
        WHERE car_id = p_car_id
        AND status IN ('pending', 'confirmed', 'active')
        AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
        AND (
            (p_pickup, p_dropoff) OVERLAPS (pickup_datetime, dropoff_datetime)
        )
    ) INTO has_conflict;
    
    RETURN has_conflict;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CAR AVAILABILITY CHECKER
-- Returns table of available cars for a range
CREATE OR REPLACE FUNCTION get_available_cars(
    p_pickup TIMESTAMPTZ,
    p_dropoff TIMESTAMPTZ
)
RETURNS SETOF cars AS $$
BEGIN
    RETURN QUERY
    SELECT c.*
    FROM cars c
    WHERE c.status = 'available'
    AND c.deleted_at IS NULL
    AND NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.car_id = c.id
        AND b.status IN ('pending', 'confirmed', 'active')
        AND (p_pickup, p_dropoff) OVERLAPS (b.pickup_datetime, b.dropoff_datetime)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. PROMO CODE AUTO-EXPIRATION FUNCTION
-- This can be called by a cron job or checked on-demand
CREATE OR REPLACE FUNCTION expire_promo_codes()
RETURNS VOID AS $$
BEGIN
    UPDATE promo_codes
    SET status = 'expired'
    WHERE status = 'active'
    AND (end_date < NOW() OR (max_uses IS NOT NULL AND times_used >= max_uses));
END;
$$ LANGUAGE plpgsql;

-- 5. REVENUE VIEWS

-- Daily Revenue View
CREATE OR REPLACE VIEW daily_revenue AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    SUM(amount) as revenue,
    COUNT(*) as transaction_count
FROM payment_transactions
WHERE square_status = 'COMPLETED'
GROUP BY 1
ORDER BY 1 DESC;

-- Monthly Revenue View
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    SUM(amount) as revenue,
    COUNT(*) as transaction_count
FROM payment_transactions
WHERE square_status = 'COMPLETED'
GROUP BY 1
ORDER BY 1 DESC;

-- Car Performance View
CREATE OR REPLACE VIEW car_performance AS
SELECT 
    c.id,
    c.make,
    c.model,
    COUNT(b.id) as total_bookings,
    SUM(b.total_amount) as total_revenue
FROM cars c
LEFT JOIN bookings b ON c.id = b.car_id
WHERE b.status = 'completed'
GROUP BY c.id, c.make, c.model;
