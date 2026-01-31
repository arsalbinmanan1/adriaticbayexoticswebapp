# 🚀 Deployment Guide - Adriatic Bay Exotics

Complete guide to deploying your luxury car rental platform to production.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deploying to Vercel](#deploying-to-vercel)
3. [Alternative Deployment Options](#alternative-deployment-options)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Production Environment Variables](#production-environment-variables)
6. [Database Migration](#database-migration)
7. [Domain Setup](#domain-setup)
8. [SSL & Security](#ssl--security)
9. [Monitoring & Analytics](#monitoring--analytics)
10. [Troubleshooting Deployment](#troubleshooting-deployment)

---

## Pre-Deployment Checklist

Before deploying, ensure you've completed these steps:

### Code Cleanup
- [ ] Remove `<TestMarketingPopups />` from `app/layout.tsx`
- [ ] Comment out any test/debug code
- [ ] Remove console.log statements from production code
- [ ] Verify no hardcoded test data

### Data Verification
- [ ] All car images are professional photos (not stock images)
- [ ] All pricing is accurate
- [ ] Contact information is correct
- [ ] Fleet data is up-to-date in `lib/cars-data.ts`
- [ ] Testimonials are real (if using)

### Security
- [ ] Changed default admin password from `admin123`
- [ ] Generated strong JWT_SECRET (32+ characters)
- [ ] Reviewed all API routes for proper authentication
- [ ] Tested admin authentication flow
- [ ] Verified environment variables are secure

### Testing
- [ ] Tested entire booking flow
- [ ] Tested payment processing in sandbox
- [ ] Tested email notifications
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] No errors in browser console
- [ ] No TypeScript/linting errors

### External Services
- [ ] Supabase database is production-ready
- [ ] Square account verified (ready for production)
- [ ] Resend sender email verified
- [ ] Formspree form configured
- [ ] All API keys are from production accounts (not test)

---

## Deploying to Vercel

Vercel is the recommended platform for Next.js applications.

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., `adriaticbayexotics`)
   - Don't initialize with README (you already have one)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/yourusername/adriaticbayexotics.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. **Sign Up for Vercel**:
   - Go to [vercel.com](https://vercel.com/)
   - Sign up with your GitHub account

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Step 3: Add Environment Variables

In the Vercel project settings, add all environment variables:

Click "Environment Variables" and add each one:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Square (PRODUCTION)
SQUARE_ACCESS_TOKEN=your-production-access-token
SQUARE_ENVIRONMENT=production
SQUARE_LOCATION_ID=your-production-location-id
SQUARE_WEBHOOK_SIGNATURE_KEY=your-production-webhook-key
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your-production-app-id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your-production-location-id
NEXT_PUBLIC_SQUARE_ENVIRONMENT=production

# Authentication
JWT_SECRET=your-production-jwt-secret-32-chars-min

# Email
RESEND_API_KEY=your-production-resend-key

# Optional
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key
KV_URL=your-kv-url
KV_REST_API_URL=your-kv-rest-api-url
KV_REST_API_TOKEN=your-kv-token
KV_REST_API_READ_ONLY_TOKEN=your-kv-readonly-token
```

**Important**: Set these variables for all environments (Production, Preview, Development).

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-5 minutes)
3. Vercel will provide a URL like: `https://adriaticbayexotics.vercel.app`

### Step 5: Test Deployment

1. Visit your Vercel URL
2. Test all critical features:
   - [ ] Homepage loads
   - [ ] Fleet page works
   - [ ] Individual car pages load
   - [ ] Admin login works
   - [ ] Marketing popups appear
   - [ ] Forms submit correctly

---

## Alternative Deployment Options

### Option 1: Netlify

1. **Sign up** at [netlify.com](https://netlify.com/)
2. **Connect repository** from GitHub
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Add environment variables** in Site Settings
5. **Deploy**

### Option 2: AWS Amplify

1. **Sign in** to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. **Connect repository**
3. **Configure build settings**:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
4. **Add environment variables**
5. **Deploy**

### Option 3: DigitalOcean App Platform

1. **Create account** at [digitalocean.com](https://www.digitalocean.com/)
2. **Create new app** from GitHub
3. **Configure**:
   - Build command: `npm run build`
   - Run command: `npm start`
4. **Add environment variables**
5. **Deploy**

### Option 4: Self-Hosted (VPS)

Requirements:
- Ubuntu 20.04+ or similar Linux server
- Node.js 18+ installed
- Nginx or Apache for reverse proxy
- PM2 for process management

```bash
# On your server:
# 1. Clone repository
git clone https://github.com/yourusername/adriaticbayexotics.git
cd adriaticbayexotics

# 2. Install dependencies
npm install

# 3. Create .env.local with production variables
nano .env.local

# 4. Build
npm run build

# 5. Install PM2
npm install -g pm2

# 6. Start with PM2
pm2 start npm --name "adriaticbay" -- start

# 7. Configure Nginx
# Create /etc/nginx/sites-available/adriaticbay
# Point to localhost:3000
# Enable SSL with Let's Encrypt
```

---

## Post-Deployment Configuration

### 1. Update Square Webhooks

After deployment, you need to update Square webhook URLs:

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Select your application
3. Go to **Webhooks**
4. Update webhook URL to:
   ```
   https://yourdomain.com/api/webhooks/square
   ```
5. Subscribe to events:
   - `payment.updated`
   - `payment.created`
   - `refund.created`
   - `refund.updated`

### 2. Configure Inngest (if using)

1. Go to [Inngest Dashboard](https://app.inngest.com/)
2. Update app URL to your production domain
3. Verify webhook signature

### 3. Verify Resend

1. Go to [Resend Dashboard](https://resend.com/)
2. Verify your sending domain (for production)
3. Test sending an email from production

### 4. Test End-to-End Flow

Critical path to test:
1. **Customer Flow**:
   - Browse fleet
   - Select a car
   - Fill booking form
   - Process payment
   - Receive confirmation email

2. **Admin Flow**:
   - Log in to admin
   - View new booking
   - Confirm booking
   - Verify email sent

3. **Marketing Flow**:
   - Spin wheel popup appears
   - Submit form
   - Check Formspree for lead

---

## Production Environment Variables

### Required for Production

| Variable | Where to Get | Notes |
|----------|--------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | Production database |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | Public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Keep secret |
| `SQUARE_ACCESS_TOKEN` | Square Dashboard | **Production** access token |
| `SQUARE_ENVIRONMENT` | Manual | Set to `production` |
| `SQUARE_LOCATION_ID` | Square Dashboard | Production location |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Square Webhooks | For verification |
| `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | Square Dashboard | Public ID |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | Square Dashboard | Public location ID |
| `NEXT_PUBLIC_SQUARE_ENVIRONMENT` | Manual | Set to `production` |
| `JWT_SECRET` | Generated | 32+ characters, secure |
| `RESEND_API_KEY` | Resend Dashboard | Production key |

### Optional but Recommended

| Variable | Purpose |
|----------|---------|
| `INNGEST_EVENT_KEY` | Background job processing |
| `INNGEST_SIGNING_KEY` | Webhook verification |
| `KV_URL` | Rate limiting |
| `KV_REST_API_URL` | Vercel KV |
| `KV_REST_API_TOKEN` | KV authentication |
| `KV_REST_API_READ_ONLY_TOKEN` | Read-only KV access |

---

## Database Migration

### Using Supabase (Recommended)

Supabase handles migrations automatically, but ensure:

1. **Production Database**:
   - Use the same Supabase project or create a production-specific project
   - If separate, run `supabase/full_setup.sql` on production database

2. **Data Migration**:
   - If moving from dev to production database:
   ```sql
   -- Export data from dev
   -- Import into production using Supabase dashboard
   ```

3. **Admin Users**:
   - Create production admin users with secure passwords
   - Don't use test credentials in production

### Backup Strategy

```sql
-- Schedule regular backups in Supabase Dashboard
-- Settings → Database → Backups
-- Enable automatic daily backups
```

---

## Domain Setup

### Step 1: Purchase Domain

Purchase a domain from:
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)
- [Google Domains](https://domains.google/)

### Step 2: Configure Domain in Vercel

1. Go to Vercel Project Settings
2. Click "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

### Step 3: Update DNS Records

In your domain registrar, add these DNS records:

**For Vercel:**
- **Type**: A
- **Name**: @
- **Value**: 76.76.21.21

- **Type**: CNAME
- **Name**: www
- **Value**: cname.vercel-dns.com

### Step 4: Wait for DNS Propagation

- Usually takes 1-24 hours
- Check status: [whatsmydns.net](https://www.whatsmydns.net/)

---

## SSL & Security

### SSL Certificate (Vercel)

Vercel automatically provisions SSL certificates via Let's Encrypt:
- No configuration needed
- Auto-renewal
- Supports custom domains

### Security Headers

Vercel automatically adds security headers. To customize, create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Additional Security

1. **Change Default Passwords**:
   - Update admin password from `admin123`
   - Use strong, unique passwords

2. **Enable 2FA**:
   - On Supabase account
   - On Square account
   - On Vercel account
   - On GitHub account

3. **Rotate Secrets**:
   - Rotate API keys every 90 days
   - Update JWT_SECRET periodically

4. **Monitor Access**:
   - Check admin login logs
   - Review API usage
   - Set up alerts for suspicious activity

---

## Monitoring & Analytics

### Vercel Analytics

1. Enable in Vercel Dashboard:
   - Go to Analytics tab
   - Enable Web Analytics
   - Automatically tracks performance

### Error Tracking

**Option 1: Vercel Log Drain**
- Streams logs to external services
- Integrates with Datadog, LogRocket, etc.

**Option 2: Sentry**
```bash
npm install @sentry/nextjs
```

Initialize in `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

### Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com/) - Free tier available
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

Configure alerts for:
- Site downtime
- Slow response times (> 3 seconds)
- SSL certificate expiration

### Custom Analytics

Add Google Analytics or Plausible:

```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## Troubleshooting Deployment

### Build Fails

**Problem**: Build fails with TypeScript errors
```
Solution:
- Run `npm run build` locally first
- Fix all TypeScript errors
- Ensure all imports are correct
```

**Problem**: Missing dependencies
```
Solution:
- Verify package.json is complete
- Run `npm install` to check for issues
- Commit package-lock.json
```

### Environment Variables Not Working

**Problem**: App can't connect to services
```
Solution:
- Verify all variables are set in Vercel
- Check for typos in variable names
- Ensure variables are set for correct environment
- Redeploy after adding variables
```

### Database Connection Issues

**Problem**: Can't connect to Supabase
```
Solution:
- Verify Supabase URL and keys
- Check if Supabase project is active
- Review Supabase project quotas
- Check for IP restrictions
```

### Payment Processing Fails

**Problem**: Square payments not working
```
Solution:
- Verify SQUARE_ENVIRONMENT is set to "production"
- Use production Square credentials, not sandbox
- Check webhook URL is updated
- Verify webhook signature key
```

### Emails Not Sending

**Problem**: Resend emails not delivering
```
Solution:
- Verify sender domain is verified in Resend
- Check Resend API key is production key
- Review Resend dashboard for errors
- Check email quotas/limits
```

### Redirect Loops

**Problem**: Infinite redirects to login
```
Solution:
- Check middleware.ts configuration
- Verify JWT_SECRET is set
- Clear browser cookies
- Check admin session cookie settings
```

### Slow Performance

**Problem**: Site loads slowly
```
Solution:
- Enable Vercel Edge Network
- Optimize images (use next/image)
- Enable caching headers
- Review database queries
- Consider CDN for static assets
```

---

## Post-Launch Checklist

- [ ] Site is live and accessible
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] All pages load without errors
- [ ] Booking flow works end-to-end
- [ ] Payments process successfully
- [ ] Emails send correctly
- [ ] Admin dashboard accessible
- [ ] Spin wheel captures leads
- [ ] Mobile experience is smooth
- [ ] Analytics tracking configured
- [ ] Uptime monitoring set up
- [ ] Error tracking configured
- [ ] Backups scheduled
- [ ] Documentation updated with production URLs
- [ ] Team trained on admin dashboard
- [ ] Support contact info updated
- [ ] Social media links updated
- [ ] Google Search Console configured
- [ ] Sitemap submitted to search engines

---

## Ongoing Maintenance

### Weekly
- [ ] Check error logs
- [ ] Review booking activity
- [ ] Monitor uptime
- [ ] Check email delivery rates

### Monthly
- [ ] Review analytics
- [ ] Check for package updates
- [ ] Review and rotate any temporary promo codes
- [ ] Backup database manually

### Quarterly
- [ ] Update dependencies
- [ ] Rotate API keys
- [ ] Review security settings
- [ ] Performance audit
- [ ] Content refresh (new car photos, testimonials)

---

## Emergency Contacts

Keep these handy for production issues:

- **Vercel Support**: support@vercel.com
- **Supabase Support**: support@supabase.com
- **Square Support**: https://squareup.com/help
- **Resend Support**: support@resend.com

---

## Success! 🎉

Your luxury car rental platform is now live and ready to generate bookings!

### Next Steps:
1. **Market your site**: Share on social media, Google Business, etc.
2. **SEO optimization**: Add meta tags, submit sitemap
3. **Customer support**: Set up email, phone, chat for inquiries
4. **Monitor performance**: Check analytics daily
5. **Iterate**: Gather feedback and improve

**You've got this! 🚀🏎️**

---

**Last Updated**: January 2026
