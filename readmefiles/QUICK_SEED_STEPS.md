# ⚡ Quick Seed Steps - 2 Minutes

## Copy-Paste This in Supabase SQL Editor:

### Step 1: Schema Update (if not done)
```sql
-- Copy ALL contents from: supabase/schema_update.sql
-- Paste in Supabase SQL Editor
-- Click RUN
```

### Step 2: Seed Cars
```sql
-- Copy ALL contents from: supabase/seed_cars_local_images.sql
-- Paste in Supabase SQL Editor
-- Click RUN
```

### Step 3: Verify
```sql
SELECT 
    make || ' ' || model as car,
    daily_rate,
    category,
    status
FROM cars 
ORDER BY daily_rate DESC;
```

**Expected Result:**
```
McLaren 650S Spyder      | $1,399 | exotic  | available
McLaren 570S Spyder      | $1,199 | exotic  | available
Lamborghini Huracan      | $1,049 | exotic  | available
Lamborghini Urus         | $1,049 | exotic  | available
Corvette C8-R            |   $419 | sports  | available
Maserati Levante         |   $199 | luxury  | available
```

---

## ✅ Done!

Now visit:
- **http://localhost:3000/fleet** → See all cars
- **http://localhost:3000/fleet/corvette-c8-r** → See individual car
- **http://localhost:3000/admin/cars** → Manage cars

---

## 🖼️ Image Paths Being Used

```
/car-images/Corvette1.jpeg
/car-images/Corvette2.jpeg
/car-images/McLarenBlue1.jpeg
/car-images/Lamborghini1.jpeg
/car-images/maserati1.webp
/car-images/Urus1.jpeg
/car-images/McLarenOrange1.jpeg
... etc.
```

These work automatically from your `/public/car-images/` folder!

---

## 📚 Full Guides Available

- **`CARS_SEEDING_SUMMARY.md`** - Complete overview
- **`SEED_CARS_GUIDE.md`** - Detailed guide + troubleshooting
- **`IMAGE_SETUP_GUIDE.md`** - Image hosting options

---

**That's it! 2 SQL scripts and you're done! 🎉**
