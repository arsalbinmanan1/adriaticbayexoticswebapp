# 📧 Gmail Email Setup Guide

Complete guide to set up Gmail for sending booking confirmation emails.

---

## 🔐 Step 1: Enable Gmail App Password

### **Why App Password?**
Gmail requires an "App Password" (not your regular password) for security when apps access your account.

### **How to Create App Password:**

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already enabled):
   - Click "2-Step Verification"
   - Follow the prompts to enable it
   - **Required**: You MUST have 2FA enabled to create app passwords

3. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Or search for "App passwords" in Google Account settings
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter name: "Adriatic Bay Exotics Website"
   - Click "Generate"

4. **Copy the 16-character password:**
   ```
   Example: abcd efgh ijkl mnop
   ```
   - **Save this!** You won't see it again
   - Remove spaces when adding to .env.local

---

## ⚙️ Step 2: Update .env.local

Add these two lines to your `.env.local` file:

```bash
# ==========================================
# GMAIL EMAIL CONFIGURATION
# ==========================================
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

### **Example:**

```bash
# Gmail Configuration
GMAIL_USER=adriaticbayexotics@gmail.com
GMAIL_APP_PASSWORD=xyzw abcd efgh ijkl  # Remove spaces!
```

**Important:**
- Use your FULL Gmail address (including @gmail.com)
- Remove ALL spaces from the app password
- Don't use your regular Gmail password!

---

## 🔄 Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🧪 Step 4: Test Email Sending

### **Option A: Test via API Route**

Create a test file: `app/api/test-email/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { testEmailConnection, sendEmail } from '@/lib/email/gmail';

export async function GET() {
  // Test connection
  const connectionOk = await testEmailConnection();
  
  if (!connectionOk) {
    return NextResponse.json({ error: 'Gmail connection failed' }, { status: 500 });
  }
  
  // Send test email
  const success = await sendEmail({
    to: 'your-test-email@gmail.com', // Change this!
    subject: 'Test Email from Adriatic Bay Exotics',
    html: '<h1>Success!</h1><p>Gmail email sending is working!</p>',
  });
  
  return NextResponse.json({ 
    success, 
    message: success ? 'Email sent!' : 'Email failed' 
  });
}
```

Then visit: http://localhost:3000/api/test-email

### **Option B: Test via Browser Console**

On any page, open console (F12) and run:

```javascript
fetch('/api/test-email')
  .then(r => r.json())
  .then(console.log)
```

---

## ✅ Step 5: Complete a Test Booking

1. Go to: http://localhost:3000/fleet/mclaren-570s
2. Click "Book Now"
3. Fill in all details (use your real email!)
4. Complete payment with test card:
   ```
   Card: 4111 1111 1111 1111
   Exp: 12/25
   CVV: 123
   ZIP: 12345
   ```
5. **Check your email inbox!** 📧

---

## 📧 What the Email Looks Like

The booking confirmation email includes:

### **Beautiful HTML Design:**
- ✅ Adriatic Bay Exotics branding
- ✅ Green checkmark (booking confirmed)
- ✅ Car image and details
- ✅ Pickup/dropoff information
- ✅ Complete pricing breakdown
- ✅ Payment status (deposit paid + balance due)
- ✅ Important information
- ✅ Contact details

### **Email Contains:**
- Booking ID
- Vehicle details (year, make, model)
- Pickup date, time, location
- Dropoff date, time, location
- Rental duration
- Base rental cost
- Add-ons and extras
- Discount (if applied)
- Tax calculation
- **Total amount**
- **Deposit paid**
- **Balance due at pickup**
- Important reminders
- 24/7 contact information

---

## 🔍 Troubleshooting

### **Error: "Invalid login"**

**Solution:**
1. Make sure 2-Step Verification is enabled
2. Use App Password, not your regular password
3. Remove all spaces from app password
4. Check that GMAIL_USER has @gmail.com

### **Error: "Connection timeout"**

**Solution:**
1. Check your internet connection
2. Gmail might be temporarily down
3. Try again in a few minutes

### **Error: "Username and Password not accepted"**

**Solution:**
1. Regenerate app password
2. Make sure you're using the correct Gmail account
3. Check for typos in .env.local

### **Email not arriving**

**Solution:**
1. Check spam/junk folder
2. Check Gmail "Sent" folder to confirm it was sent
3. Try sending to a different email address
4. Check server logs for errors

### **"Less secure app access" error**

**Solution:**
- Don't use "Less secure app access" - it's deprecated
- Use App Password instead (more secure)

---

## 📊 Email Delivery Status

After booking, check the server console:

```bash
✅ Email sent successfully: <message-id>
✅ Booking confirmation sent to customer@email.com
```

If you see errors:
```bash
❌ Email sending failed: [error details]
```

---

## 🎨 Customize Email Template

The email template is in: `lib/email/templates/booking-confirmation.ts`

You can customize:
- Colors
- Logo
- Text
- Layout
- Additional information

---

## 🔐 Security Best Practices

### ✅ DO:
- Use App Password (never regular password)
- Keep .env.local in .gitignore
- Use different Gmail account for production
- Monitor sent emails regularly
- Rotate app passwords periodically

### ❌ DON'T:
- Commit .env.local to Git
- Share your app password
- Use your personal Gmail for production
- Disable 2-Step Verification

---

## 📧 Production Recommendations

For production, consider:

1. **Create dedicated Gmail account:**
   ```
   bookings@adriaticbayexotics.com
   ```

2. **Use Google Workspace** (paid):
   - More reliable
   - Higher sending limits
   - Professional email address
   - Better support

3. **Gmail Sending Limits:**
   - Free Gmail: 500 emails/day
   - Google Workspace: 2,000 emails/day

4. **Alternative Services** (if needed):
   - SendGrid
   - Mailgun
   - Amazon SES
   - Postmark

---

## ✅ Complete Setup Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password created
- [ ] GMAIL_USER added to .env.local
- [ ] GMAIL_APP_PASSWORD added to .env.local (no spaces)
- [ ] Server restarted
- [ ] Test email sent successfully
- [ ] Test booking completed
- [ ] Confirmation email received
- [ ] Email looks good (not in spam)

---

## 🎉 You're Done!

Your booking confirmation emails are now set up and will be sent automatically after each successful payment!

**Test it now:**
1. Complete a test booking
2. Check your email
3. Verify all details are correct

Need help? Check the troubleshooting section above! 📧✨

