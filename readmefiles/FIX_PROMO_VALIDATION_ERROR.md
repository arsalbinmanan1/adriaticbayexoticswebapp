# 🐛 Fix: "Failed to validate promo code" Error

## ❌ **The Problem**

Your database table `promo_codes` has column names that don't match what the API is looking for.

### **Database Has:**
- `start_date`
- `end_date`
- `times_used`
- `min_rental_days`

### **API Is Looking For:**
- `starts_at` ❌
- `expires_at` ❌
- `used_count` ❌
- `min_booking_amount` ❌

---

## ✅ **Solution: Choose ONE**

### **Option 1: Update Database Columns** (Recommended)

Run this SQL in Supabase to rename the columns:

```sql
-- Rename columns to match API expectations
ALTER TABLE promo_codes RENAME COLUMN start_date TO starts_at;
ALTER TABLE promo_codes RENAME COLUMN end_date TO expires_at;
ALTER TABLE promo_codes RENAME COLUMN times_used TO used_count;
ALTER TABLE promo_codes RENAME COLUMN min_rental_days TO min_booking_amount;

-- Update column type
ALTER TABLE promo_codes ALTER COLUMN min_booking_amount TYPE DECIMAL(12, 2);

-- Verify changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'promo_codes'
ORDER BY ordinal_position;
```

### **Option 2: Update API to Match Database** (Quick Fix)

If you can't change the database, update the API:

**File:** `app/api/marketing/promo/validate/route.ts`

```typescript
// Change line 31-36 from:
if (promo.starts_at && new Date(promo.starts_at) > now) {
if (promo.expires_at && new Date(promo.expires_at) < now) {

// To:
if (promo.start_date && new Date(promo.start_date) > now) {
if (promo.end_date && new Date(promo.end_date) < now) {

// Change line 40 from:
if (promo.max_uses && promo.used_count >= promo.max_uses) {

// To:
if (promo.max_uses && promo.times_used >= promo.max_uses) {

// Change line 45 from:
if (rentalDays && promo.min_booking_amount && rentalDays < promo.min_booking_amount) {

// To:
if (rentalDays && promo.min_rental_days && rentalDays < promo.min_rental_days) {
```

---

## 🎯 **Why This Happened**

Your initial database setup (`supabase/full_setup.sql`) used one naming convention, but later scripts (`COMPLETE_SETUP.sql`, spin wheel API) used a different one.

---

## 🚀 **After Fixing**

1. Test with any promo code:
   - `WELCOME2024`
   - `RENT2GET1FREE`
   - Or spin wheel code like `SPIN-CC8YAY`

2. You should see:
   - ✅ Green border
   - ✅ Success message
   - ✅ Discount applied

---

## 📋 **Quick Test**

After fixing, run this in Supabase to create a test code:

```sql
INSERT INTO promo_codes (
    code,
    discount_type,
    discount_value,
    starts_at,           -- or start_date if you chose Option 2
    expires_at,          -- or end_date if you chose Option 2
    max_uses,
    used_count,          -- or times_used if you chose Option 2
    status
) VALUES (
    'TEST2024',
    'percentage',
    20.00,
    NOW(),
    NOW() + INTERVAL '30 days',
    100,
    0,
    'active'
);
```

Then try applying `TEST2024` in checkout!
