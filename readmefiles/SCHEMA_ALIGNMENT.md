# Database Schema & Form Alignment Guide

This document details the complete alignment between the database schema, admin forms, and frontend displays.

---

## 🔄 What Was Updated

### Database Schema Changes
- **Promo codes table**: Renamed columns to match form field names
- **Cars table**: Added missing fields for complete frontend display

### Form Updates
- **Car Form**: Now includes all fields needed for frontend display
- **Promo Code Form**: Fully aligned with database schema

### API Updates
- **All admin API routes**: Updated to handle complete field sets
- **Validation**: Consistent across database, forms, and APIs

---

## 🚗 Cars Table Schema

### Database Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary key (auto-generated) |
| `make` | TEXT | Yes | Manufacturer (e.g., "Lamborghini") |
| `model` | TEXT | Yes | Model name (e.g., "Huracan") |
| `year` | INTEGER | Yes | Year of manufacture |
| `vin` | TEXT | Yes | Vehicle Identification Number (unique) |
| `license_plate` | TEXT | Yes | License plate number (unique) |
| `category` | TEXT | No | Category: "exotic", "luxury", or "sports" |
| `slug` | TEXT | No | URL-friendly slug (unique, e.g., "lamborghini-huracan") |
| `description` | TEXT | No | Full vehicle description |
| `exterior_color` | TEXT | No | Exterior color description |
| `interior_color` | TEXT | No | Interior color description |
| `daily_rate` | DECIMAL(12,2) | Yes | Daily rental rate |
| `four_hour_rate` | DECIMAL(12,2) | No | 4-hour rental rate (if offered) |
| `weekly_rate` | DECIMAL(12,2) | No | Weekly rental rate |
| `monthly_rate` | DECIMAL(12,2) | No | Monthly rental rate |
| `security_deposit` | DECIMAL(12,2) | Yes | Security deposit amount |
| `status` | car_status | Yes | "available", "booked", "maintenance", "inactive" |
| `current_location` | TEXT | No | Current vehicle location |
| `images` | JSONB | Yes | Array of image URLs |
| `features` | JSONB | Yes | Array of feature strings |
| `specifications` | JSONB | Yes | Object with specs (engine, horsepower, etc.) |
| `created_at` | TIMESTAMPTZ | Auto | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Auto | Last update timestamp |
| `deleted_at` | TIMESTAMPTZ | No | Soft delete timestamp |

### Form Fields (Admin → Add/Edit Car)

The car form now includes ALL these sections:

#### **Basic Information**
- Make
- Model
- Year
- Category (exotic/luxury/sports)
- Slug (URL-friendly)
- Description (textarea)
- Status (dropdown)

#### **Identification**
- VIN
- License Plate
- Current Location

#### **Pricing**
- Daily Rate
- 4-Hour Rate
- Weekly Rate
- Monthly Rate
- Security Deposit

#### **Colors**
- Exterior Color
- Interior Color

#### **Specifications**
- Engine
- Horsepower
- 0-60 mph
- Top Speed
- Transmission
- Drivetrain

#### **Images**
- Multiple image URLs (with preview)
- Add/remove functionality

#### **Features**
- Multi-line textarea
- One feature per line
- Automatically converts to array

### Frontend Display

Cars are displayed on:
- `/fleet` - Fleet listing page (uses slug, category, images, pricing)
- `/fleet/[slug]` - Individual car pages (uses ALL fields)

---

## 🎟️ Promo Codes Table Schema

