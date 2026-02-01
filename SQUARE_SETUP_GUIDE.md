# 🔧 Square Payment Setup - Fix Configuration Error

**Error:** `The Payment 'applicationId' option is not in the correct format.`

---

## ❌ The Problem

Your Square Application ID in `.env.local` is not in the correct format. Square requires specific formats for their IDs.

---

## ✅ The Solution

### Step 1: Get Your Square Credentials

1. **Go to Square Developer Dashboard:**
   - Sandbox: https://developer.squareup.com/apps
   - Production: https://squareup.com/dashboard/apps

2. **Select Your Application** (or create one)

3. **Get Your Credentials:**

#### For SANDBOX (Testing):
```
Application ID: sandbox-sq0idb-XXXXXXXXXXXXXXXXXXXXXXXX
Location ID: LXXXXXXXXXXXXXXX
Access Token: EAAAl...
```

#### For PRODUCTION (Live):
```
Application ID: sq0idp-XXXXXXXXXXXXXXXXXXXXXXXX
Location ID: LXXXXXXXXXXXXXXX
Access Token: EAAAl...
```

---

## 🔑 Update Your .env.local File

Open your `.env.local` file and update these values:

### For SANDBOX Testing (Recommended to start):

```bash
# Square Payment Configuration (SANDBOX)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-YOUR_SANDBOX_APP_ID_HERE
NEXT_PUBLIC_SQUARE_LOCATION_ID=YOUR_LOCATION_ID_HERE
NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox

# Server-side Square credentials
SQUARE_ACCESS_TOKEN=YOUR_SANDBOX_ACCESS_TOKEN_HERE
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=YOUR_LOCATION_ID_HERE
SQUARE_WEBHOOK_SIGNATURE_KEY=YOUR_WEBHOOK_KEY_HERE
```

### For PRODUCTION (When ready to go live):

```bash
# Square Payment Configuration (PRODUCTION)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-YOUR_PRODUCTION_APP_ID_HERE
NEXT_PUBLIC_SQUARE_LOCATION_ID=YOUR_LOCATION_ID_HERE
NEXT_PUBLIC_SQUARE_ENVIRONMENT=production

# Server-side Square credentials
SQUARE_ACCESS_TOKEN=YOUR_PRODUCTION_ACCESS_TOKEN_HERE
SQUARE_ENVIRONMENT=production
SQUARE_LOCATION_ID=YOUR_LOCATION_ID_HERE
SQUARE_WEBHOOK_SIGNATURE_KEY=YOUR_WEBHOOK_KEY_HERE
```

---

## 📋 Format Requirements

### Application ID Formats:
- **Sandbox:** `sandbox-sq0idb-` followed by alphanumeric characters
- **Production:** `sq0idp-` followed by alphanumeric characters

### Location ID Format:
- Always starts with `L` followed by alphanumeric characters
- Example: `LXXXXXXXXXXXXXXXXX`

### Access Token Format:
- Starts with `EAAA` followed by a long string
- Example: `EAAAl1234567890abcdefghijklmnopqrstuvwxyz...`

---

## 🧪 Where to Find These in Square Dashboard

### Step-by-Step:

1. **Login to Square Developer:**
   - Go to: https://developer.squareup.com/apps

2. **Open Your App** (or click "Create App")

3. **Navigate to "Credentials"** (left sidebar)

4. **Copy the values:**
   - **Application ID** → `NEXT_PUBLIC_SQUARE_APPLICATION_ID`
   - **Location ID** → `NEXT_PUBLIC_SQUARE_LOCATION_ID` & `SQUARE_LOCATION_ID`
   - **Access Token** → `SQUARE_ACCESS_TOKEN`

5. **For Sandbox Toggle:**
   - Switch to "Sandbox" mode at the top
   - Copy the SANDBOX credentials

---

## 🔍 Common Mistakes

### ❌ Wrong Format Examples:

```bash
# TOO SHORT
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox

# MISSING PREFIX
NEXT_PUBLIC_SQUARE_APPLICATION_ID=abc123def456

# PRODUCTION ID IN SANDBOX MODE (or vice versa)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-xxx
NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox  # Mismatch!

# EXTRA SPACES OR QUOTES
NEXT_PUBLIC_SQUARE_APPLICATION_ID="sandbox-sq0idb-xxx"  # Remove quotes
NEXT_PUBLIC_SQUARE_APPLICATION_ID= sandbox-sq0idb-xxx   # Remove space
```

