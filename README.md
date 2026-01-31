# 🏎️ Adriatic Bay Exotics - Luxury Car Rental Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase)](https://supabase.com/)

**Adriatic Bay Exotics** is a premium, full-stack luxury car rental platform built with modern web technologies. The platform features a stunning dark-themed landing page, dynamic fleet management, comprehensive admin dashboard, payment processing, email automation, and marketing tools for lead generation.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Database Setup](#-database-setup)
- [Schema Alignment](#-schema-alignment) ⭐ **NEW**
- [Running the Project](#-running-the-project)
- [Admin Access](#-admin-access)
- [Key Features Guide](#-key-features-guide)
- [API Routes](#-api-routes)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🎨 **Public Website**
- **Landing Page**: Modern, animated hero section with smooth scroll effects
- **Fleet Showcase**: Dynamic vehicle listings with filtering by category (Exotic, Luxury, Sports)
- **Individual Car Pages**: Detailed vehicle information with image galleries, specifications, pricing, and features
- **About Section**: Company story with statistics and mission
- **Testimonials**: Customer reviews and ratings
- **Responsive Design**: Mobile-first, optimized for all screen sizes
- **Dark Premium Theme**: Sophisticated design with cyan/blue accents

### 🎯 **Marketing & Lead Generation**
- **Spin Wheel Popup**: Gamified lead capture with prizes (10% discount, extra hours, free delivery, gas bypass)
  - Appears 3 seconds after first visit
  - Reappears every 90 seconds of active time
  - Formspree integration for lead capture
- **Valentine's Promotion**: Seasonal popup (Jan 25 - Feb 20) with heart animations
  - "Buy 2 Days, Get 1 Free" offer
  - Featured vehicles showcase
- **Smart Triggers**: Time-based, session-based, and activity-based popup triggers
- **Anti-Spam Protection**: LocalStorage tracking to prevent popup overload

### 🔐 **Admin Dashboard**
Complete admin panel for managing the business:
- **Dashboard Overview**: Real-time statistics and metrics
- **Booking Management**: View, confirm, modify, cancel bookings
- **Fleet Management**: Add, edit, delete vehicles with full specifications
- **Customer Management**: Customer database with booking history
- **Promo Codes**: Create and manage promotional discount codes
- **Settings**: System configuration and business settings
- **Secure Authentication**: JWT-based session management with bcrypt password hashing

### 💳 **Payment Processing**
- **Square Integration**: Secure payment processing
- **Security Deposits**: Automated deposit collection
- **Payment Webhooks**: Real-time payment status updates
- **Refund Management**: Handle cancellations and refunds

### 📧 **Email Automation**
Powered by Resend with React Email templates:
- **Booking Confirmations**: Instant confirmation emails
- **Payment Receipts**: Detailed payment information
- **Reminders**: Automated rental reminders (24 hours before)
- **Cancellation Notices**: Professional cancellation emails
- **Owner Notifications**: Alert owners of new bookings

### 🔄 **Workflow Automation**
Inngest-powered background jobs:
- **Reminder Scheduling**: Automated reminder emails
- **Booking Status Updates**: State machine for booking lifecycle
- **Payment Processing**: Async payment workflows

### 🚗 **Fleet Features**
Current fleet includes:
- **Corvette C8-R**: $419/day
- **McLaren 570S**: $1,199/day
- **Lamborghini Huracan**: $1,049/day
- **Maserati Levante**: $199/day
- **Lamborghini Urus**: $1,049/day
- **McLaren 650S**: $1,399/day

Each vehicle includes:
- Multiple high-quality images
- Detailed specifications (engine, horsepower, 0-60, top speed)
- Exterior/interior color options
- Full feature lists
- Rental terms and requirements
- Security deposit information

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icons
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management
- **Zod 4.3.6** - Schema validation

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time capabilities
- **Square API** - Payment processing
- **Resend** - Transactional email service
- **Inngest** - Background job processing
- **Jose** - JWT token management
- **bcryptjs** - Password hashing

### **Integrations**
- **Formspree** - Form submissions and lead capture
- **Vercel KV** - Rate limiting and caching
- **Canvas Confetti** - Celebration animations

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Next.js Dev Server** - Hot reload development

---

## 📁 Project Structure

```
adriaticbayexotics/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── admin/                    # Admin dashboard
│   │   ├── bookings/            # Booking management
│   │   ├── cars/                # Fleet management
│   │   ├── customers/           # Customer database
│   │   ├── promo-codes/         # Promo code management
│   │   ├── settings/            # System settings
│   │   └── login/               # Admin login
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin API endpoints
│   │   ├── bookings/            # Booking operations
│   │   ├── payments/            # Payment processing
│   │   ├── marketing/           # Marketing campaigns
│   │   └── webhooks/            # External webhooks (Square)
│   ├── auth/                    # Authentication
│   │   └── signout/             # Sign out route
│   ├── checkout/                # Checkout pages
│   │   ├── [slug]/              # Vehicle checkout
│   │   └── success/             # Success page
│   ├── fleet/                   # Fleet pages
│   │   ├── [slug]/              # Individual car details
│   │   └── page.tsx             # Fleet listing
│   ├── globals.css              # Global styles & animations
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
│
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   ├── payments/                # Payment UI components
│   ├── ui/                      # shadcn/ui components
│   ├── AboutSection.tsx         # Company info section
│   ├── BrandLogos.tsx           # Luxury brand showcase
│   ├── CarDetailClient.tsx      # Car detail page
│   ├── CarListings.tsx          # Fleet grid
│   ├── CTASection.tsx           # Call-to-action banner
│   ├── FeaturesSection.tsx      # Key benefits
│   ├── Footer.tsx               # Site footer
│   ├── Hero.tsx                 # Hero section
│   ├── MarketingBanner.tsx      # Marketing banner
│   ├── MarketingHooks.tsx       # Marketing popup manager
│   ├── Navigation.tsx           # Navigation bar
│   ├── SpinWheelPopup.tsx       # Spin wheel lead capture
│   ├── Testimonials.tsx         # Customer reviews
│   ├── ValentinesPopup.tsx      # Valentine's promotion
│   └── TestMarketingPopups.tsx  # Testing utilities
│
├── lib/                         # Core libraries
│   ├── constants/               # App constants
│   ├── inngest/                 # Background jobs
│   ├── payments/                # Payment utilities
│   ├── square/                  # Square integration
│   ├── supabase/                # Database clients
│   ├── validation/              # Schema validators
│   ├── auth.ts                  # Authentication logic
│   ├── cars-data.ts             # Fleet data
│   ├── env.ts                   # Environment validation
│   ├── rate-limit.ts            # Rate limiting
│   ├── resend.ts                # Email client
│   └── utils.ts                 # Utility functions
│
├── emails/                      # Email templates (React Email)
│   ├── BaseLayout.tsx           # Email base layout
│   ├── BookingConfirmation.tsx  # Booking confirmation
│   ├── Cancellation.tsx         # Cancellation notice
│   ├── OwnerNotification.tsx    # Owner alerts
│   ├── PaymentReceipt.tsx       # Payment receipt
│   └── Reminder.tsx             # Rental reminders
│
├── supabase/                    # Database
│   ├── migrations/              # Database migrations
│   ├── full_setup.sql           # Complete schema setup
│   ├── module_4_setup.sql       # Partial setup
│   └── seed.sql                 # Sample data
│
├── scripts/                     # Utility scripts
│   ├── check_schema.js          # Validate database schema
│   └── hash-password.js         # Generate password hashes
│
├── public/                      # Static assets
│   ├── car-images/              # Vehicle photos
│   └── logos/                   # Brand logos
│
├── middleware.ts                # Next.js middleware (auth)
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
│
└── Documentation
    ├── README.md                # This file
    ├── PROJECT_OVERVIEW.md      # Design overview
    ├── FLEET_PAGES_SUMMARY.md   # Fleet feature summary
    ├── MARKETING_HOOKS_SETUP.md # Marketing setup guide
    └── TESTING_GUIDE.md         # Testing instructions
```

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** or **pnpm** - Package manager
- **Git** - Version control
- **A code editor** - VS Code recommended

You'll also need accounts for:
- **Supabase** - Database ([Sign up](https://supabase.com/))
- **Square** - Payment processing ([Sign up](https://squareup.com/))
- **Resend** - Email service ([Sign up](https://resend.com/))
- **Formspree** - Lead capture ([Sign up](https://formspree.io/))
- **Inngest** (Optional) - Background jobs ([Sign up](https://www.inngest.com/))
- **Vercel KV** (Optional) - Rate limiting ([Sign up](https://vercel.com/))

---

## 📥 Installation

### 1. **Clone the Repository**

```bash
git clone <your-repo-url>
cd adriaticbayexotics
```

### 2. **Install Dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

This will install all required packages including Next.js, React, TypeScript, Tailwind CSS, and all integrations.

---

## 🔑 Environment Setup

### 1. **Create Environment File**

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

### 2. **Add Environment Variables**

Copy and paste the following into `.env.local` and fill in your actual values:

```env
# ==========================================
# SUPABASE (Required)
# ==========================================
# Get these from: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ==========================================
# SQUARE PAYMENT (Required)
# ==========================================
# Get these from: https://developer.squareup.com/apps
SQUARE_ACCESS_TOKEN=your-square-access-token
SQUARE_ENVIRONMENT=sandbox  # Use "production" for live
SQUARE_LOCATION_ID=your-location-id
SQUARE_WEBHOOK_SIGNATURE_KEY=your-webhook-signature-key
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your-app-id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your-location-id
NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox

# ==========================================
# AUTHENTICATION (Required)
# ==========================================
# Generate a secure random string (at least 32 characters)
# You can use: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# ==========================================
# EMAIL SERVICE (Required)
# ==========================================
# Get from: https://resend.com/api-keys
RESEND_API_KEY=re_your_resend_api_key

# ==========================================
# INNGEST (Optional - for background jobs)
# ==========================================
# Get from: https://www.inngest.com/
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key

# ==========================================
# RATE LIMITING (Optional)
# ==========================================
# Get from: https://vercel.com/dashboard/stores
KV_URL=your-vercel-kv-url
KV_REST_API_URL=your-kv-rest-api-url
KV_REST_API_TOKEN=your-kv-token
KV_REST_API_READ_ONLY_TOKEN=your-kv-readonly-token
```

### 3. **How to Get Each API Key**

#### **Supabase**
1. Go to [supabase.com](https://supabase.com/) and create an account
2. Create a new project
3. Go to Settings → API
4. Copy `URL` to `NEXT_PUBLIC_SUPABASE_URL`
5. Copy `anon public` key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Copy `service_role` key to `SUPABASE_SERVICE_ROLE_KEY`

#### **Square**
1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create a new application
3. For testing, use **Sandbox** credentials
4. Go to Credentials → Sandbox
5. Copy Access Token, Application ID, and Location ID
6. For webhooks, go to Webhooks → Create Subscription
7. Copy the Signature Key

#### **Resend**
1. Sign up at [resend.com](https://resend.com/)
2. Go to API Keys
3. Create a new API key
4. Copy the key to `RESEND_API_KEY`

#### **JWT Secret**
Generate a secure random string:
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use an online generator:
# https://generate-secret.vercel.app/32
```

#### **Formspree**
1. Sign up at [formspree.io](https://formspree.io/)
2. Create a new form called "Spin Wheel Leads"
3. Copy the Form ID (e.g., `xvgopqrs`)
4. Open `components/SpinWheelPopup.tsx`
5. Update line 41 with your Form ID:
   ```typescript
   const [formspreeState, sendToFormspree] = useFormspree("xvgopqrs");
   ```

---

## 🗄️ Database Setup

### 1. **Run the Full Setup Script**

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/full_setup.sql`
5. Paste and click **Run**

This will create:
- All tables (cars, bookings, customers, admin_users, promo_codes, payments, etc.)
- Enums for status types
- Indexes for performance
- Row Level Security (RLS) policies
- Database functions

### 2. **Create Admin User**

You need to create an admin user to access the admin dashboard:

#### **Option 1: Using the hash-password script**

```bash
# Generate a password hash
node scripts/hash-password.js yourpassword
```

Copy the hash, then run this SQL in Supabase SQL Editor:

```sql
INSERT INTO admin_users (username, email, password_hash, is_active)
VALUES (
  'admin',
  'admin@adriaticbayexotics.com',
  'YOUR_GENERATED_HASH_HERE',
  true
);
```

#### **Option 2: Direct SQL (simpler)**

```sql
-- This will hash the password "admin123" automatically
INSERT INTO admin_users (username, email, password_hash, is_active)
VALUES (
  'admin',
  'admin@adriaticbayexotics.com',
  crypt('admin123', gen_salt('bf')),
  true
);
```

**⚠️ Important:** Change this password immediately in production!

### 3. **Seed Sample Data (Optional)**

To add sample fleet data for testing:

```sql
-- Run the seed script
-- Copy contents from supabase/seed.sql and run in SQL Editor
```

---

## 🔄 Schema Alignment

**⭐ IMPORTANT**: The database schema has been fully aligned with admin forms and frontend displays!

### Quick Update (Required)

After running `full_setup.sql`, also run the schema alignment update:

1. Open Supabase SQL Editor
2. Run the contents of `supabase/schema_update.sql`
3. This adds missing columns and fixes field names

This ensures:
- ✅ Admin forms can capture ALL data for frontend display
- ✅ Database field names match form fields perfectly
- ✅ Cars include: category, slug, descriptions, colors, all pricing tiers, specs
- ✅ Promo codes include: description, dates, campaign tracking, status

### New Form Capabilities

**Cars Form (19 fields)**:
- Complete pricing (daily, 4-hour, weekly, monthly, deposit)
- Vehicle details (category, slug, description)
- Colors (exterior, interior)
- Full specifications (engine, HP, 0-60, top speed, transmission, drivetrain)
- Multiple images with preview
- Features list

**Promo Codes Form (10 fields)**:
- Description and campaign source
- Start & end dates
- Usage limits and tracking
- Minimum booking amount
- Status control

### Documentation

For complete details, see:
- **`QUICK_FIX_GUIDE.md`** - 5-minute setup guide ⚡
- **`ALIGNMENT_SUMMARY.md`** - What changed and why
- **`SCHEMA_ALIGNMENT.md`** - Complete technical documentation
- **`BEFORE_AFTER_COMPARISON.md`** - Visual before/after comparison

---

## 🚀 Running the Project

### **Development Mode**

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### **Build for Production**

```bash
npm run build
```

### **Start Production Server**

```bash
npm run build
npm start
```

### **Linting**

```bash
npm run lint
```

---

## 🔐 Admin Access

### **Access the Admin Dashboard**

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Use the credentials you created:
   - **Username**: `admin`
   - **Password**: `admin123` (or whatever you set)
3. You'll be redirected to the admin dashboard

### **Admin Features**

- **Dashboard** (`/admin`) - Overview with statistics
- **Bookings** (`/admin/bookings`) - Manage all reservations
- **Fleet** (`/admin/cars`) - Add, edit, delete vehicles
- **Customers** (`/admin/customers`) - Customer database
- **Promo Codes** (`/admin/promo-codes`) - Discount management
- **Settings** (`/admin/settings`) - System configuration

### **Session Duration**

Admin sessions last **4 hours** and are automatically refreshed during activity.

---

## 🎯 Key Features Guide

### **Marketing Popups**

#### **Spin Wheel**
- Appears 3 seconds after first visit
- Captures name and phone number
- Sends leads to Formspree
- Reappears after 90 seconds of activity (max once per 5 minutes)
- 12 prize segments with different probabilities

#### **Valentine's Promotion**
- Active from January 25 to February 20
- Shows once per session
- Features C8 Corvette, McLaren 570S, Maserati Levante
- "Buy 2 Days, Get 1 Free" offer

#### **Testing Marketing Features**
See `TESTING_GUIDE.md` for detailed testing instructions.

### **Fleet Management**

#### **View All Vehicles**
- Navigate to `/fleet`
- Filter by category: All, Exotic, Luxury, Sports
- Click any car to see details

#### **Individual Car Pages**
- URL: `/fleet/[car-slug]` (e.g., `/fleet/corvette-c8-r`)
- Image gallery with thumbnails
- Full specifications
- Pricing breakdown
- Rental requirements
- Related vehicle suggestions

### **Booking Flow**

1. Customer selects a vehicle
2. Clicks "Book Now"
3. Fills in booking details (dates, contact info)
4. Reviews booking summary
5. Pays security deposit via Square
6. Receives confirmation email
7. Gets reminder 24 hours before pickup

### **Email Notifications**

All emails use beautiful React Email templates:
- **Booking Confirmation** - Sent immediately after booking
- **Payment Receipt** - Sent after payment is processed
- **Reminder** - Sent 24 hours before rental
- **Cancellation** - Sent when booking is cancelled
- **Owner Notification** - Sent to business owner for new bookings

---

## 🔌 API Routes

### **Public API**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bookings/availability` | POST | Check car availability |
| `/api/bookings/create` | POST | Create new booking |
| `/api/bookings/cancel` | POST | Cancel booking |
| `/api/bookings/modify` | PATCH | Modify booking |
| `/api/payments/create-deposit` | POST | Process security deposit |
| `/api/marketing/spin` | POST | Submit spin wheel entry |
| `/api/marketing/promo/validate` | POST | Validate promo code |
| `/api/marketing/campaigns/active` | GET | Get active campaigns |

### **Admin API** (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Admin authentication |
| `/api/admin/logout` | POST | Admin logout |
| `/api/admin/bookings` | GET/POST | Manage bookings |
| `/api/admin/bookings/[id]/status` | PATCH | Update booking status |
| `/api/admin/cars` | GET/POST | Manage fleet |
| `/api/admin/cars/[id]` | GET/PUT/DELETE | Individual car operations |
| `/api/admin/promo-codes` | GET/POST | Manage promo codes |
| `/api/admin/promo-codes/[id]` | PUT/DELETE | Individual promo operations |

### **Webhooks**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/square` | POST | Square payment webhooks |
| `/api/inngest` | POST/GET | Inngest workflow events |

---

## 🌐 Deployment

### **Vercel (Recommended)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js
   - Add all environment variables from `.env.local`
   - Click "Deploy"

3. **Configure Square Webhooks**
   - In Square Dashboard, update webhook URL to: `https://your-domain.com/api/webhooks/square`

4. **Configure Inngest** (if using)
   - Update Inngest app URL to your Vercel domain

### **Other Platforms**

The app can be deployed to any platform that supports Next.js:
- **Netlify** - [Guide](https://docs.netlify.com/frameworks/next-js/)
- **AWS Amplify** - [Guide](https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html)
- **DigitalOcean** - [Guide](https://docs.digitalocean.com/products/app-platform/how-to/deploy-next-js-app/)
- **Self-hosted** - Use `npm run build && npm start`

---

## 🧪 Testing

### **Test Marketing Popups**

See `TESTING_GUIDE.md` for comprehensive testing instructions.

Quick test:
```typescript
// In app/layout.tsx, add temporarily:
import TestMarketingPopups from "@/components/TestMarketingPopups";

// Add in body:
<TestMarketingPopups />
```

**⚠️ Remove before production!**

### **Test Payments (Sandbox)**

Use Square's test card numbers:
- **Success**: `4111 1111 1111 1111`
- **Decline**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **ZIP**: Any 5 digits

### **Test Admin Dashboard**

1. Log in with admin credentials
2. Create a test booking
3. Update booking status
4. Add a test vehicle
5. Create a promo code
6. Test all CRUD operations

---

## 🎨 Customization

### **Change Brand Colors**

Edit `app/globals.css` and component files:
- Primary: `cyan-500` → Your color
- Secondary: `cyan-400` → Your color
- Background: `zinc-950` → Your color

### **Update Fleet Data**

Edit `lib/cars-data.ts`:
```typescript
export const carsData = [
  {
    id: "your-car-id",
    name: "Your Car Name",
    slug: "your-car-slug",
    // ... add all fields
  }
];
```

### **Modify Pricing**

Update prices in `lib/cars-data.ts` for each vehicle.

### **Change Contact Information**

Update in `components/Footer.tsx`:
```typescript
const contactInfo = {
  phone: "Your phone",
  email: "Your email",
  address: "Your address"
};
```

### **Customize Email Templates**

Edit files in `/emails` directory using React Email components.

### **Adjust Marketing Timing**

Edit `components/MarketingHooks.tsx`:
```typescript
// Initial delay (line 50)
setTimeout(() => setShowSpinWheel(true), 3000); // Change 3000

// Reappear interval (line 64)
if (activeTime % 90 === 0) { // Change 90
```

---

## 🐛 Troubleshooting

### **"Missing environment variables" error**

**Solution:** Ensure `.env.local` is created with all required variables. The app validates these on startup.

### **Database connection error**

**Solution:** 
- Verify Supabase URL and keys are correct
- Check if Supabase project is active
- Ensure database schema is set up (run `full_setup.sql`)

### **Admin login fails**

**Solution:**
- Verify admin user exists in `admin_users` table
- Check password hash was generated correctly
- Ensure JWT_SECRET is set and at least 32 characters

### **Payments not working**

**Solution:**
- Verify Square credentials are correct
- Check you're using the right environment (sandbox vs production)
- Ensure webhook signature key matches

### **Emails not sending**

**Solution:**
- Verify Resend API key is valid
- Check sender email is verified in Resend
- Look for errors in Resend dashboard

### **Marketing popups not showing**

**Solution:**
- Clear browser localStorage and sessionStorage
- Check browser console for errors
- Verify Formspree ID is set in `SpinWheelPopup.tsx`
- For Valentine's popup, check date range or uncomment test line

### **Build errors**

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### **Port 3000 already in use**

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

---

## 📚 Additional Documentation

- **`PROJECT_OVERVIEW.md`** - Detailed design and component overview
- **`FLEET_PAGES_SUMMARY.md`** - Fleet feature implementation details
- **`MARKETING_HOOKS_SETUP.md`** - Complete marketing setup guide
- **`TESTING_GUIDE.md`** - Comprehensive testing instructions

---

## 🤝 Support & Contact

For issues, questions, or custom development:
- **Email**: support@adriaticbayexotics.com
- **Phone**: (813) 518-3600

---

## 📝 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Square](https://squareup.com/)
- [Resend](https://resend.com/)

---

## 🚀 Quick Start Checklist

- [ ] Node.js installed (v18+)
- [ ] Cloned repository
- [ ] `npm install` completed
- [ ] `.env.local` created with all variables
- [ ] Supabase project created
- [ ] Database schema setup (`full_setup.sql` run)
- [ ] Admin user created
- [ ] Square account configured (sandbox for testing)
- [ ] Resend API key obtained
- [ ] Formspree form created and ID updated
- [ ] `npm run dev` running successfully
- [ ] Accessed homepage at [http://localhost:3000](http://localhost:3000)
- [ ] Logged into admin at [http://localhost:3000/admin](http://localhost:3000/admin)

---

**🎉 You're all set! Start building your luxury car rental empire!**

For detailed setup instructions, see the sections above or refer to the additional documentation files.
