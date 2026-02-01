# 🧪 Complete Booking Testing Guide

**Time Required:** 10 minutes  
**Prerequisites:** Database setup complete, dev server running

---

## 🔧 STEP 1: Fix Database Schema (REQUIRED)

### Run this SQL script in Supabase SQL Editor:

```sql
-- Copy and paste entire contents of: supabase/fix_bookings_schema.sql
```

**What this does:**
- Adds missing columns to `bookings` table
- Fixes the "additional_driver_info column not found" error
- Verifies schema is correct

---

## 🚀 STEP 2: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📋 STEP 3: Test Complete Booking Flow

### Test Case 1: Corvette C8-R with Promo Code

1. **Browse to Fleet Page**
   - Go to: http://localhost:3000/fleet
   - Find "Corvette C8-R"
   - Verify details:
     - ✅ Daily Rate: $419
     - ✅ 4-Hour Rate: $219
     - ✅ Exterior: Amplify Orange Tintcoat
     - ✅ Interior: Natural Dipped

2. **Click "Book Now"**
   - Should redirect to: `/checkout/corvette-c8-r`

3. **Fill Personal Information (Step 1)**
   ```
   Full Name: John Doe
   Email: john.doe@example.com
   Phone: +1 (727) 555-0123
   Date of Birth: 01/15/1990
   
   Street Address: 123 Exotic Lane
   City: Tampa
   State: FL
   ZIP: 33602
   
   License Number: D123-456-789-012
   License State: Florida
   License Expiration: 12/31/2027
   ```
   - Click "Rental Details" →

4. **Configure Rental (Step 2)**
   ```
   Pickup Date: Tomorrow at 10:00 AM
   Dropoff Date: 3 days later at 10:00 AM
   Pickup Location: Orlando, FL
   Dropoff Location: Orlando, FL
   ```

5. **Select Add-ons**
   - ☑ **Adriatic Bay Exotics Insurance (under $599/day)** - $219/day
   - ☑ **Paid for Gas** - $89
   - ☐ GPS Navigation - $15/day
   - ☐ Additional Mileage (Call to Quote)
   
   **Expected Calculation:**
   ```
   Base: $419 × 3 days = $1,257
   Insurance: $219 × 3 = $657
   Gas: $89
   ─────────────────────
   Subtotal: $2,003
   ```
   - Click "Review Booking" →

6. **Review & Apply Promo (Step 3)**
   - Review all details
   - Enter Promo Code: **`RENT2GET1FREE`**
   - Click "Apply"
   - **Expected Discount:** -$667 (33.33% off)
   
   **New Total:**
   ```
   Subtotal: $2,003
   Promo (-33.33%): -$667
   Tax (7%): +$93
   ═════════════════════
   TOTAL: $1,429
   
   💳 DUE NOW: $1,000 (Deposit)
   💵 At Pickup: $1,429
   ```
   
   - ☑ Check "I agree to Terms & Conditions"
   - Click "Confirm & Proceed to Payment" →

7. **Payment (Step 4)**
   - Square payment form should load
   - **Amount shown:** $1,000.00 (deposit only) ✅
   
   **Test Card (Square Sandbox):**
   ```
   Card Number: 4111 1111 1111 1111
   Expiration: 12/25
   CVV: 123
   ZIP: 12345
   ```
   
   - Click "Pay $1,000.00"

8. **Confirmation**
   - Should redirect to: `/checkout/success?bookingId={uuid}`
   - Page should show:
     - ✅ Booking confirmed message
     - ✅ Booking details
     - ✅ Deposit receipt ($1,000)
     - ✅ Remaining balance ($1,429)

---

## 📧 STEP 4: Verify Email Automation

### Check Email Inbox (john.doe@example.com)

**Expected Email from Adriatic Bay Exotics:**

```
Subject: Booking Confirmation - Corvette C8-R

Dear John Doe,

Your booking has been confirmed!

BOOKING DETAILS
───────────────
Car: 2024 Chevrolet Corvette C8-R
Pickup: [Date/Time] at Orlando, FL
Dropoff: [Date/Time] at Orlando, FL

PAYMENT SUMMARY
───────────────
Total Contract: $1,429.00
Deposit Paid: $1,000.00 ✅
Balance Due at Pickup: $1,429.00

[View Booking Details Button]

Questions? Call us 24/7 at (727) XXX-XXXX
```

**If email NOT received:**
- Check Supabase logs
- Verify Resend API key in `.env.local`
- Check spam folder

---

## 🗄️ STEP 5: Verify Backend Database

### Check Bookings Table in Supabase

Run this query in SQL Editor:

```sql
SELECT 
    id,
    customer_name,
    customer_email,
    car_id,
    status,
    payment_status,
    deposit_amount,
    total_amount,
    promo_code,
    discount_amount,
    pickup_datetime,
    dropoff_datetime,
    created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result:**
```
id: [uuid]
customer_name: John Doe
customer_email: john.doe@example.com
status: confirmed
payment_status: unpaid (deposit paid, balance pending)
deposit_amount: 1000.00
total_amount: 1429.00
promo_code: RENT2GET1FREE
discount_amount: 667.00
```

### Check Payments Table

```sql
SELECT 
    id,
    booking_id,
    amount,
    payment_type,
    status,
    square_payment_id,
    created_at
FROM payments
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result:**
```
payment_type: security_deposit
amount: 1000.00
status: completed
square_payment_id: [square_id]
```

---

## 🎯 STEP 6: Test Admin Dashboard

1. **Login to Admin Panel**
   - Go to: http://localhost:3000/admin
   - Login with admin credentials

2. **View Bookings**
   - Navigate to: `/admin/bookings`
   - Should see the new booking:
     - ✅ Customer: John Doe
     - ✅ Car: Corvette C8-R
     - ✅ Status: Confirmed
     - ✅ Deposit: Paid ($1,000)
     - ✅ Balance: $1,429

3. **View Booking Details**
   - Click on the booking
   - Verify all information is correct:
     - Personal info ✅
     - License details ✅
     - Rental dates ✅
     - Add-ons selected ✅
     - Payment history ✅

---

## 🧪 Additional Test Cases

### Test Case 2: McLaren 570S (High-End Insurance)

**Expected:**
- Daily Rate: $1,199
- Insurance: $349/day (cars over $999/day) ✅
- 4-Hour Rate: $589
- Deposit: $1,000
- Promo: RENT2GET1FREE applies

### Test Case 3: Maserati Levante (Lower Deposit)

**Expected:**
- Daily Rate: $199
- Insurance: $219/day (cars under $599/day) ✅
- No 4-hour option
- Deposit: $500 ✅
- Promo: RENT2GET1FREE applies

### Test Case 4: Lamborghini Huracan (No 4-Hour)

**Expected:**
- Daily Rate: $1,049
- No 4-hour rental option ✅
- Deposit: $1,000
- No promo available

---

## ❌ Common Issues & Solutions

### Issue 1: "additional_driver_info column not found"
**Solution:** Run `supabase/fix_bookings_schema.sql`

### Issue 2: Promo code not applying
**Solution:** 
```sql
-- Verify promo codes exist
SELECT * FROM promo_codes WHERE status = 'active';

-- If empty, run: supabase/add_promotions.sql
```

### Issue 3: Payment fails
**Solution:**
- Check Square credentials in `.env.local`
- Verify Square sandbox mode is enabled
- Check browser console for errors

### Issue 4: Email not sending
**Solution:**
- Verify Resend API key: `RESEND_API_KEY=re_...`
- Check Supabase function logs
- Verify email template exists

### Issue 5: Car shows as unavailable
**Solution:**
```sql
-- Check car status
SELECT id, make, model, status FROM cars;

-- Update if needed
UPDATE cars SET status = 'available' WHERE slug = 'corvette-c8-r';
```

---

## ✅ Success Checklist

After testing, verify:

- ✅ Booking form loads without errors
- ✅ All personal information fields work
- ✅ Date/time pickers function correctly
- ✅ Add-ons show correct pricing:
  - Insurance: $219/day or $349/day
  - Gas: $89
  - Mileage: "Call to Quote"
- ✅ Promo code applies correctly (33.33% off)
- ✅ Square payment charges ONLY deposit
- ✅ Confirmation page displays
- ✅ Email confirmation received
- ✅ Booking appears in database
- ✅ Payment recorded in payments table
- ✅ Admin dashboard shows booking
- ✅ Car status updates (if configured)

---

## 📊 Expected Pricing Examples

### Corvette C8-R (3 days, with promo)
```
Base: $419 × 3 = $1,257
Insurance: $219 × 3 = $657
Gas: $89
Subtotal: $2,003
Promo (-33.33%): -$667
Tax (7%): +$93
─────────────────────
TOTAL: $1,429
Deposit: $1,000
Balance: $1,429
```

### McLaren 570S (2 days, with promo)
```
Base: $1,199 × 2 = $2,398
Insurance: $349 × 2 = $698
Gas: $89
Subtotal: $3,185
Promo (-33.33%): -$1,062
Tax (7%): +$149
─────────────────────
TOTAL: $2,272
Deposit: $1,000
Balance: $2,272
```

### Maserati Levante (3 days, with promo)
```
Base: $199 × 3 = $597
Insurance: $219 × 3 = $657
Gas: $89
Subtotal: $1,343
Promo (-33.33%): -$448
Tax (7%): +$63
─────────────────────
TOTAL: $958
Deposit: $500
Balance: $958
```

---

## 🚀 Ready to Test!

1. Run `supabase/fix_bookings_schema.sql` ✅
2. Start dev server: `npm run dev` ✅
3. Follow Test Case 1 step-by-step ✅
4. Verify email and database ✅
5. Check admin dashboard ✅

**Good luck!** 🏎️💨

