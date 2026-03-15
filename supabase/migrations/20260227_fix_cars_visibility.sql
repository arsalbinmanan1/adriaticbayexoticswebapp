-- Fix cars visibility: allow public to view both 'available' and 'booked' cars
-- This ensures new cars and fleet listings display correctly on the website

DROP POLICY IF EXISTS "Public can view available cars" ON cars;

CREATE POLICY "Public can view available and booked cars"
ON cars FOR SELECT
USING (
  status IN ('available', 'booked')
  AND deleted_at IS NULL
);
