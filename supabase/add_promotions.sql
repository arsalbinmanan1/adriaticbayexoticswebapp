/*
  Adriatic Bay Exotics - Add Promotional Codes
  Description: Adds "RENT 2 DAYS GET ONE FREE" promotion for eligible cars
*/

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
    33.33, -- Effectively gives 1/3 off (3 days for price of 2)
    NOW(),
    NOW() + INTERVAL '1 year',
    1000,
    0,
    0.00,
    'Website Launch Promotion',
    'active'
);

-- Add additional welcome promo
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

-- Verification
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Promotional Codes Added Successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Active Promo Codes:';
    RAISE NOTICE '   🎁 RENT2GET1FREE - 33%% off (Rent 2 Days Get 1 Free)';
    RAISE NOTICE '   🎁 WELCOME2024 - 10%% off first booking';
    RAISE NOTICE '';
END $$;

-- Show all promo codes
SELECT 
    code,
    description,
    discount_type,
    discount_value,
    status,
    max_uses - used_count as remaining_uses
FROM promo_codes
ORDER BY created_at DESC;
