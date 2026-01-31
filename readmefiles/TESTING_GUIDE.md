# Quick Testing Guide for Marketing Popups

## 🧪 Easy Testing Method

### Step 1: Add Test Buttons (Temporary)

Open `app/layout.tsx` and add the test component:

```typescript
import MarketingHooks from "@/components/MarketingHooks";
import TestMarketingPopups from "@/components/TestMarketingPopups"; // Add this

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <MarketingHooks />
        <TestMarketingPopups /> {/* Add this line */}
      </body>
    </html>
  );
}
```

### Step 2: Test the Popups

1. Visit your website
2. Look for buttons in the **bottom-right corner**:
   - **Test Spin Wheel** - Opens spin wheel popup
   - **Test Valentine's** - Opens Valentine's popup
   - **Clear Cache** - Clears all popup tracking

### Step 3: Test Each Feature

#### Spin Wheel:
- Click "Test Spin Wheel"
- Fill in name and phone
- Click "Continue to Spin"
- Click "SPIN NOW!"
- Verify wheel spins and lands on a prize
- Check result displays correctly

#### Valentine's Popup:
- Click "Test Valentine's"
- Verify heart animations appear
- Check all 3 cars are displayed
- Test "View Details" links
- Test "Call to Book" button

### Step 4: Clear Cache Between Tests

- Click "Clear Cache" button
- Or run in browser console: `sessionStorage.clear(); localStorage.clear();`
- Refresh page

### Step 5: Remove Test Buttons (IMPORTANT!)

**Before going live**, remove the test component from `app/layout.tsx`:

```typescript
// Remove this line:
<TestMarketingPopups />
```

## 🎯 Testing Valentine's Popup Outside Season

If you want Valentine's popup to show all year (for testing):

1. Open `components/MarketingHooks.tsx`
2. Find line 21
3. Uncomment this line:
   ```typescript
   return true; // This will always show Valentine's popup
   ```
4. **Remember to comment it back before going live!**

## 📋 Test Checklist

- [ ] Spin wheel appears correctly
- [ ] Form validation works (try invalid phone)
- [ ] Wheel spins smoothly
- [ ] All 12 segments are visible
- [ ] Text on segments is readable
- [ ] Result displays correctly
- [ ] Prize restrictions message shows for wins
- [ ] Valentine's popup shows
- [ ] Heart animations work
- [ ] All buttons and links work
- [ ] Mobile responsive (test on phone)
- [ ] Popups close properly
- [ ] Test buttons removed before live

## 🔧 Troubleshooting

**Popups not showing?**
- Clear browser cache
- Check browser console for errors
- Make sure you're using latest code
- Try incognito/private window

**Valentine's not showing?**
- Check the date (Jan 25 - Feb 20)
- Or uncomment test line in MarketingHooks.tsx
- Clear sessionStorage

**Wheel text not visible?**
- Check browser zoom level (should be 100%)
- Try different browser
- Clear cache and hard refresh

---

**Remember**: Always remove `<TestMarketingPopups />` from layout.tsx before deploying to production!
