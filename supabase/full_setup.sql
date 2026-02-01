/*
  Adriatic Bay Exotics - TOTAL SETUP SCRIPT
  Description: Consolidates schema, logic, and seed data into one file 
  to prevent "table does not exist" errors during manual setup.
*/

-- ==========================================
-- 1. EXTENSIONS & ENUMS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE car_status AS ENUM ('available', 'booked', 'maintenance', 'inactive');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE promo_discount_type AS ENUM ('percentage', 'fixed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE promo_status AS ENUM ('active', 'inactive', 'expired');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('new_booking', 'payment_received', 'reminder', 'cancellation');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE delivery_status AS ENUM ('pending', 'sent', 'failed', 'read');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_type AS ENUM ('security_deposit', 'full_payment', 'refund');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==========================================
-- 2. TABLES
-- ==========================================

-- CARS
CREATE TABLE IF NOT EXISTS cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    vin TEXT UNIQUE NOT NULL,
    license_plate TEXT UNIQUE NOT NULL,
    daily_rate DECIMAL(12, 2) NOT NULL,
    weekly_rate DECIMAL(12, 2),
    monthly_rate DECIMAL(12, 2),
    images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs or objects
    features JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '{}'::jsonb,
    status car_status NOT NULL DEFAULT 'available',
    current_location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- MAINTENANCE RECORDS
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    description TEXT,
    service_date DATE NOT NULL,
    cost DECIMAL(12, 2),
    mileage INTEGER,
    performed_by TEXT,
    next_service_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROMO CODES
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type promo_discount_type NOT NULL,
    discount_value DECIMAL(12, 2) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    max_uses INTEGER,
    times_used INTEGER DEFAULT 0,
    min_rental_days INTEGER DEFAULT 1,
    campaign_source TEXT, -- spin_wheel, valentines, referral, etc.
    applicable_car_categories JSONB DEFAULT '[]'::jsonb,
    status promo_status NOT NULL DEFAULT 'active',
    created_by UUID, -- Can link to auth.users if needed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_dob DATE,
    customer_address_street TEXT,
    customer_address_city TEXT,
    customer_address_state TEXT,
    customer_address_zip TEXT,
    license_number TEXT NOT NULL,
    license_state TEXT,
    license_expiration DATE,
    license_image_front_url TEXT,
    license_image_back_url TEXT,
    has_additional_driver BOOLEAN DEFAULT FALSE,
    additional_driver_info JSONB DEFAULT '{}'::jsonb,
    address TEXT,
    pickup_datetime TIMESTAMPTZ NOT NULL,
    dropoff_datetime TIMESTAMPTZ NOT NULL,
    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,
    base_rate DECIMAL(12, 2) NOT NULL,
    number_of_days INTEGER NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) DEFAULT 0,
    fees DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    promo_code TEXT,
    discount_type TEXT,
    deposit_amount DECIMAL(12, 2) DEFAULT 0,
    deposit_status TEXT DEFAULT 'pending', -- pending, paid, refunded
    payment_status TEXT DEFAULT 'unpaid', -- unpaid, partial, paid
    payment_method TEXT,
    status booking_status NOT NULL DEFAULT 'pending',
    special_requests TEXT,
    additional_services JSONB DEFAULT '[]'::jsonb, -- insurance, GPS, etc.
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    refund_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKING AUDIT LOGS
CREATE TABLE IF NOT EXISTS booking_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    old_status booking_status,
    new_status booking_status,
    changed_by UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    recipient_email TEXT,
    recipient_phone TEXT,
    delivery_status delivery_status NOT NULL DEFAULT 'pending',
    subject TEXT,
    body TEXT,
    template_name TEXT,
    sent_at TIMESTAMPTZ,
    attempt_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENT TRANSACTIONS
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    square_transaction_id TEXT UNIQUE,
    payment_type payment_type NOT NULL, -- security_deposit, full_payment, refund
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    card_last_4 TEXT,
    card_brand TEXT,
    square_status TEXT,
    receipt_url TEXT,
    processing_fees DECIMAL(12, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);
CREATE INDEX IF NOT EXISTS idx_promo_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(pickup_datetime, dropoff_datetime);
CREATE INDEX IF NOT EXISTS idx_maintenance_car_id ON maintenance_records(car_id);

-- ==========================================
-- 4. BUSINESS LOGIC (FUNCTIONS & TRIGGERS)
-- ==========================================