### Database Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary key (auto-generated) |
| `code` | TEXT | Yes | Promo code (unique, uppercase) |
| `description` | TEXT | No | Description of promotion |
| `discount_type` | promo_discount_type | Yes | "percentage" or "fixed" |
| `discount_value` | DECIMAL(12,2) | Yes | Discount amount (% or $) |
| `starts_at` | TIMESTAMPTZ | Yes | Start date |
| `expires_at` | TIMESTAMPTZ | No | Expiry date (null = no expiry) |
| `max_uses` | INTEGER | No | Max number of uses (null = unlimited) |
| `used_count` | INTEGER | Yes | Number of times used (default 0) |
| `min_booking_amount` | DECIMAL(12,2) | No | Minimum booking amount required |
| `campaign_source` | TEXT | No | Source: "spin_wheel", "valentines", etc. |
| `applicable_car_categories` | JSONB | No | Array of categories (empty = all) |
| `status` | promo_status | Yes | "active", "inactive", or "expired" |
| `created_by` | UUID | No | Admin user who created it |
| `created_at` | TIMESTAMPTZ | Auto | Creation timestamp |

### Field Name Changes (Database Migration Required)

| Old Name | New Name |
|----------|----------|
| `start_date` | `starts_at` |
| `end_date` | `expires_at` |
| `times_used` | `used_count` |
| `min_rental_days` | `min_booking_amount` |

### Form Fields (Admin → Create/Edit Promo Code)

The promo form now includes:

- **Code** - Uppercase, unique
- **Description** - Optional description
- **Discount Type** - Percentage or Fixed Amount
- **Discount Value** - Number value
- **Start Date** - Required start date
- **Expiry Date** - Optional end date
- **Max Uses** - Optional usage limit
- **Min Booking Amount** - Minimum booking $ required
- **Campaign Source** - Optional source tracking
- **Status** - Active/Inactive/Expired

### Frontend Display

Promo codes are used in:
- Checkout forms (validation against database)
- Admin dashboard (display all fields)
- Marketing campaigns (campaign_source tracking)

---

## 🔧 Migration Instructions

### Step 1: Run Database Migration

Execute the schema update script on your Supabase database:

```bash
# In Supabase SQL Editor, run:
supabase/schema_update.sql
```

This will:
- Rename promo_codes columns to match forms
- Add missing columns to cars table
- Create necessary indexes

### Step 2: Verify Tables

```sql
-- Check cars table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cars'
ORDER BY ordinal_position;

-- Check promo_codes table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'promo_codes'
ORDER BY ordinal_position;
```

### Step 3: Update Existing Data (if needed)

If you have existing cars without the new fields:

```sql
-- Add default slugs to existing cars
UPDATE cars 
SET slug = LOWER(CONCAT(REPLACE(make, ' ', '-'), '-', REPLACE(model, ' ', '-')))
WHERE slug IS NULL;

-- Add category to existing cars
UPDATE cars 
SET category = 'exotic'
WHERE category IS NULL;

-- Add default security deposit
UPDATE cars 
SET security_deposit = 1000.00
WHERE security_deposit IS NULL;
```

If you have existing promo codes, the migration script automatically renames columns, so no data loss occurs.

### Step 4: Test Forms

1. **Test Car Form**:
   - Go to `/admin/cars/new`
   - Fill in all fields
   - Submit and verify data is saved

2. **Test Promo Form**:
   - Go to `/admin/promo-codes`
   - Click "Create Promo Code"
   - Fill in all fields
   - Submit and verify data is saved

3. **Verify Display**:
   - Check `/fleet` page shows cars correctly
   - Check `/fleet/[slug]` page displays all details
   - Check promo codes display in admin

---

## 📝 API Endpoints

### Cars API

**POST `/api/admin/cars`** - Create new car
```json
{
  "make": "Lamborghini",
  "model": "Huracan",
  "year": 2023,
  "vin": "UNIQUE_VIN",
  "license_plate": "ABC123",
  "category": "exotic",
  "slug": "lamborghini-huracan",
  "description": "A stunning supercar...",
  "exterior_color": "Giallo Orion",
  "interior_color": "Black Alcantara",
  "daily_rate": 1049.00,
  "four_hour_rate": null,
  "weekly_rate": 6500.00,
  "monthly_rate": 20000.00,
  "security_deposit": 1000.00,
  "status": "available",
  "current_location": "Tampa Bay, FL",
  "images": ["url1", "url2"],
  "features": ["Feature 1", "Feature 2"],
  "specifications": {
    "engine": "5.2L V10",
    "horsepower": "610 HP",
    "acceleration": "2.9 seconds",
    "topSpeed": "202 mph",
    "transmission": "7-Speed Dual-Clutch",
    "drivetrain": "AWD"
  }
}
```

