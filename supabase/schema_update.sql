-- ==========================================
-- Schema Update: Align DB with Frontend Forms
-- ==========================================

-- Update promo_codes table to match form fields
ALTER TABLE promo_codes 
    RENAME COLUMN start_date TO starts_at;
    
ALTER TABLE promo_codes 
    RENAME COLUMN end_date TO expires_at;

ALTER TABLE promo_codes 
    RENAME COLUMN times_used TO used_count;

ALTER TABLE promo_codes 
    RENAME COLUMN min_rental_days TO min_booking_amount;

-- Add any missing columns to cars table
ALTER TABLE cars 
    ADD COLUMN IF NOT EXISTS category TEXT; -- exotic, luxury, sports

ALTER TABLE cars 
    ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

ALTER TABLE cars 
    ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE cars 
    ADD COLUMN IF NOT EXISTS exterior_color TEXT;

ALTER TABLE cars 
    ADD COLUMN IF NOT EXISTS interior_color TEXT;

ALTER TABLE cars 
    ADD COLUMN IF NOT EXISTS four_hour_rate DECIMAL(12, 2);

ALTER TABLE cars 
    ADD COLUMN IF NOT EXISTS security_deposit DECIMAL(12, 2);

-- Add any missing columns to promo_codes
ALTER TABLE promo_codes 
    ADD COLUMN IF NOT EXISTS description TEXT;

-- Update column type for min_booking_amount
ALTER TABLE promo_codes 
    ALTER COLUMN min_booking_amount TYPE DECIMAL(12, 2);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_cars_slug ON cars(slug);
CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
