# 🔍 Troubleshooting: "Failed to validate promo code"

## 🎯 Let's Find the Exact Problem

### **Step 1: Run Diagnostic Script**

Go to Supabase SQL Editor and run this:

```sql
-- Check columns
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'promo_codes'
ORDER BY ordinal_position;
```

**Tell me what columns you see!** Especially look for:
- ✓ `start_date` or `starts_at`?
- ✓ `end_date` or `expires_at`?
- ✓ `times_used` or `used_count`?

---

### **Step 2: Check if Promo Code Exists**

```sql
SELECT * FROM promo_codes WHERE code = 'WELCOME2024';
```

**Does this return any results?**
- ❌ **No results** = The promo code doesn't exist in your database
- ✅ **Has results** = Code exists, column mismatch issue

---

### **Step 3: Check if Function Was Updated**

```sql
SELECT routine_name, created
FROM information_schema.routines
WHERE routine_name = 'validate_and_increment_promo';
```

**Does it show a recent timestamp?**
- ❌ **Old date** = Function wasn't updated
- ✅ **Recent date** = Function was updated

---

### **Step 4: Test the Function Directly**

```sql
SELECT * FROM validate_and_increment_promo('WELCOME2024', 3, NULL);
```

**What error do you get?**

---

## 🔧 **Quick Fixes Based on Results**

### **If No Promo Codes Exist:**

Run this to create test codes:

```sql
-- For OLD column names (start_date, end_date, times_used)
INSERT INTO promo_codes (
    code,
    discount_type,
    discount_value,
    start_date,
    end_date,
    times_used,
    max_uses,
    min_rental_days,
    status
) VALUES 
(
    'WELCOME2024',
    'percentage',
    10.00,
    NOW(),
    NOW() + INTERVAL '1 year',
    0,
    100,
    1,
    'active'
),
(
    'TEST50',
    'fixed',
    50.00,
    NOW(),
    NOW() + INTERVAL '30 days',
    0,
    50,
    1,
    'active'
);

-- OR for NEW column names (starts_at, expires_at, used_count)
INSERT INTO promo_codes (
    code,
    discount_type,
    discount_value,
    starts_at,
    expires_at,
    used_count,
    max_uses,
    min_booking_amount,
    status
) VALUES 
(
    'WELCOME2024',
    'percentage',
    10.00,
    NOW(),
    NOW() + INTERVAL '1 year',
    0,
    100,
    1,
    'active'
),
(
    'TEST50',
    'fixed',
    50.00,
    NOW(),
    NOW() + INTERVAL '30 days',
    0,
    50,
    1,
    'active'
);
```

---

### **If Function Not Updated:**

Re-run the function update (from previous message) in Supabase SQL Editor.

---

### **If Column Names Don't Match:**

**Option A: Rename columns (Recommended)**
```sql
ALTER TABLE promo_codes RENAME COLUMN start_date TO starts_at;
ALTER TABLE promo_codes RENAME COLUMN end_date TO expires_at;
ALTER TABLE promo_codes RENAME COLUMN times_used TO used_count;
```

**Option B: Use old column names everywhere**
Keep `start_date`, `end_date`, `times_used` and update the function to use those names only.

---

## 📊 **Common Issues**

### **Issue 1: Empty Table**
```
Error: Invalid promo code
Solution: Insert promo codes (see above)
```

### **Issue 2: Wrong Column Names**
```
Error: Column "starts_at" does not exist
Solution: Either rename columns OR use old names
```

### **Issue 3: Function Not Updated**
```
Error: Failed to validate promo code
Solution: Re-run the CREATE OR REPLACE FUNCTION
```

### **Issue 4: RLS Policies**
```
Error: Permission denied
Solution: Check RLS policies on promo_codes table
```

---

## 🎯 **What I Need From You**

Please run these 3 queries and tell me the results:

1. **Check columns:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'promo_codes';
```

2. **Check promo codes:**
```sql
SELECT code, discount_value, status FROM promo_codes;
```

3. **Test function:**
```sql
SELECT * FROM validate_and_increment_promo('WELCOME2024', 3, NULL);
```

**Send me what you see and I'll give you the exact fix!** 🔍
