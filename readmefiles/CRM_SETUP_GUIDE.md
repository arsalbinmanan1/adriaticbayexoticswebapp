# 🎯 CRM Integration Setup Guide

## ✅ What's Been Implemented

Your marketing forms and contact form now save **directly to your database** instead of using Formspree!

---

## 📊 **Database Changes**

### **Marketing Leads Table Updated**

The `marketing_leads` table now includes:
- ✅ `email` column (for contact form submissions)
- ✅ `meta` JSONB column (for storing messages and additional data)
- ✅ Indexes for faster queries

**Run this SQL in Supabase:**

```sql
-- Copy/paste: supabase/update_marketing_leads.sql
```

Or manually run:

```sql
ALTER TABLE marketing_leads
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_marketing_leads_source ON marketing_leads(source);
CREATE INDEX IF NOT EXISTS idx_marketing_leads_email ON marketing_leads(email);
CREATE INDEX IF NOT EXISTS idx_marketing_leads_created_at ON marketing_leads(created_at DESC);
```

---

## 🎨 **New Features**

### **1. Contact Form Component** ✨

**Location:** `components/ContactForm.tsx`

**Features:**
- ✅ Full Name, Email, Phone, Message fields
- ✅ Form validation with React Hook Form
- ✅ Beautiful UI with loading states
- ✅ Success/error notifications with SweetAlert2
- ✅ Saves directly to `marketing_leads` table

**Usage:**
```tsx
import ContactForm from "@/components/ContactForm";

<ContactForm />
```

---

### **2. Contact Page** 📞

**Location:** `app/contact/page.tsx`

**Features:**
- ✅ Beautiful hero section
- ✅ Contact information display (CEOs, email, hours, location)
- ✅ Integrated contact form
- ✅ Fully responsive design

**Access:** `http://localhost:3000/contact`

---

### **3. Contact API Route** 🔌

**Location:** `app/api/marketing/contact/route.ts`

**What it does:**
- ✅ Receives form submissions
- ✅ Validates required fields
- ✅ Saves to `marketing_leads` table with:
  - `full_name`
  - `email`
  - `phone_number`
  - `source: 'contact_form'`
  - `meta: { message, submitted_at }`

**Endpoint:** `POST /api/marketing/contact`

---

### **4. Enhanced Admin Customers Page** 👥

**Location:** `app/admin/customers/page.tsx`

**New Features:**
- ✅ Shows **both** booking customers AND marketing leads
- ✅ Source badges:
  - 🟢 **Booking** - From actual bookings
  - 🟡 **Spin Wheel** - From spin wheel popup
  - 🔵 **Contact Form** - From contact form
- ✅ "View Message" button for contact form submissions
- ✅ Statistics badges showing total bookings and leads
- ✅ Deduplicated by email

**Access:** `http://localhost:3000/admin/customers`

---

## 🔄 **Data Flow**

### **Spin Wheel Popup**
```
User fills form → /api/marketing/spin → marketing_leads table
                                      ↓
                              source: 'spin_wheel'
```

### **Contact Form**
```
User fills form → /api/marketing/contact → marketing_leads table
                                         ↓
                                 source: 'contact_form'
                                 meta: { message }
```

### **Bookings**
```
User completes booking → bookings table
                       ↓
              Shows in Customers page
              source: 'booking'
```

---

## 📋 **Setup Steps**

### **Step 1: Update Database Schema**

Run the SQL migration in Supabase:

```bash
# In Supabase SQL Editor, run:
supabase/update_marketing_leads.sql
```

### **Step 2: Test Contact Form**

1. Go to: `http://localhost:3000/contact`
2. Fill out the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: +1 (555) 123-4567
   - Message: Test message
3. Click "Send Message"
4. You should see a success notification ✅

### **Step 3: Verify in Admin Panel**

1. Go to: `http://localhost:3000/admin/customers`
2. You should see:
   - Your test contact form submission with a **blue "Contact Form" badge**
   - A "View Message" button to see the message
   - Statistics showing "X Bookings" and "X Leads"

### **Step 4: Test Spin Wheel**

1. Go to homepage: `http://localhost:3000`
2. Wait for spin wheel popup (or use test buttons)
3. Fill in name and phone
4. Spin the wheel
5. Check admin panel - should show with **yellow "Spin Wheel" badge**