### ✅ Correct Format Examples:

```bash
# SANDBOX
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-x4kgB2hJp9q1vKdR3mF7yC8wZ5nL0tA2
NEXT_PUBLIC_SQUARE_LOCATION_ID=LH2T8QX9Y1R5K
NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox

# PRODUCTION
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6
NEXT_PUBLIC_SQUARE_LOCATION_ID=LH2T8QX9Y1R5K
NEXT_PUBLIC_SQUARE_ENVIRONMENT=production
```

---

## 🚀 After Updating .env.local

### 1. Restart Your Development Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

**IMPORTANT:** Changes to `.env.local` require a server restart!

### 2. Verify Configuration

Open browser console and check for:
```
✅ All required environment variables are set
```

If you see missing variables, double-check your `.env.local` file.

---

## 🧪 Test with Sandbox Cards

Once configured, use these test cards in **SANDBOX** mode:

### Success Card:
```
Card Number: 4111 1111 1111 1111
Expiration: 12/25 (any future date)
CVV: 123
ZIP: 12345
```

### 3D Secure Card:
```
Card Number: 4532 7597 7512 5051
Expiration: 12/25
CVV: 123
ZIP: 12345
```

### Decline Card (for testing errors):
```
Card Number: 4000 0000 0000 0002
Expiration: 12/25
CVV: 123
ZIP: 12345
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Use **SANDBOX** for development/testing
- Keep `.env.local` in `.gitignore`
- Never commit credentials to Git
- Use different keys for dev/staging/production
- Rotate tokens regularly

### ❌ DON'T:
- Use production credentials in development
- Share your access tokens
- Commit `.env.local` to version control
- Use the same credentials across environments

---

## 📊 Complete .env.local Template

Here's a complete template for your `.env.local` file:

```bash
# ==========================================
# SUPABASE CONFIGURATION
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ==========================================
# SQUARE PAYMENT CONFIGURATION (SANDBOX)
# ==========================================
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-YOUR_SANDBOX_APP_ID
NEXT_PUBLIC_SQUARE_LOCATION_ID=YOUR_LOCATION_ID
NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox

# Server-side Square credentials
SQUARE_ACCESS_TOKEN=YOUR_SANDBOX_ACCESS_TOKEN
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=YOUR_LOCATION_ID
SQUARE_WEBHOOK_SIGNATURE_KEY=your-webhook-key-optional

# ==========================================
# AUTHENTICATION
# ==========================================
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# ==========================================
# EMAIL SERVICE (RESEND)
# ==========================================
RESEND_API_KEY=re_your_resend_api_key

# ==========================================
# OPTIONAL - FORMSPREE
# ==========================================
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

---

## ✅ Checklist

After updating your `.env.local`:

- [ ] Application ID starts with `sandbox-sq0idb-` (sandbox) or `sq0idp-` (production)
- [ ] Location ID starts with `L`
- [ ] Access Token starts with `EAAA`
- [ ] Environment matches credentials (sandbox/production)
- [ ] No extra spaces or quotes around values
- [ ] All NEXT_PUBLIC_ variables match their non-public counterparts
- [ ] Server restarted after changes
- [ ] Browser console shows no missing env var warnings

---

## 🆘 Still Having Issues?

### Check Browser Console:
```javascript
// Open browser console and run:
console.log('App ID:', process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID)
console.log('Location ID:', process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID)
console.log('Environment:', process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT)
```

If any show `undefined`, your `.env.local` is not configured correctly or server needs restart.

### Verify Square Dashboard:
1. Go to https://developer.squareup.com/apps
2. Open your app
3. Click "Credentials"
4. Verify you're in "Sandbox" mode (toggle at top)
5. Copy the exact values shown

---

## 🎯 Quick Fix Summary

1. **Get credentials from Square Dashboard** (Sandbox mode)
2. **Update `.env.local`** with correct format
3. **Restart server:** `npm run dev`
4. **Test booking** with card: `4111 1111 1111 1111`

**That's it!** 🚀

