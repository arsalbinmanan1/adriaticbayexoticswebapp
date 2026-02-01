# ✅ Complete Setup Checklist - Get Booking Working

Follow these steps in order to fix all issues and get your booking system working.

---

## 🎯 Current Issues

1. ❌ **Schema Error:** `additional_driver_info column not found`
2. ❌ **Square Error:** `applicationId option is not in the correct format`
3. ⚠️ **Missing:** Promo codes not in database
4. ⚠️ **Missing:** Updated car data with correct colors

---

## 📋 Step-by-Step Fix (10 Minutes)

### ✅ STEP 1: Fix Database Schema (2 min)

**Open Supabase SQL Editor** and run these scripts in order:

#### 1.1 Fix Bookings Table
```sql
-- Copy and paste entire contents of: supabase/fix_bookings_schema.sql
```

#### 1.2 Add Promo Codes
```sql
-- Copy and paste entire contents of: supabase/add_promotions.sql
```

#### 1.3 Update Car Data
```sql
-- First clear existing data
DELETE FROM cars;

-- Then copy and paste entire contents of: supabase/seed_cars_local_images.sql
```

**Expected Output:**
```
✅ Bookings Schema Updated Successfully!
✅ Promotional Codes Added Successfully!
✅ 6 Cars Seeded Successfully!
```

---

### ✅ STEP 2: Fix Square Configuration (3 min)

#### 2.1 Get Square Credentials

