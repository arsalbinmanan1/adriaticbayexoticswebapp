/*
  Adriatic Bay Exotics - Fix Bookings Schema
  Description: Adds missing columns to bookings table
  Run this BEFORE testing bookings!
*/

-- Add missing columns to bookings table
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

-- Verify the schema
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Bookings Schema Updated Successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Bookings Table Columns:';
    RAISE NOTICE '   ✓ customer_dob';
    RAISE NOTICE '   ✓ customer_address_street';
    RAISE NOTICE '   ✓ customer_address_city';
    RAISE NOTICE '   ✓ customer_address_state';
    RAISE NOTICE '   ✓ customer_address_zip';
    RAISE NOTICE '   ✓ license_state';
    RAISE NOTICE '   ✓ license_expiration';
    RAISE NOTICE '   ✓ has_additional_driver';
    RAISE NOTICE '   ✓ additional_driver_info';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Ready to test bookings!';
    RAISE NOTICE '';
END $$;

-- Show current bookings table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
