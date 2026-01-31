# ✅ Setup Checklist for Adriatic Bay Exotics

Use this checklist to ensure everything is configured correctly.

## 📦 Part 1: Local Environment Setup

### 1.1 Prerequisites
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm/yarn/pnpm installed
- [ ] Git installed
- [ ] Code editor ready (VS Code recommended)

### 1.2 Project Setup
- [ ] Repository cloned
- [ ] Navigated to project directory
- [ ] Dependencies installed (`npm install`)

### 1.3 Environment Variables
- [ ] Created `.env.local` file (copy from `.env.example`)
- [ ] All REQUIRED variables filled in:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SQUARE_ACCESS_TOKEN`
  - [ ] `SQUARE_ENVIRONMENT`
  - [ ] `SQUARE_LOCATION_ID`
  - [ ] `SQUARE_WEBHOOK_SIGNATURE_KEY`
  - [ ] `NEXT_PUBLIC_SQUARE_APPLICATION_ID`
  - [ ] `NEXT_PUBLIC_SQUARE_LOCATION_ID`
  - [ ] `NEXT_PUBLIC_SQUARE_ENVIRONMENT`
  - [ ] `JWT_SECRET` (at least 32 characters)
  - [ ] `RESEND_API_KEY`

## 🔐 Part 2: External Service Accounts

### 2.1 Supabase
- [ ] Account created at [supabase.com](https://supabase.com/)
- [ ] New project created
- [ ] Project name: _________________
- [ ] Database password saved securely
- [ ] API keys copied to `.env.local`

### 2.2 Square (Payment Processing)
- [ ] Account created at [squareup.com/developers](https://developer.squareup.com/)
- [ ] Application created
- [ ] Using Sandbox environment for testing
- [ ] Access token copied
- [ ] Application ID copied
- [ ] Location ID copied

### 2.3 Resend (Email Service)
- [ ] Account created at [resend.com](https://resend.com/)
- [ ] API key generated
- [ ] API key copied to `.env.local`
- [ ] Sender email verified (for production)

### 2.4 Formspree (Lead Capture)
- [ ] Account created at [formspree.io](https://formspree.io/)
- [ ] Form created (name: "Spin Wheel Leads")
- [ ] Form ID copied: _________________
- [ ] Form ID updated in `components/SpinWheelPopup.tsx` (line 41)

### 2.5 Optional Services
- [ ] Inngest account (for background jobs)
- [ ] Vercel KV (for rate limiting)

## 🗄️ Part 3: Database Setup

### 3.1 Schema Setup
- [ ] Opened Supabase SQL Editor
- [ ] Copied contents of `supabase/full_setup.sql`
- [ ] Pasted and ran in SQL Editor
- [ ] Received "Success" confirmation
- [ ] Verified tables created (check Table Editor)

### 3.2 Admin User Creation
- [ ] Ran admin user creation SQL:
```sql
INSERT INTO admin_users (username, email, password_hash, is_active)
VALUES (
  'admin',
  'admin@adriaticbayexotics.com',
  crypt('admin123', gen_salt('bf')),
  true
);
```
- [ ] Success message received
- [ ] Username saved: `admin`
- [ ] Password saved: `admin123`
- [ ] **NOTE: Change password in production!**

### 3.3 Optional: Sample Data
- [ ] Decided whether to use sample data
- [ ] If yes: Ran `supabase/seed.sql`

## 🚀 Part 4: Launch & Testing

### 4.1 Development Server
- [ ] Ran `npm run dev`
- [ ] No errors in terminal
- [ ] Server started successfully
- [ ] Port 3000 is available

### 4.2 Homepage Testing
- [ ] Opened [http://localhost:3000](http://localhost:3000)
- [ ] Homepage loads without errors
- [ ] Navigation bar appears
- [ ] Hero section displays
- [ ] Fleet section shows cars
- [ ] Footer displays correctly
- [ ] No console errors in browser

### 4.3 Fleet Pages Testing
- [ ] Opened [http://localhost:3000/fleet](http://localhost:3000/fleet)
- [ ] All vehicles display
- [ ] Filter buttons work (All, Exotic, Luxury, Sports)
- [ ] Clicked on a vehicle
- [ ] Individual car page loads
- [ ] Image gallery works
- [ ] Specifications display
- [ ] "Book Now" button present

### 4.4 Admin Dashboard Testing
- [ ] Opened [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- [ ] Login page displays
- [ ] Entered credentials:
  - Username: `admin`
  - Password: `admin123`
- [ ] Successfully logged in
- [ ] Dashboard displays
- [ ] Checked each admin section:
  - [ ] Dashboard (statistics)
  - [ ] Bookings
  - [ ] Cars (Fleet Management)
  - [ ] Customers
  - [ ] Promo Codes
  - [ ] Settings

### 4.5 Marketing Popups Testing
- [ ] Opened homepage in incognito/private window
- [ ] Spin wheel popup appears after 3 seconds
- [ ] Filled in test name and phone
- [ ] Clicked "Continue to Spin"
- [ ] Wheel spins and lands on prize
- [ ] Result displays correctly
- [ ] Closed popup
- [ ] Stayed active for 90+ seconds
- [ ] Spin wheel reappears

### 4.6 Valentine's Popup Testing (Seasonal)
- [ ] If testing during Jan 25 - Feb 20:
  - [ ] Valentine's popup appears
  - [ ] Heart animations work
  - [ ] Featured cars display
- [ ] If testing outside season:
  - [ ] Opened `components/MarketingHooks.tsx`
  - [ ] Uncommented line 21: `return true;`
  - [ ] Refreshed page
  - [ ] Valentine's popup appears
  - [ ] **Commented line 21 back after testing**

### 4.7 Formspree Integration Testing
- [ ] Submitted spin wheel form
- [ ] Opened Formspree dashboard
- [ ] Verified submission appears
- [ ] Checked all fields are captured:
  - [ ] Full Name
  - [ ] Phone Number
  - [ ] Timestamp

## 🎨 Part 5: Customization (Optional)

### 5.1 Fleet Data
- [ ] Opened `lib/cars-data.ts`
- [ ] Reviewed vehicle data structure
- [ ] Updated vehicle information (if needed)
- [ ] Added new vehicles (if needed)
- [ ] Replaced car images in `/public/car-images/`

### 5.2 Contact Information
- [ ] Opened `components/Footer.tsx`
- [ ] Updated phone number
- [ ] Updated email address
- [ ] Updated physical address
- [ ] Updated business hours

### 5.3 Brand Colors (Optional)
- [ ] Reviewed current color scheme (cyan/blue)
- [ ] If changing colors:
  - [ ] Updated `app/globals.css`
  - [ ] Updated Tailwind classes in components
  - [ ] Tested color contrast for accessibility

## 🌐 Part 6: Production Deployment (When Ready)

### 6.1 Pre-Deployment
- [ ] Removed `<TestMarketingPopups />` from `app/layout.tsx`
- [ ] Tested entire application thoroughly
- [ ] Changed default admin password
- [ ] Replaced all sample data with real data
- [ ] Replaced stock images with real photos
- [ ] Updated all contact information
- [ ] Reviewed all pricing
- [ ] Tested on multiple devices and browsers

### 6.2 Git & GitHub
- [ ] Created GitHub repository
- [ ] Added `.gitignore` (already present)
- [ ] Committed all code
- [ ] Pushed to GitHub

### 6.3 Vercel Deployment
- [ ] Signed up at [vercel.com](https://vercel.com/)
- [ ] Connected GitHub account
- [ ] Imported repository
- [ ] Added all environment variables
- [ ] Changed `SQUARE_ENVIRONMENT` to `production`
- [ ] Used production Square credentials
- [ ] Deployed successfully
- [ ] Tested production site

### 6.4 Post-Deployment
- [ ] Updated Square webhook URL to production domain
- [ ] Updated Inngest app URL (if using)
- [ ] Verified email sending works
- [ ] Tested payment processing
- [ ] Tested booking flow end-to-end
- [ ] Set up domain name (if custom)
- [ ] Enabled SSL certificate
- [ ] Tested on mobile devices
- [ ] Set up monitoring/analytics (optional)

## 📝 Part 7: Documentation Review

- [ ] Read `README.md` completely
- [ ] Reviewed `QUICK_START.md`
- [ ] Read `PROJECT_OVERVIEW.md`
- [ ] Reviewed `FLEET_PAGES_SUMMARY.md`
- [ ] Read `MARKETING_HOOKS_SETUP.md`
- [ ] Reviewed `TESTING_GUIDE.md`

## 🎯 Part 8: Final Verification

### 8.1 Critical Features Working
- [ ] Homepage loads in < 3 seconds
- [ ] All navigation links work
- [ ] Fleet filtering works correctly
- [ ] Individual car pages load
- [ ] Admin login works
- [ ] Admin can create/edit/delete:
  - [ ] Bookings
  - [ ] Cars
  - [ ] Promo codes
- [ ] Spin wheel captures leads
- [ ] Formspree receives submissions
- [ ] Emails send successfully (test booking)
- [ ] Payments process (test mode)

### 8.2 Mobile Responsiveness
- [ ] Tested on phone (iPhone/Android)
- [ ] Tested on tablet (iPad/Android tablet)
- [ ] Hamburger menu works on mobile
- [ ] All text is readable
- [ ] Buttons are touchable
- [ ] Forms work on mobile
- [ ] Popups display correctly

### 8.3 Browser Compatibility
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested in Edge
- [ ] No console errors in any browser

### 8.4 Performance
- [ ] Images load quickly
- [ ] No layout shifts (CLS)
- [ ] Smooth animations
- [ ] Forms submit instantly
- [ ] No memory leaks

## 🏁 Completion

- [ ] All items above checked
- [ ] No critical errors
- [ ] Ready for launch or production use
- [ ] Team trained on admin dashboard
- [ ] Support process established
- [ ] Backup plan in place

---

## 📞 Need Help?

If you're stuck on any step:

1. Check the detailed `README.md`
2. Review the specific guide for that feature
3. Check browser console for error messages
4. Verify environment variables are correct
5. Ensure database schema is set up

## 🎉 Congratulations!

Once all items are checked, you're ready to launch your luxury car rental platform!

---

**Last Updated:** January 2026
**Version:** 1.0
