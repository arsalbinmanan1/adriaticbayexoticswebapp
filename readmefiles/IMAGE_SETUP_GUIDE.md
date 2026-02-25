# 🖼️ Image Setup Guide for Database Cars

## Problem

The `cars-data.ts` file uses local image imports, but the database needs actual URLs. You have 2 options:

---

## ✅ Option 1: Use Local Image Paths (Quick & Easy)

Keep images in `/public/car-images/` and reference them as paths.

### Update the Seed Script

Replace the image URLs in `supabase/seed_cars_from_data.sql` with local paths:

**Change FROM:**
```sql
'["https://raw.githubusercontent.com/yourusername/..."]'::jsonb
```

**Change TO:**
```sql
'["/car-images/Corvette1.jpeg", "/car-images/Corvette2.jpeg", "/car-images/Corvette3.jpeg"]'::jsonb
```

### Example for Corvette:
```sql
images,
'["/car-images/Corvette1.jpeg", "/car-images/Corvette2.jpeg", "/car-images/Corvette3.jpeg", "/car-images/Corvette4.jpeg", "/car-images/Corvette5.jpeg", "/car-images/Corvette6.jpeg", "/car-images/Corvette7.jpeg", "/car-images/Corvette8.jpeg"]'::jsonb,
```

**Benefit:** Works immediately, no upload needed.

---

## ✅ Option 2: Upload to Supabase Storage (Production Ready)

Upload images to Supabase Storage for better performance and CDN.

### Step 1: Create Storage Bucket

In Supabase Dashboard:
1. Go to **Storage**
2. Click **New Bucket**
3. Name: `car-images`
4. Make it **Public**

### Step 2: Upload Images

1. Open `/public/car-images/` folder
2. In Supabase Storage → `car-images` bucket
3. Click **Upload Files**
4. Select all images and upload

### Step 3: Get URLs

After upload, each image gets a URL like:
```
https://your-project.supabase.co/storage/v1/object/public/car-images/Corvette1.jpeg
```

> **Tip:** the application now automatically rewrites any relative path
> (for example `/car-images/Corvette1.jpeg` or just `Corvette1.jpeg`) into
> the full Supabase bucket URL using the `NEXT_PUBLIC_SUPABASE_URL` and an
> optional `NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET` variable (default
> `car-images`). This means your seed data can continue to use short
> filenames or local paths; the front–end will turn them into the correct
> CDN URL at runtime.

### Step 4: Update Seed Script

Replace image arrays with Supabase URLs (or leave the short paths and let
`normalizeImageValue` convert them automatically at runtime):

```sql
images,
'["https://yourproject.supabase.co/storage/v1/object/public/car-images/Corvette1.jpeg", 
  "https://yourproject.supabase.co/storage/v1/object/public/car-images/Corvette2.jpeg"]'::jsonb,
```

or simply

```sql
images,
'["Corvette1.jpeg","Corvette2.jpeg"]'::jsonb,
```

and the code will build the public URL for you.

**Benefit:** Better for production, CDN delivery, faster loading.

---

## ✅ Option 3: Use External Image Host (Alternative)

Upload to services like:
- **Imgur** - Free, easy
- **Cloudinary** - Free tier, CDN
- **AWS S3** - Scalable, paid

Then use those URLs in the seed script.

---

## 🚀 Quick Start (Recommended: Option 1)

I'll create an updated seed script with local paths for you now...