1. Go to: **https://developer.squareup.com/apps**
2. Login to your Square account
3. Click your app (or click "Create App" if you don't have one)
4. Click **"Credentials"** in left sidebar
5. **Toggle to "Sandbox"** mode at the top
6. Copy these three values:

```
Application ID: sandbox-sq0idb-XXXXXXXXXXXXXXX
Location ID: LXXXXXXXXXXXXXXX
Access Token: EAAAl_XXXXXXXXXXXXXXXXXXXXX
```

#### 2.2 Update .env.local

Open your `.env.local` file in the project root and update:

```bash
# Square Configuration (SANDBOX for testing)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-YOUR_ACTUAL_VALUE
NEXT_PUBLIC_SQUARE_LOCATION_ID=YOUR_ACTUAL_LOCATION_ID
NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox

SQUARE_ACCESS_TOKEN=YOUR_ACTUAL_ACCESS_TOKEN
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=YOUR_ACTUAL_LOCATION_ID
SQUARE_WEBHOOK_SIGNATURE_KEY=optional
```

**IMPORTANT:**
- Use EXACT values from Square (no quotes, no spaces)
- Application ID MUST start with `sandbox-sq0idb-`
- Don't use production credentials for testing

---

### ✅ STEP 3: Restart Development Server (1 min)

```bash
# In your terminal, stop the server:
Ctrl + C

# Then restart:
npm run dev
```

**Wait for:**
```
✓ Ready in 3.2s
○ Local: http://localhost:3000
```

---

### ✅ STEP 4: Test Booking Flow (4 min)

#### 4.1 Navigate to Fleet
- Go to: **http://localhost:3000/fleet/corvette-c8-r**
- Verify car details show:
  - Daily: $419 ✅
  - 4-Hour: $219 ✅
  - Colors: Amplify Orange Tintcoat / Natural Dipped ✅

#### 4.2 Start Booking
- Click **"Book Now"**
- Should load checkout form (no errors)

#### 4.3 Fill Personal Info
```
Full Name: John Test
Email: john.test@example.com
Phone: +1 (727) 555-0123
DOB: 01/15/1990

Address: 123 Test Street
City: Tampa
State: FL
ZIP: 33602

License: D123-456-789
State: Florida
Expiration: 12/31/2027
```

#### 4.4 Configure Rental
```
Pickup: Tomorrow 10:00 AM
Dropoff: 3 days later 10:00 AM
Location: Orlando, FL
```

#### 4.5 Select Add-ons
- ☑ **Insurance** - $219/day (should show for Corvette)
- ☑ **Paid for Gas** - $89
- ☐ GPS - $15/day
- ☐ Additional Mileage (Call to Quote)

#### 4.6 Apply Promo Code
- Enter: **`RENT2GET1FREE`**
- Click "Apply"
- Should see: **-33% discount** applied

#### 4.7 Review & Confirm
- Verify total calculations:
  ```
  Base: $419 × 3 = $1,257
  Insurance: $219 × 3 = $657
  Gas: $89
  Subtotal: $2,003
  Promo (-33%): -$667
  Tax (7%): +$93
  ─────────────────
  TOTAL: $1,429
  
  💳 DUE NOW: $1,000
  ```
- ☑ Check "I agree to Terms"
- Click **"Confirm & Proceed to Payment"**

#### 4.8 Complete Payment
- Square form should load (no errors!) ✅
- Use test card:
  ```
  Card: 4111 1111 1111 1111
  Exp: 12/25
  CVV: 123
  ZIP: 12345
  ```
- Click **"Pay $1,000.00"**

#### 4.9 Verify Success
- Should redirect to `/checkout/success`
- Page shows:
  - ✅ Confirmation message
  - ✅ Booking details
  - ✅ Deposit receipt

---

### ✅ STEP 5: Verify Backend (Optional)

#### 5.1 Check Database
Open Supabase SQL Editor:
```sql
SELECT 
  customer_name,
  customer_email,
  status,
  deposit_amount,
  total_amount,
  promo_code
FROM bookings
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:**
```
customer_name: John Test
status: confirmed
deposit_amount: 1000.00
total_amount: 1429.00
promo_code: RENT2GET1FREE
```

#### 5.2 Check Admin Dashboard
- Go to: **http://localhost:3000/admin**
- Login
- Check bookings list
- Should see John Test's booking

---

## 🎉 Success Criteria

After completing all steps, you should have:

- ✅ No schema errors
- ✅ Square payment form loads
- ✅ Can complete test booking
- ✅ Promo code applies (33% off)
- ✅ Insurance shows correct price ($219/day for Corvette)
- ✅ Only deposit charged ($1,000)
- ✅ Confirmation page displays
- ✅ Booking in database
- ✅ Admin dashboard shows booking

---

## ❌ Troubleshooting

### Issue: Schema error still appears
**Fix:** Make sure you ran `supabase/fix_bookings_schema.sql` in Supabase SQL Editor

### Issue: Square error still appears
**Fix:** 
1. Verify Application ID starts with `sandbox-sq0idb-`
2. Restart server: `npm run dev`
3. Check browser console for exact ID being used

### Issue: Promo code doesn't apply
**Fix:** Run `supabase/add_promotions.sql` to add promo codes

### Issue: Car colors wrong
**Fix:** Run the seed script:
```sql
DELETE FROM cars;
-- Then run: supabase/seed_cars_local_images.sql
```

### Issue: Insurance shows wrong price
**Fix:** Already updated in `lib/constants/addons.ts` - restart server

---

## 📚 Reference Documents

- **Detailed Square Setup:** `readmefiles/SQUARE_SETUP_GUIDE.md`
- **Complete Testing Guide:** `readmefiles/TESTING_BOOKING_GUIDE.md`
- **Pricing Reference:** `readmefiles/PRICING_VERIFICATION_CARD.md`
- **Booking Flow Diagram:** `readmefiles/BOOKING_FLOW_DIAGRAM.md`

---

## 🚀 Quick Commands

```bash
# Restart server
npm run dev

# Check environment variables
npm run dev | grep "environment variables"

# Check if files exist
ls supabase/*.sql
```

---

## 📞 Need Help?

If you're still stuck after following all steps:

1. Check browser console (F12) for errors
2. Check terminal for server errors
3. Verify all SQL scripts ran successfully
4. Confirm `.env.local` has correct Square credentials
5. Make sure server was restarted

**Most common fix:** Restart the server after changing `.env.local` 🔄

