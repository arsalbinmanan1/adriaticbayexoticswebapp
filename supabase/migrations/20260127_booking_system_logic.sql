-- Module 4: Booking System & Logic Updates

-- 1. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BOOKING REFERENCE GENERATION
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_reference TEXT UNIQUE;

CREATE OR REPLACE FUNCTION generate_booking_reference() 
RETURNS TEXT AS $$
DECLARE
    new_ref TEXT;
    done BOOLEAN := FALSE;
BEGIN
    WHILE NOT done LOOP
        -- Generate a reference like ABE-2024-XXXXX (5 random uppercase chars)
        new_ref := 'ABE-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int) ||
                   CHR(65 + (floor(random() * 26))::int);
        
        -- Check if it exists
        SELECT NOT EXISTS (SELECT 1 FROM bookings WHERE booking_reference = new_ref) INTO done;
    END LOOP;
    RETURN new_ref;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate reference on insert
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

-- 3. UPDATED CONFLICT CHECKER (4-hour buffer)
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
            -- Renting range overlaps with (existing booking range + buffer)
            (p_pickup, p_dropoff) OVERLAPS (pickup_datetime - v_buffer, dropoff_datetime + v_buffer)
        )
    ) INTO has_conflict;
    RETURN has_conflict;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. UPDATED AVAILABILITY CHECKER
CREATE OR REPLACE FUNCTION get_available_cars(p_pickup TIMESTAMPTZ, p_dropoff TIMESTAMPTZ)
RETURNS SETOF cars AS $$
BEGIN
    RETURN QUERY SELECT c.* FROM cars c 
    WHERE c.status = 'available' 
    AND c.deleted_at IS NULL
    AND NOT check_booking_conflict(c.id, p_pickup, p_dropoff);
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. BLACKLISTED CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS blacklisted_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SEED DATA (Admin User - password is 'admin123' hashed with bcrypt/pgcrypto if we were doing it properly, 
-- but for simplicity we will just store it or use Supabase Auth. 
-- Let's use a placeholder hash for 'admin123')
INSERT INTO admins (email, password_hash, full_name)
VALUES ('admin@adriaticbayexotics.com', '$2a$10$YOUR_B_CRYPT_HASH_HERE', 'System Admin')
ON CONFLICT (email) DO NOTHING;
