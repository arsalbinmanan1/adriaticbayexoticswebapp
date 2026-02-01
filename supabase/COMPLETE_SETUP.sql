-- ==========================================
-- COMPLETE SETUP SCRIPT FOR ADRIATIC BAY EXOTICS
-- Run this entire script in Supabase SQL Editor
-- ==========================================

-- ==========================================
-- STEP 1: Fix Bookings Table Schema
-- ==========================================

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS customer_dob DATE,
ADD COLUMN IF NOT EXISTS customer_address_street TEXT,
ADD COLUMN IF NOT EXISTS customer_address_city TEXT,
ADD COLUMN IF NOT EXISTS customer_address_state TEXT,
ADD COLUMN IF NOT EXISTS customer_address_zip TEXT,
ADD COLUMN IF NOT EXISTS license_state TEXT,
ADD COLUMN IF NOT EXISTS license_expiration DATE,
ADD COLUMN IF NOT EXISTS license_image_front_url TEXT,
ADD COLUMN IF NOT EXISTS license_image_back_url TEXT,
ADD COLUMN IF NOT EXISTS has_additional_driver BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS additional_driver_info JSONB DEFAULT '{}'::jsonb;

-- ==========================================
-- STEP 2: Add Promotional Codes
-- ==========================================

-- Clear existing promo codes
DELETE FROM promo_codes;

-- Add "RENT 2 DAYS GET ONE FREE" Promotion
INSERT INTO promo_codes (
    code,
    description,
    discount_type,
    discount_value,
    starts_at,
    expires_at,
    max_uses,
    used_count,
    min_booking_amount,
    campaign_source,
    status
) VALUES (
    'RENT2GET1FREE',
    'Rent 2 Days Get One Free - Valid on Corvette C8-R, McLaren 570S, and Maserati Levante',
    'percentage',
    33.33,
    NOW(),
    NOW() + INTERVAL '1 year',
    1000,
    0,
    0.00,
    'Website Launch Promotion',
    'active'
);

-- Add WELCOME2024 promo
INSERT INTO promo_codes (
    code,
    description,
    discount_type,
    discount_value,
    starts_at,
    expires_at,
    max_uses,
    used_count,
    min_booking_amount,
    campaign_source,
    status
) VALUES (
    'WELCOME2024',
    'Welcome discount - 10% off first booking',
    'percentage',
    10.00,
    NOW(),
    NOW() + INTERVAL '6 months',
    500,
    0,
    500.00,
    'New Customer Campaign',
    'active'
);

-- ==========================================
-- STEP 3: Seed Cars with Correct Data
-- ==========================================

-- Clear existing data (bookings must be deleted first due to foreign key)
-- Use DO block to safely delete from tables that may or may not exist
DO $$ 
BEGIN
    -- Delete from payments if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') THEN
        DELETE FROM payments;
    END IF;
    
    -- Delete bookings
    DELETE FROM bookings;
    
    -- Delete cars
    DELETE FROM cars;
END $$;

-- 1. Corvette C8-R
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'Chevrolet',
    'Corvette C8-R',
    2024,
    'C8R001CORVETTE001',
    'CORV8',
    'sports',
    'corvette-c8-r',
    'The Corvette C8-R represents American supercar excellence with its revolutionary mid-engine design. Experience raw power and precision handling in this track-ready beast.',
    'Amplify Orange Tintcoat',
    'Natural Dipped',
    419.00,
    219.00,
    2500.00,
    8000.00,
    1000.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/Corvette1.jpeg", "/car-images/Corvette2.jpeg", "/car-images/Corvette3.jpeg", "/car-images/Corvette4.jpeg", "/car-images/Corvette5.jpeg", "/car-images/Corvette6.jpeg", "/car-images/Corvette7.jpeg", "/car-images/Corvette8.jpeg"]'::jsonb,
    '["Mid-engine layout", "Magnetic ride control", "Performance exhaust", "Z51 Performance Package"]'::jsonb,
    '{"engine": "6.2L V8", "horsepower": "495 HP", "acceleration": "0-60 mph in 2.9s", "topSpeed": "194 mph", "transmission": "8-Speed Dual-Clutch", "drivetrain": "RWD"}'::jsonb
);

-- 2. McLaren 570S Spyder
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'McLaren',
    '570S Spyder',
    2023,
    'MCL570SSPYDER0001',
    'MCL570S',
    'exotic',
    'mclaren-570s',
    'The McLaren 570S delivers pure driving pleasure with Formula 1-inspired technology. British engineering meets pure adrenaline.',
    'Paris Blue',
    'Jet Black with Yellow Stitching Inserts',
    1199.00,
    589.00,
    7500.00,
    24000.00,
    1000.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/McLarenBlue2.jpeg", "/car-images/McLarenBlue1.jpeg"]'::jsonb,
    '["Carbon fiber monocoque", "Dihedral doors", "Active aerodynamics", "Retractable Hardtop"]'::jsonb,
    '{"engine": "3.8L Twin-Turbo V8", "horsepower": "562 HP", "acceleration": "0-60 mph in 3.1s", "topSpeed": "204 mph", "transmission": "7-Speed SSG", "drivetrain": "RWD"}'::jsonb
);

