# ⚡ QUICK FIX: Square Payment Error

**Error:** `The Payment 'applicationId' option is not in the correct format.`

---

## 🔧 The Problem

Your Square Application ID in `.env.local` is incorrect or missing.

---

## ✅ Quick Fix (2 Minutes)

### Step 1: Get Your Square Sandbox Credentials

1. Go to: **https://developer.squareup.com/apps**
2. Click your app (or create one)
3. Click **"Credentials"** (left sidebar)
4. **Toggle to "Sandbox"** mode (top of page)
5. Copy these values:
   - **Application ID** (starts with `sandbox-sq0idb-`)
   - **Location ID** (starts with `L`)
   - **Access Token** (starts with `EAAA`)

### Step 2: Update .env.local

Open your `.env.local` file and update these lines:

```bash
# Square Configuration
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-YOUR_VALUE_HERE
NEXT_PUBLIC_SQUARE_LOCATION_ID=LXXXXXXXXXXXXX
NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox

SQUARE_ACCESS_TOKEN=EAAAl_YOUR_ACCESS_TOKEN_HERE
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=LXXXXXXXXXXXXX
```

**IMPORTANT:** 
- Use the EXACT values from Square Dashboard
- Don't add quotes around the values
- Don't add spaces
- Application ID must start with `sandbox-sq0idb-` for sandbox

### Step 3: Restart Server

```bash
# Stop your server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

---

## ✅ Test It

After restarting, try booking again with test card:
```
Card: 4111 1111 1111 1111
Exp: 12/25
CVV: 123
ZIP: 12345
```

---

## 📚 Need More Help?

See detailed guide: `readmefiles/SQUARE_SETUP_GUIDE.md`

---

## ❓ Common Issues

### "Still getting the error"
→ Make sure you restarted the server after changing .env.local

### "Application ID doesn't start with sandbox-"
→ You're copying the production ID. Toggle to "Sandbox" mode in Square Dashboard

### "Values are undefined in console"
→ Your `.env.local` file might be in the wrong location (should be in project root)

