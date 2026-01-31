/*
  Adriatic Bay Exotics - Booking Schema Expansion
  Description: Adds missing fields to bookings table for Module 3 checkout requirements.
*/

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

-- Ensure RLS policies are up to date (already covered by existing policies)
