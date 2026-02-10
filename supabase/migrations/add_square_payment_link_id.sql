-- Migration: Add square_payment_link_id to bookings table
-- Description: Stores the Square payment link ID for tracking checkout sessions
-- Date: 2026-02-10

-- Add column for Square payment link ID
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS square_payment_link_id VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_square_payment_link_id 
ON bookings(square_payment_link_id);

-- Add comment
COMMENT ON COLUMN bookings.square_payment_link_id IS 'Square Checkout payment link ID for tracking payment sessions';
