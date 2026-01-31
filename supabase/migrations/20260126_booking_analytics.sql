/*
  Adriatic Bay Exotics - Booking Analytics Views (Module 4.8) - FIXED
*/

-- 1. VEHICLE PERFORMANCE VIEW
CREATE OR REPLACE VIEW view_car_performance AS
SELECT 
    c.id,
    c.make || ' ' || c.model as car_name,
    c.year,
    COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as successful_bookings,
    COUNT(b.id) as total_attempts,
    SUM(b.total_amount) FILTER (WHERE b.status = 'confirmed') as total_revenue,
    AVG(b.total_amount) FILTER (WHERE b.status = 'confirmed') as avg_booking_value
FROM cars c
LEFT JOIN bookings b ON c.id = b.car_id
GROUP BY c.id, c.make, c.model, c.year;

-- 2. REVENUE TRENDS (LAST 30 DAYS)
CREATE OR REPLACE VIEW view_revenue_trends AS
SELECT 
    DATE_TRUNC('day', created_at) as day,
    SUM(amount) FILTER (WHERE payment_type = 'security_deposit' AND square_status = 'COMPLETED') as deposit_revenue,
    COUNT(*) FILTER (WHERE payment_type = 'security_deposit' AND square_status = 'COMPLETED') as booking_count
FROM payment_transactions

WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day DESC;

-- 3. PROMO CODE EFFECTIVENESS
CREATE OR REPLACE VIEW view_promo_stats AS
SELECT 
    promo_code,
    COUNT(*) as usage_count,
    SUM(discount_amount) as total_savings_provided,
    SUM(total_amount) as total_revenue_generated
FROM bookings
WHERE promo_code IS NOT NULL AND status = 'confirmed'
GROUP BY promo_code;
