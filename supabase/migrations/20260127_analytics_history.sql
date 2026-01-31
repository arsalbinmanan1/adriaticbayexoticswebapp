-- Module 4: History & Analytics

-- 1. Modification History Table
CREATE TABLE IF NOT EXISTS booking_modifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    modified_by UUID, -- Link to admins or users
    old_data JSONB,
    new_data JSONB,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Analytics Views
-- Conversion rate (simplified: confirmed / total bookings)
CREATE OR REPLACE VIEW booking_analytics_summary AS
SELECT 
    COUNT(*) as total_bookings,
    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
    ROUND(SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2) as conversion_rate,
    SUM(total_amount) as total_potential_revenue,
    SUM(total_amount) FILTER (WHERE status IN ('confirmed', 'active', 'completed')) as actual_revenue
FROM bookings;

-- Popular Cars
CREATE OR REPLACE VIEW popular_cars_analytics AS
SELECT 
    c.make,
    c.model,
    COUNT(b.id) as booking_count,
    SUM(b.total_amount) as total_revenue
FROM cars c
JOIN bookings b ON c.id = b.car_id
WHERE b.status IN ('confirmed', 'active', 'completed')
GROUP BY c.make, c.model
ORDER BY booking_count DESC;

-- Promo Code Effectiveness
CREATE OR REPLACE VIEW promo_code_analytics AS
SELECT 
    promo_code,
    COUNT(*) as use_count,
    SUM(discount_amount) as total_discount_given,
    SUM(total_amount) as total_revenue_generated
FROM bookings
WHERE promo_code IS NOT NULL
GROUP BY promo_code
ORDER BY use_count DESC;
