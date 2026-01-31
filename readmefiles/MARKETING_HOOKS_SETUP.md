# Marketing Hooks Setup Guide

## 🎯 Features Implemented

### 1. **Spin Wheel Lead Generation**
- ✅ Appears 3 seconds after first visit
- ✅ Reappears every 90 seconds of active user time
- ✅ Won't show more than once every 5 minutes
- ✅ Captures Full Name and Phone Number
- ✅ 12 prize segments with proper distribution
- ✅ Beautiful animated wheel
- ✅ Formspree integration for lead capture

### 2. **Valentine's Special Promotion**
- ✅ Appears during Valentine's season (Jan 25 - Feb 20)
- ✅ Beautiful heart animations
- ✅ Features C8 Corvette, McLaren 570S, and Maserati Levante
- ✅ "Buy 2 Days, Get 1 Free" offer
- ✅ Shows once per session during season

## 📋 Setup Instructions

### Step 1: Set Up Formspree

1. **Create a Formspree Account**
   - Go to [https://formspree.io/](https://formspree.io/)
   - Sign up for a free account

2. **Create a New Form**
   - Click "New Form"
   - Name it "Spin Wheel Leads"
   - Copy your Form ID (looks like: `xvgopqrs`)

3. **Update the Code**
   - Open `components/SpinWheelPopup.tsx`
   - Find line 41: `const [formspreeState, sendToFormspree] = useFormspree("YOUR_FORMSPREE_ID");`
   - Replace `"YOUR_FORMSPREE_ID"` with your actual Formspree ID
   - Example: `useFormspree("xvgopqrs")`

### Step 2: Test the Popups

#### **Option 1: Use Test Buttons (Recommended)**

Add the test component to your layout temporarily:

1. Open `app/layout.tsx`
2. Import the test component:
   ```typescript
   import TestMarketingPopups from "@/components/TestMarketingPopups";
   ```
3. Add it to the body (temporarily):
   ```typescript
   {children}
   <MarketingHooks />
   <TestMarketingPopups /> {/* Add this line */}
   ```
4. Save and visit your site
5. You'll see test buttons in the bottom-right corner
6. **Remove `<TestMarketingPopups />` before going live!**

#### **Option 2: Test Naturally**

1. **Test Spin Wheel**
   - Visit your website
   - Spin wheel should appear after 3 seconds
   - Fill in the form and spin
   - Check Formspree dashboard for submissions

2. **Test Valentine's Popup**
   - Currently shows only during Jan 25 - Feb 20
   - To test NOW, uncomment line 21 in `components/MarketingHooks.tsx`:
     ```typescript
     return true; // Uncomment this line to always show Valentine's popup
     ```
   - Remember to comment it back after testing!

3. **Test Active Time Trigger**
   - After closing the spin wheel, stay active on the site
   - The wheel should reappear after 90 seconds of activity

4. **Clear Cache Between Tests**
   - Open browser console
   - Run: `sessionStorage.clear(); localStorage.clear();`
   - Refresh page

## 🎨 Prize Distribution

The spin wheel has 12 segments:
- **6 segments**: No Prize (50% chance)
- **2 segments**: 10% Discount (16.67% chance)
- **2 segments**: 2 Extra Rental Hours (16.67% chance)
- **1 segment**: Free Delivery & Pickup in Tampa Bay (8.33% chance)
- **1 segment**: Full Tank Gas Bypass (8.33% chance)

## ⚙️ Customization Options

### Adjust Spin Wheel Timing

Edit `components/MarketingHooks.tsx`:

```typescript
// Line 50: Initial delay (currently 3 seconds)
setTimeout(() => {
  setShowSpinWheel(true);
}, 3000); // Change to 5000 for 5 seconds

// Line 64: Active time interval (currently 90 seconds)
if (activeTime > 0 && activeTime % 90 === 0) {
  // Change 90 to your desired seconds
}
```

### Change Prize Colors

Edit `components/SpinWheelPopup.tsx` line 19-30:
```typescript
color: "from-red-600 to-red-700" // Change colors here
```

### Modify Valentine's Dates

Edit `components/MarketingHooks.tsx` line 13-19:
```typescript
// Currently: January 25 - February 20
return (month === 0 && day >= 25) || (month === 1 && day <= 20);
```

### Change Featured Valentine's Cars

Edit `components/ValentinesPopup.tsx` line 15-19:
```typescript
const featuredCars = [
  { name: "Your Car", slug: "car-slug", price: "$XXX" },
];
```

## 📊 Lead Data Captured

Each spin wheel submission sends:
- **Full Name**: User's full name
- **Phone Number**: User's phone number (validated)
- **Timestamp**: When they submitted
- **Source**: "Spin Wheel"

You can access all leads in your Formspree dashboard.

## 🎯 User Experience Flow

### First Visit:
1. User lands on site
2. After 3 seconds → Spin Wheel appears
3. User enters details → Spins wheel → Sees result
4. If Valentine's season → Valentine's popup appears 5 seconds later

### Return Visits:
1. Spin wheel won't show if they spun in the last 24 hours
2. Valentine's popup won't show again in the same session
3. If user is active for 90 seconds → Spin wheel can appear again (if 5+ minutes since last spin)

## 🚫 Prize Restrictions

Automatically displayed on win screen:
- "Cannot be combined with already discounted vehicles or special promotions"

This ensures prizes are only applied to:
- Regular priced vehicles
- Non-promotional offers

## 🎨 Styling

Both popups use your brand colors:
- **Red** (#DC2626): Primary accent
- **Amber/Gold** (#F59E0B): Secondary accent
- **Dark theme**: Zinc backgrounds for premium feel

## 📱 Mobile Responsive

- ✅ Both popups are fully responsive
- ✅ Touch-friendly on mobile devices
- ✅ Proper sizing for all screen sizes

## 🔒 Anti-Spam Features

1. **LocalStorage tracking**: Prevents showing spin wheel too frequently
2. **Session storage**: Valentine's popup shows once per session
3. **Time gates**: Minimum time between appearances
4. **Activity tracking**: Only counts active time

## 🧪 Testing Checklist

- [ ] Formspree ID updated
- [ ] Spin wheel appears on first visit
- [ ] Form validation works (try invalid phone numbers)
- [ ] Wheel spins and lands on prizes
- [ ] Leads appear in Formspree dashboard
- [ ] Spin wheel reappears after 90 seconds of activity
- [ ] Valentine's popup appears during season
- [ ] Heart animations work smoothly
- [ ] All CTAs link to correct pages
- [ ] Mobile responsive on all devices

## 📞 Support

If you need to adjust anything:
1. **Timing**: Edit `MarketingHooks.tsx`
2. **Prizes**: Edit `SpinWheelPopup.tsx`
3. **Colors**: Edit respective component files
4. **Contact info**: Already using your updated contacts

## 🎉 Go Live!

Once you've:
1. ✅ Added your Formspree ID
2. ✅ Tested on your site
3. ✅ Verified leads are being captured

You're ready to start generating leads and driving conversions! 🚀

---

**Note**: The Valentine's popup will only show during January 25 - February 20. Outside this period, only the spin wheel will be active.