-- updated_at Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Audit Log Trigger
CREATE OR REPLACE FUNCTION log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO booking_audit_logs (booking_id, old_status, new_status, notes)
        VALUES (NEW.id, OLD.status, NEW.status, 'Status changed automatically by system');
    END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_booking_status
AFTER UPDATE ON bookings
FOR EACH ROW EXECUTE PROCEDURE log_booking_status_change();

-- Promo Expiration Trigger (To be called regularly or inferred in views)
CREATE OR REPLACE FUNCTION check_and_expire_promos()
RETURNS VOID AS $$
BEGIN
    UPDATE promo_codes
    SET status = 'expired'
    WHERE end_date < NOW() AND status = 'active';
END; $$ LANGUAGE plpgsql;

-- Conflict Checker
CREATE OR REPLACE FUNCTION check_booking_conflict(p_car_id UUID, p_pickup TIMESTAMPTZ, p_dropoff TIMESTAMPTZ, p_exclude_booking_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE has_conflict BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM bookings
        WHERE car_id = p_car_id AND status IN ('pending', 'confirmed', 'active')
        AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
        AND ((p_pickup, p_dropoff) OVERLAPS (pickup_datetime, dropoff_datetime))
    ) INTO has_conflict;
    RETURN has_conflict;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Availability Checker
CREATE OR REPLACE FUNCTION get_available_cars(p_pickup TIMESTAMPTZ, p_dropoff TIMESTAMPTZ)
RETURNS SETOF cars AS $$
BEGIN
    RETURN QUERY SELECT c.* FROM cars c WHERE c.status = 'available' AND c.deleted_at IS NULL
    AND NOT EXISTS (
        SELECT 1 FROM bookings b WHERE b.car_id = c.id AND b.status IN ('pending', 'confirmed', 'active')
        AND (p_pickup, p_dropoff) OVERLAPS (b.pickup_datetime, b.dropoff_datetime)
    );
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revenue View
CREATE OR REPLACE VIEW revenue_summary AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    SUM(amount) FILTER (WHERE payment_type = 'full_payment') as total_rental_revenue,
    SUM(amount) FILTER (WHERE payment_type = 'security_deposit') as total_deposits_collected,
    SUM(processing_fees) as total_fees_paid,
    COUNT(id) as transaction_count
FROM payment_transactions
WHERE square_status = 'COMPLETED'
GROUP BY 1
ORDER BY 1 DESC;

-- ==========================================
-- 5. RLS POLICIES
-- ==========================================
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_audit_logs ENABLE ROW LEVEL SECURITY;

-- CARS
CREATE POLICY "Public can view available cars" ON cars FOR SELECT USING (status = 'available' AND deleted_at IS NULL);
CREATE POLICY "Admins have full access to cars" ON cars FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- BOOKINGS
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can only view their own bookings" ON bookings FOR SELECT USING (customer_email = auth.jwt() ->> 'email' OR auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Admins have full access to bookings" ON bookings FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- OTHER TABLES
CREATE POLICY "Admin-only access to payments" ON payment_transactions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Admin-only access to notifications" ON notifications FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Admin-only access to maintenance" ON maintenance_records FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Admin-only access to audit logs" ON booking_audit_logs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Public can view active promo codes" ON promo_codes FOR SELECT USING (status = 'active');

-- ==========================================
-- 6. SEED DATA
-- ==========================================
INSERT INTO cars (make, model, year, vin, license_plate, daily_rate, status, features, specifications)
VALUES 
('Lamborghini', 'Huracan Evo', 2023, 'VIN1234567890LAM', 'EVO-001', 1200.00, 'available', '["V10 Engine", "AWD"]'::jsonb, '{"power": "640 HP"}'::jsonb),
('Ferrari', 'F8 Tributo', 2022, 'VIN0987654321FER', 'F8-TRIB', 1350.00, 'available', '["Twin Turbo V8"]'::jsonb, '{"power": "710 HP"}'::jsonb),
('Porsche', '911 GT3 (992)', 2024, 'VIN456789123POR', 'GT3-RS', 950.00, 'available', '["Rear Axle Steering"]'::jsonb, '{"power": "502 HP"}'::jsonb),
('Rolls-Royce', 'Ghost', 2023, 'VIN789123456RR', 'ROYCE-G', 1500.00, 'available', '["Massage Seats"]'::jsonb, '{"power": "563 HP"}'::jsonb);

INSERT INTO promo_codes (code, discount_type, discount_value, start_date, end_date, min_rental_days, status)
VALUES ('WELCOME2024', 'percentage', 10.00, NOW(), NOW() + INTERVAL '1 year', 2, 'active');