**PATCH `/api/admin/cars/[id]`** - Update car (same fields as POST)

**DELETE `/api/admin/cars/[id]`** - Soft delete car

### Promo Codes API

**POST `/api/admin/promo-codes`** - Create promo code
```json
{
  "code": "SUMMER24",
  "description": "Summer 2024 promotion",
  "discount_type": "percentage",
  "discount_value": 15.00,
  "starts_at": "2024-06-01",
  "expires_at": "2024-08-31",
  "max_uses": 100,
  "min_booking_amount": 500.00,
  "campaign_source": "email_campaign",
  "applicable_car_categories": ["exotic", "luxury"],
  "status": "active"
}
```

**PATCH `/api/admin/promo-codes/[id]`** - Update promo (same fields as POST)

**DELETE `/api/admin/promo-codes/[id]`** - Delete promo code

---

## ✅ Validation Rules

### Cars
- **VIN**: Must be unique
- **License Plate**: Must be unique
- **Slug**: Must be unique and URL-safe
- **Daily Rate**: Required, must be > 0
- **Security Deposit**: Required, must be > 0
- **Status**: Must be one of: available, booked, maintenance, inactive
- **Category**: Must be one of: exotic, luxury, sports

### Promo Codes
- **Code**: Must be unique, uppercase, alphanumeric
- **Discount Type**: Must be "percentage" or "fixed"
- **Discount Value**: Must be > 0
- **Starts At**: Required, must be valid date
- **Expires At**: If provided, must be after starts_at
- **Status**: Must be one of: active, inactive, expired

---

## 🎨 Form Component Files

### Car Form
- **File**: `components/admin/CarForm.tsx`
- **Used in**: `/admin/cars/new` and `/admin/cars/[id]/edit`
- **Sections**: 7 cards with all fields organized logically

### Promo Code Form
- **File**: `components/admin/PromoDialog.tsx`
- **Used in**: `/admin/promo-codes`
- **Type**: Modal dialog with form

---

## 🔍 Troubleshooting

### "Column does not exist" error
**Solution**: Run the `schema_update.sql` migration script

### Slug conflicts
**Solution**: Ensure each car has a unique slug. Append numbers if needed:
```
lamborghini-huracan
lamborghini-huracan-2
lamborghini-huracan-yellow
```

### Promo code field mismatch
**Solution**: The migration script renames columns automatically. If you still see errors, manually run:
```sql
ALTER TABLE promo_codes RENAME COLUMN start_date TO starts_at;
ALTER TABLE promo_codes RENAME COLUMN end_date TO expires_at;
ALTER TABLE promo_codes RENAME COLUMN times_used TO used_count;
ALTER TABLE promo_codes RENAME COLUMN min_rental_days TO min_booking_amount;
```

### Specifications not saving
**Solution**: Specifications is a JSONB field. Make sure you're passing an object:
```json
{
  "specifications": {
    "engine": "5.2L V10",
    "horsepower": "610 HP"
  }
}
```

---

## 📊 Summary

### Before Alignment
- ❌ Form fields didn't match database
- ❌ Missing fields for frontend display
- ❌ Inconsistent field names
- ❌ Incomplete car information

### After Alignment
- ✅ Perfect match between DB and forms
- ✅ All fields for complete frontend display
- ✅ Consistent naming across entire stack
- ✅ Complete car and promo data capture

---

## 🚀 Next Steps

1. **Run Migration**: Execute `schema_update.sql` in Supabase
2. **Test Forms**: Add a test car and promo code
3. **Verify Display**: Check frontend shows all data correctly
4. **Update Existing**: Migrate any existing data to new schema
5. **Documentation**: Update any custom docs with new field names

---

**Last Updated**: January 2026
**Version**: 2.0 (Fully Aligned)
