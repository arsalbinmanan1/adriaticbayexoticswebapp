/*
  Adriatic Bay Exotics - Database Schema Migration
  Module: 1.2 & 1.3
  Description: Core tables, enums, extensions, and RLS policies.
*/

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE car_status AS ENUM ('available', 'booked', 'maintenance', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE promo_discount_type AS ENUM ('percentage', 'fixed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE promo_status AS ENUM ('active', 'inactive', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('new_booking', 'payment_received', 'reminder', 'cancellation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_status AS ENUM ('pending', 'sent', 'failed', 'read');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_type AS ENUM ('security_deposit', 'full_payment', 'refund');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES

-- CARS TABLE
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
    images JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '{}'::jsonb,
    status car_status NOT NULL DEFAULT 'available',
    current_location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);

-- PROMO CODES TABLE
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
    campaign_source TEXT,
    applicable_car_categories JSONB DEFAULT '[]'::jsonb,
    status promo_status NOT NULL DEFAULT 'active',
    created_by UUID, -- Link to admin user if needed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promo_code ON promo_codes(code);

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE RESTRICT,
    
    -- Customer Info
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    license_number TEXT NOT NULL,
    address TEXT,

    -- Rental Details
    pickup_datetime TIMESTAMPTZ NOT NULL,
    dropoff_datetime TIMESTAMPTZ NOT NULL,
    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,

    -- Pricing
    base_rate DECIMAL(12, 2) NOT NULL,
    number_of_days INTEGER NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) DEFAULT 0,
    fees DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,

    -- Discounts
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    promo_code TEXT,
    discount_type TEXT,

    -- Security Deposit
    deposit_amount DECIMAL(12, 2) DEFAULT 0,
    deposit_status TEXT DEFAULT 'pending',
    deposit_refund_reference TEXT,

    -- Payments
    payment_status TEXT DEFAULT 'unpaid',
    payment_method TEXT,

    -- Lifecycle
    status booking_status NOT NULL DEFAULT 'pending',
    special_requests TEXT,
    additional_services JSONB DEFAULT '[]'::jsonb,

    -- Cancellation
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    refund_status TEXT,

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(pickup_datetime, dropoff_datetime);

-- NOTIFICATIONS TABLE
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

-- PAYMENT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    square_transaction_id TEXT UNIQUE,
    payment_type payment_type NOT NULL,
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

-- 4. ROW LEVEL SECURITY (RLS) policies

-- CARS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view available cars" 
ON cars FOR SELECT 
USING (status = 'available' AND deleted_at IS NULL);

CREATE POLICY "Admins have full access to cars" 
ON cars FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'authenticated'); -- Simplified for demo, should be more granular

-- BOOKINGS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can create bookings" 
ON bookings FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can only view their own bookings" 
ON bookings FOR SELECT 
TO authenticated 
USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Admins have full access to bookings" 
ON bookings FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- PAYMENT TRANSACTIONS, NOTIFICATIONS, PROMO CODES
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin-only access to payments" ON payment_transactions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Admin-only access to notifications" ON notifications FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Admin-only access to promo codes" ON promo_codes FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Public can view active promo codes for validation" ON promo_codes FOR SELECT USING (status = 'active');