---

## 🎯 **Admin Panel Features**

### **Customer/Lead Sources**

| Badge | Source | Description |
|-------|--------|-------------|
| 🟢 **Booking** | `booking` | Customers who completed a booking |
| 🟡 **Spin Wheel** | `spin_wheel` | Leads from spin wheel popup |
| 🔵 **Contact Form** | `contact_form` | Inquiries from contact form |

### **Actions Available**

- **Booking customers**: "View Bookings" button → filters bookings by email
- **Contact form leads**: "View Message" button → shows submitted message
- **Spin wheel leads**: Shows as "Lead" (no additional action)

---

## 🗂️ **Database Schema**

### **marketing_leads Table**

```sql
CREATE TABLE marketing_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,                              -- ✨ NEW
    source TEXT NOT NULL,                    -- 'spin_wheel', 'contact_form', etc.
    interaction_id UUID REFERENCES marketing_interactions(id),
    meta JSONB DEFAULT '{}'::jsonb,          -- ✨ NEW (stores messages)
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Example Records**

**Spin Wheel Lead:**
```json
{
  "id": "uuid",
  "full_name": "Jane Smith",
  "phone_number": "+1 (555) 987-6543",
  "email": null,
  "source": "spin_wheel",
  "meta": {},
  "created_at": "2026-02-01T..."
}
```

**Contact Form Lead:**
```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "phone_number": "+1 (555) 123-4567",
  "email": "john@example.com",
  "source": "contact_form",
  "meta": {
    "message": "I'm interested in renting a Lamborghini...",
    "submitted_at": "2026-02-01T..."
  },
  "created_at": "2026-02-01T..."
}
```

---

## 🔗 **Navigation Updates**

The "Contact" link in the navigation now points to `/contact` instead of `/#contact`.

**Updated in:**
- `components/Navigation.tsx` - Main navigation
- `components/CTASection.tsx` - CTA buttons now link to `/contact` and `/fleet`

---

## 📊 **Statistics**

The admin customers page now shows:
- **Total Bookings**: Count of unique customers from bookings
- **Total Leads**: Count of marketing leads (spin wheel + contact form)

---

## 🚀 **Testing Checklist**

- [ ] Run `supabase/update_marketing_leads.sql` in Supabase
- [ ] Visit `/contact` page
- [ ] Submit a test contact form
- [ ] Check `/admin/customers` for the new lead
- [ ] Click "View Message" to see the submitted message
- [ ] Test spin wheel popup
- [ ] Verify both sources appear in admin panel
- [ ] Check that booking customers still show "View Bookings" button

---

## 🎉 **Benefits**

✅ **No more Formspree dependency** - All data in your database  
✅ **Centralized CRM** - All customers and leads in one place  
✅ **Better tracking** - Know where each lead came from  
✅ **Message storage** - Contact form messages saved in database  
✅ **Easy follow-up** - View messages directly in admin panel  
✅ **Scalable** - Add more lead sources easily  

---

## 🔧 **Troubleshooting**

### **Issue: "Column email does not exist"**
**Solution:** Run the SQL migration in `supabase/update_marketing_leads.sql`

### **Issue: Contact form not submitting**
**Solution:** Check browser console for errors. Ensure API route is accessible.

### **Issue: Leads not showing in admin panel**
**Solution:** 
1. Check Supabase logs for errors
2. Verify RLS policies allow admin access
3. Ensure you're logged in to admin panel

### **Issue: "View Message" button not working**
**Solution:** Ensure `meta` column exists and contains message data.

---

## 📝 **Next Steps**

1. **Email Notifications**: Add email alerts when new leads come in
2. **Lead Status**: Add status field (new, contacted, converted)
3. **Lead Assignment**: Assign leads to team members
4. **Follow-up Reminders**: Set reminders to follow up with leads
5. **Export Functionality**: Export leads to CSV

---

## 🎯 **Summary**

You now have a **complete CRM system** integrated into your admin panel:

- ✅ Spin Wheel leads → Database
- ✅ Contact Form leads → Database
- ✅ Booking customers → Database
- ✅ All visible in Admin Customers page
- ✅ No external dependencies (Formspree removed)

**Everything is tracked, stored, and manageable from your admin panel!** 🚀