-- 3. Lamborghini Huracan Spyder LP 580
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'Lamborghini',
    'Huracan Spyder LP 580',
    2024,
    'LAMBOHURACAN58001',
    'HURACAN',
    'exotic',
    'lamborghini-huracan',
    'The Lamborghini Huracan EVO is Italian supercar perfection. Naturally aspirated V10 and aggressive styling.',
    'Giallo Orion',
    'Black Leather with Yellow Stitching Inserts',
    1049.00,
    NULL,
    6500.00,
    21000.00,
    1000.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/Lamborghini1.jpeg", "/car-images/Lamborghini2.jpeg", "/car-images/Lamborghini3.jpeg", "/car-images/Lamborghini4.jpeg", "/car-images/Lamborghini5.jpeg", "/car-images/Lamborghini6.jpeg"]'::jsonb,
    '["All-wheel drive", "Rear-wheel steering", "LDVI vehicle dynamics", "Naturally Aspirated V10"]'::jsonb,
    '{"engine": "5.2L V10", "horsepower": "631 HP", "acceleration": "0-60 mph in 2.9s", "topSpeed": "202 mph", "transmission": "7-Speed Dual-Clutch", "drivetrain": "AWD"}'::jsonb
);

-- 4. Maserati Levante GrandSport Q4
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'Maserati',
    'Levante GrandSport Q4 (Fully Loaded)',
    2024,
    'MASLEVANTEQ40001',
    'MASQ4',
    'luxury',
    'maserati-levante',
    'The Maserati Levante combines Italian luxury with SUV practicality. Perfect for families or groups.',
    'Grigio Maratea Metallescent',
    'Rosso with Nero Stitching',
    199.00,
    NULL,
    1200.00,
    4000.00,
    500.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/maserati1.webp", "/car-images/maserati2.jpg"]'::jsonb,
    '["Luxury SUV comfort", "Premium leather interior", "Q4 Intelligent AWD", "Ferrari-Built Engine"]'::jsonb,
    '{"engine": "3.8L Twin-Turbo V8", "horsepower": "580 HP", "acceleration": "0-60 mph in 3.8s", "topSpeed": "187 mph", "transmission": "8-Speed Automatic", "drivetrain": "AWD"}'::jsonb
);

-- 5. Lamborghini Urus
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'Lamborghini',
    'Urus',
    2024,
    'LAMBOURUSSSUV0001',
    'URUS',
    'exotic',
    'lamborghini-urus',
    'The world''s first Super Sport Utility Vehicle. Supercar performance with SUV versatility.',
    'Grigio Keres Metallic',
    'Marrone Elpis with Nero Ade',
    1049.00,
    659.00,
    6500.00,
    21000.00,
    1000.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/Urus1.jpeg", "/car-images/Urus2.jpeg", "/car-images/Urus3.jpeg"]'::jsonb,
    '["Super SUV performance", "Carbon ceramic brakes", "Active roll stabilization", "Tamburo Drive Mode"]'::jsonb,
    '{"engine": "4.0L Twin-Turbo V8", "horsepower": "641 HP", "acceleration": "0-60 mph in 3.6s", "topSpeed": "190 mph", "transmission": "8-Speed Automatic", "drivetrain": "AWD"}'::jsonb
);

-- 6. McLaren 650S Spyder
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'McLaren',
    '650S Spyder',
    2023,
    'MCL650SSPYDER0001',
    'MCL650S',
    'exotic',
    'mclaren-650s',
    'Open-top thrills with brutal performance. Experience the wind in your hair at supercar speeds.',
    'Volcano Orange',
    'Carbon Black Alcantara',
    1399.00,
    689.00,
    8500.00,
    27000.00,
    500.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/McLarenOrange1.jpeg", "/car-images/McLarenOrange2.jpeg", "/car-images/McLarenOrange3.jpeg"]'::jsonb,
    '["Retractable hardtop", "ProActive chassis control", "Carbon fiber body", "Active Airbrake"]'::jsonb,
    '{"engine": "3.8L Twin-Turbo V8", "horsepower": "641 HP", "acceleration": "0-60 mph in 2.9s", "topSpeed": "207 mph", "transmission": "7-Speed SSG", "drivetrain": "RWD"}'::jsonb
);

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Show success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════';
    RAISE NOTICE '✅ COMPLETE SETUP FINISHED SUCCESSFULLY!';
    RAISE NOTICE '════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Bookings Schema: UPDATED';
    RAISE NOTICE '   ✓ All customer fields added';
    RAISE NOTICE '   ✓ License fields added';
    RAISE NOTICE '   ✓ Additional driver support added';
    RAISE NOTICE '';
    RAISE NOTICE '🎁 Promo Codes: ACTIVE';
    RAISE NOTICE '   ✓ RENT2GET1FREE (33%% off)';
    RAISE NOTICE '   ✓ WELCOME2024 (10%% off)';
    RAISE NOTICE '';
    RAISE NOTICE '🚗 Cars: SEEDED';
    RAISE NOTICE '   ✓ Corvette C8-R - $419/day (4hr: $219)';
    RAISE NOTICE '   ✓ McLaren 570S - $1,199/day (4hr: $589)';
    RAISE NOTICE '   ✓ Lamborghini Huracan - $1,049/day';
    RAISE NOTICE '   ✓ Maserati Levante - $199/day';
    RAISE NOTICE '   ✓ Lamborghini Urus - $1,049/day (4hr: $659)';
    RAISE NOTICE '   ✓ McLaren 650S - $1,399/day (4hr: $689)';
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════';
    RAISE NOTICE '🚀 READY TO TEST BOOKINGS!';
    RAISE NOTICE '════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Update .env.local with Square credentials';
    RAISE NOTICE '2. Restart dev server: npm run dev';
    RAISE NOTICE '3. Test booking at: http://localhost:3000/fleet';
    RAISE NOTICE '';
END $$;

-- Show cars summary
SELECT 
    make || ' ' || model as car,
    daily_rate,
    four_hour_rate,
    security_deposit,
    exterior_color,
    interior_color,
    status
FROM cars
ORDER BY daily_rate DESC;

-- Show promo codes
SELECT 
    code,
    discount_value || '%' as discount,
    status,
    max_uses - used_count as remaining_uses
FROM promo_codes
ORDER BY created_at DESC;
