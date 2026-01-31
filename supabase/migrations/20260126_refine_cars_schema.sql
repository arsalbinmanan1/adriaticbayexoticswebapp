/*
  Adriatic Bay Exotics - Schema Refinement
  Description: Adds missing fields to cars table to support full static data migration.
*/

-- 1. ADD COLUMNS TO CARS
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS detailed_description JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(12, 2) DEFAULT 1000.00;

-- 2. UPDATE INDEXES
CREATE INDEX IF NOT EXISTS idx_cars_slug ON cars(slug);
CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);

-- 3. ENSURE RLS POLICIES REMAIN VALID (They should, as they use 'status')
