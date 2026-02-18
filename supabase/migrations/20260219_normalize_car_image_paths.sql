-- Migration: normalize car image paths
-- Ensures image entries are browser-ready: keep absolute URLs, keep root-relative paths (/...),
-- convert relative/storage keys (e.g. "car-images/xyz.jpg" or "public/car-images/xyz.jpg") to "/car-images/xyz.jpg".

BEGIN;

UPDATE cars
SET images = (
  SELECT jsonb_agg(
    CASE
      WHEN value ~ '^https?://' THEN to_jsonb(value)
      WHEN value LIKE '/%' THEN to_jsonb(value)
      WHEN value LIKE 'public/%' THEN to_jsonb('/' || substring(value from 8))
      ELSE to_jsonb('/' || value)
    END
  )
  FROM jsonb_array_elements_text(images) AS t(value)
)
WHERE images IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements_text(images) AS t(value)
    WHERE value NOT LIKE '/%' AND value NOT LIKE 'http%'
  );

COMMIT;
