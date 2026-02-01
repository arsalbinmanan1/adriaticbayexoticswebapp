-- ==========================================
-- DIAGNOSTIC: Check Promo Code Setup
-- Run this to see what's wrong
-- ==========================================

-- 1. Check what columns exist in promo_codes table
SELECT 
    'Column Check' as test_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'promo_codes'
ORDER BY ordinal_position;

-- 2. Check if any promo codes exist
SELECT 
    'Promo Codes Check' as test_name,
    code,
    discount_type,
    discount_value,
    status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'promo_codes' AND column_name = 'starts_at') 
        THEN starts_at::TEXT
        ELSE start_date::TEXT
    END as start_date_value,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'promo_codes' AND column_name = 'expires_at') 
        THEN expires_at::TEXT
        ELSE end_date::TEXT
    END as end_date_value
FROM promo_codes
LIMIT 10;

-- 3. Check if the function exists
SELECT 
    'Function Check' as test_name,
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_name = 'validate_and_increment_promo';

-- 4. Try to call the function with WELCOME2024
DO $$
DECLARE
    result RECORD;
BEGIN
    -- Try to validate WELCOME2024
    FOR result IN 
        SELECT * FROM validate_and_increment_promo('WELCOME2024', 3, NULL)
    LOOP
        RAISE NOTICE '=================================';
        RAISE NOTICE 'Function Test Result:';
        RAISE NOTICE '  Valid: %', result.valid;
        RAISE NOTICE '  Message: %', result.message;
        RAISE NOTICE '  Discount Type: %', result.discount_type;
        RAISE NOTICE '  Discount Value: %', result.discount_value;
        RAISE NOTICE '=================================';
    END LOOP;
END $$;
