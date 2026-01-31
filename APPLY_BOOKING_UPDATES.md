# 🚀 Quick Guide: Apply Booking Updates

**Time Required:** 5 minutes

---

## ✅ What Was Updated

1. **Add-ons** - Insurance, Gas, Mileage pricing updated
2. **Promo Codes** - "RENT 2 DAYS GET ONE FREE" added
3. **Car Colors** - Corvette C8-R colors corrected

---

## 📋 Step-by-Step Instructions

### Step 1: Update Code (Already Done ✅)
The following files have been updated:
- ✅ `lib/constants/addons.ts`
- ✅ `supabase/seed_cars_local_images.sql`
- ✅ `supabase/add_promotions.sql` (NEW)

### Step 2: Update Database

#### Option A: Fresh Setup (Recommended)
```sql
-- Open Supabase SQL Editor and run:

-- 1. Clear existing data
DELETE FROM bookings;
DELETE FROM cars;
DELETE FROM promo_codes;

-- 2. Re-seed cars with updated colors
-- Copy and paste the entire contents of: supabase/seed_cars_local_images.sql

-- 3. Add promotional codes
-- Copy and paste the entire contents of: supabase/add_promotions.sql
```

#### Option B: Update Existing Data
```sql
-- Open Supabase SQL Editor and run:

-- 1. Update Corvette colors only
UPDATE cars 
SET 
  exterior_color = 'Amplify Orange Tintcoat',
  interior_color = 'Natural Dipped'
WHERE slug = 'corvette-c8-r';

-- 2. Add promo codes
-- Copy and paste the entire contents of: supabase/add_promotions.sql
```

### Step 3: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test Booking Flow
1. Go to http://localhost:3000/fleet
2. Click on "Corvette C8-R"
3. Click "Book Now"
4. Fill in booking details
5. In add-ons, verify:
   - ✅ Insurance shows $219/day
   - ✅ Gas shows $89
   - ✅ Mileage option appears
6. Enter promo code: `RENT2GET1FREE`
7. Verify discount applies
8. Complete test booking

---

## 🧪 Quick Test Commands

### Verify Cars in Database
```sql
SELECT 
  make || ' ' || model as car,
  exterior_color,
  interior_color,
  daily_rate,
  security_deposit
FROM cars
ORDER BY daily_rate;
```

### Verify Promo Codes
```sql
SELECT 
  code,
  discount_value,
  status,
  max_uses - used_count as remaining
FROM promo_codes
WHERE status = 'active';
```

---

## ✅ Expected Results

### Add-ons in Checkout:
```
☐ Adriatic Bay Exotics Insurance (for cars under $599/day) - $219/day
☐ Adriatic Bay Exotics Insurance (for cars over $999/day) - $349/day
☐ GPS Navigation System - $15/day
☐ Child Safety Seat - $25
☐ Paid for Gas - $89
☐ Additional Mileage (Call to Quote) - Call to Quote
```

### Promo Codes Available:
```
RENT2GET1FREE - 33.33% off (effectively 3 days for price of 2)
WELCOME2024 - 10% off first booking
```

### Corvette C8-R Details:
```
Exterior: Amplify Orange Tintcoat ✅
Interior: Natural Dipped ✅
Daily Rate: $419 ✅
4-Hour Rate: $219 ✅
Deposit: $1,000 ✅
```

---

## 🎯 Complete!

Once you see the updated add-ons in the checkout page and can apply the `RENT2GET1FREE` promo code, you're all set! 🚀

