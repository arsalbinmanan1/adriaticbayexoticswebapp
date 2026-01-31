# 🚗 Seed Cars from cars-data.ts to Database

## Quick Setup (5 Minutes)

### Step 1: Run Database Migration (if not already done)

Make sure you've run the schema alignment:

```bash
# In Supabase SQL Editor, run:
supabase/schema_update.sql
```

### Step 2: Seed the Cars

In Supabase SQL Editor, run:

```bash
supabase/seed_cars_local_images.sql
```

This will insert all 6 cars from `lib/cars-data.ts` into your database:
- ✅ Corvette C8-R
- ✅ McLaren 570S Spyder
- ✅ Lamborghini Huracan
- ✅ Maserati Levante
- ✅ Lamborghini Urus
- ✅ McLaren 650S Spyder

### Step 3: Verify

Check your database:

```sql
SELECT make, model, slug, category, daily_rate, status 
FROM cars 
ORDER BY daily_rate DESC;
```

You should see all 6 cars!

---

## 📊 What Gets Seeded

### Complete Data from cars-data.ts:

| Field | Mapped To DB |
|-------|-------------|
| `brand` | `make` |
| `model` | `model` |
| `year` | `year` |
| `slug` | `slug` |
| `category` | `category` |
| `pricing.perDay` | `daily_rate` |
| `pricing.fourHours` | `four_hour_rate` |
| `pricing.deposit` | `security_deposit` |
| `colors.exterior` | `exterior_color` |
| `colors.interior` | `interior_color` |
| `images.gallery` | `images` (JSONB array) |
| `specs` | `specifications` (JSONB object) |
| `features` | `features` (JSONB array) |
| `description + detailedDescription` | `description` (combined) |
| `available` | `status` |

### Generated Data:
- `vin` - Generated unique VINs
- `license_plate` - Generated plate numbers
- `weekly_rate` - Calculated from daily rate
- `monthly_rate` - Calculated from daily rate
- `current_location` - Set to "Tampa Bay, FL"

---

## 🖼️ About Images

The seed script uses **local image paths** from `/public/car-images/`:
- `/car-images/Corvette1.jpeg`
- `/car-images/McLarenBlue1.jpeg`
- etc.

**These work automatically** because Next.js serves files from `/public/` at the root URL!

### Want to use Supabase Storage instead?
See `IMAGE_SETUP_GUIDE.md` for instructions.

---

## ✅ Frontend Display

The fleet pages are **already configured** to read from the database!

### Pages that display database cars:
- `/fleet` - Fleet listing with filters
- `/fleet/[slug]` - Individual car detail pages
- `/admin/cars` - Admin fleet management
- Homepage car showcase

### Data Flow:
```
Database (Supabase)
    ↓
API Routes
    ↓
Fleet Pages
    ↓
Beautiful Display ✨
```

---

## 🎨 What You'll See

### Fleet Page (`/fleet`)
- All 6 cars in a grid
- Filter by category (All, Exotic, Luxury, Sports)
- Car images, pricing, colors
- "View Details" and "Book Now" buttons

### Individual Car Pages (`/fleet/corvette-c8-r`)
- Image gallery with thumbnails
- Complete specifications
- All features listed
- Pricing breakdown
- Rental requirements
- "You May Also Like" section

### Admin Dashboard (`/admin/cars`)
- Full CRUD operations
- Edit any car details
- Update pricing, images, features
- Change status (available, booked, maintenance)

---

## 🔄 Updating Data

### Option 1: Use Admin Dashboard (Recommended)
1. Go to `/admin/cars`
2. Click on any car
3. Edit details
4. Save changes

### Option 2: Direct Database Update
```sql
UPDATE cars 
SET daily_rate = 449.00 
WHERE slug = 'corvette-c8-r';
```

### Option 3: Re-seed
```sql
-- Delete existing
DELETE FROM cars WHERE slug = 'corvette-c8-r';

-- Run seed script again
```

---

## 🚀 Production Checklist

Before going live:
- [ ] Run `schema_update.sql`
- [ ] Run `seed_cars_local_images.sql`
- [ ] Verify all 6 cars appear in `/fleet`
- [ ] Test individual car pages
- [ ] Replace placeholder VINs with real ones (if needed)
- [ ] Replace placeholder license plates
- [ ] Update car images with professional photos
- [ ] Verify all pricing is correct
- [ ] Test admin CRUD operations
- [ ] Check mobile responsiveness

---

## 🆚 Static vs Database Comparison

### Before (Static cars-data.ts):
- ❌ Can't update without code deploy
- ❌ No dynamic availability
- ❌ Can't track bookings
- ❌ No admin interface
- ❌ Manual code edits required

### After (Database):
- ✅ Update via admin dashboard
- ✅ Real-time availability
- ✅ Booking integration
- ✅ Full admin interface
- ✅ No code changes needed

---

## 📝 Notes

### VINs and License Plates
The seed script generates placeholder values:
- VIN: `C8R001CORVETTE001`
- Plate: `CORV8`

**For production:** Update these with your actual vehicle identification numbers.

```sql
UPDATE cars 
SET 
    vin = 'YOUR_REAL_VIN',
    license_plate = 'YOUR_PLATE'
WHERE slug = 'corvette-c8-r';
```

### Weekly and Monthly Rates
Auto-calculated as:
- Weekly: `daily_rate * 6` (6-day rate)
- Monthly: `daily_rate * 25` (25-day rate)

Adjust as needed:
```sql
UPDATE cars 
SET 
    weekly_rate = 2400.00,
    monthly_rate = 7500.00
WHERE slug = 'corvette-c8-r';
```

---

## ❓ Troubleshooting

### "Duplicate key value violates unique constraint"
**Solution:** Cars already seeded. Either:
- Skip re-seeding
- Or delete existing first: `DELETE FROM cars;`

### Images not displaying
**Solution:** Check image paths:
```sql
SELECT slug, images FROM cars;
```
Paths should be: `/car-images/filename.jpeg`

### "Column does not exist"
**Solution:** Run `schema_update.sql` first to add missing columns.

### Cars not showing on /fleet
**Solution:** 
1. Check database has cars: `SELECT COUNT(*) FROM cars;`
2. Check status: `UPDATE cars SET status = 'available';`
3. Hard refresh browser (Ctrl+Shift+R)

---

## 🎉 Success!

After seeding, you'll have:
- ✅ 6 luxury vehicles in database
- ✅ Complete details for each
- ✅ Beautiful fleet page
- ✅ Individual car detail pages
- ✅ Full admin control
- ✅ Ready for bookings!

**Now go to `/fleet` and see your beautiful car lineup! 🏎️💨**

---

## 📚 Related Documentation

- `IMAGE_SETUP_GUIDE.md` - Image hosting options
- `SCHEMA_ALIGNMENT.md` - Database schema details
- `README.md` - Full project documentation

---

**Last Updated:** January 2026
