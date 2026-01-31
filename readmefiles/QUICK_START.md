# 🚀 Quick Start Guide

Get Adriatic Bay Exotics running in 10 minutes!

## Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

## Step 2: Set Up Environment Variables (3 minutes)

1. **Create `.env.local` file:**
   ```bash
   copy .env.example .env.local
   ```

2. **Get Supabase Credentials (REQUIRED):**
   - Sign up at [supabase.com](https://supabase.com/)
   - Create a new project
   - Go to Settings → API
   - Copy these to `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

3. **Generate JWT Secret (REQUIRED):**
   ```bash
   # Run this command to generate a secure secret:
   openssl rand -base64 32
   ```
   Copy the result to `JWT_SECRET` in `.env.local`

4. **Get Square Credentials (REQUIRED):**
   - Sign up at [squareup.com/developers](https://developer.squareup.com/)
   - Create an application
   - Use **Sandbox** for testing
   - Copy these to `.env.local`:
     - `SQUARE_ACCESS_TOKEN`
     - `SQUARE_ENVIRONMENT=sandbox`
     - `SQUARE_LOCATION_ID`
     - `NEXT_PUBLIC_SQUARE_APPLICATION_ID`

5. **Get Resend API Key (REQUIRED):**
   - Sign up at [resend.com](https://resend.com/)
   - Create an API key
   - Copy to `RESEND_API_KEY` in `.env.local`

## Step 3: Set Up Database (3 minutes)

1. **Open Supabase SQL Editor:**
   - Go to your Supabase project
   - Click "SQL Editor" in the sidebar
   - Click "New Query"

2. **Run Setup Script:**
   - Open `supabase/full_setup.sql` in your code editor
   - Copy ALL the contents
   - Paste into Supabase SQL Editor
   - Click "Run"
   - Wait for "Success" message

3. **Create Admin User:**
   - In SQL Editor, run:
   ```sql
   INSERT INTO admin_users (username, email, password_hash, is_active)
   VALUES (
     'admin',
     'admin@adriaticbayexotics.com',
     crypt('admin123', gen_salt('bf')),
     true
   );
   ```
   - ⚠️ Username: `admin`, Password: `admin123`
   - **Change this password in production!**

## Step 4: Configure Formspree (1 minute)

1. **Create Formspree Account:**
   - Sign up at [formspree.io](https://formspree.io/)
   - Create a new form called "Spin Wheel Leads"
   - Copy your Form ID (looks like: `xvgopqrs`)

2. **Update Code:**
   - Open `components/SpinWheelPopup.tsx`
   - Find line 41
   - Replace `YOUR_FORMSPREE_ID` with your actual ID:
   ```typescript
   const [formspreeState, sendToFormspree] = useFormspree("xvgopqrs");
   ```

## Step 5: Launch! (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Quick Test Checklist

- [ ] Homepage loads successfully
- [ ] Fleet page works: [http://localhost:3000/fleet](http://localhost:3000/fleet)
- [ ] Admin login works: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
  - Username: `admin`
  - Password: `admin123`
- [ ] Spin wheel popup appears after 3 seconds
- [ ] Can view individual car pages

## Common Issues

### "Missing environment variables"
→ Make sure you created `.env.local` and filled in all REQUIRED variables

### "Cannot connect to database"
→ Double-check Supabase URL and keys are correct

### "Admin login fails"
→ Make sure you ran the admin user SQL query in Supabase

### "Port 3000 already in use"
→ Run: `npx kill-port 3000` then try again

## What's Next?

1. **Customize Your Fleet:**
   - Edit `lib/cars-data.ts` to add your vehicles
   - Replace images in `/public/car-images/`

2. **Update Contact Info:**
   - Edit `components/Footer.tsx`
   - Update phone, email, address

3. **Test Payments:**
   - Use Square test cards:
   - Success: `4111 1111 1111 1111`
   - CVV: `123`, Expiry: Any future date

4. **Deploy:**
   - Push to GitHub
   - Deploy to [Vercel](https://vercel.com/)
   - Add environment variables in Vercel dashboard

## Need Help?

Check the full **README.md** for detailed documentation!

---

**You're all set! 🚀 Happy renting!**
