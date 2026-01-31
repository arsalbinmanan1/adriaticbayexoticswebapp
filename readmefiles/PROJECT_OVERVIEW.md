# Adriaticbay Exotics - Premium Car Rental Landing Page

## Overview
A modern, premium landing page for a luxury car rental business built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### 🎨 Design
- **Dark Premium Theme**: Sophisticated dark color scheme with cyan accents
- **Fully Responsive**: Optimized for all screen sizes (mobile, tablet, desktop)
- **Modern Animations**: Smooth transitions, hover effects, and scroll animations
- **High-Quality Imagery**: Beautiful stock photos from Unsplash

### 📱 Components

1. **Navigation Bar**
   - Fixed header with blur effect on scroll
   - Mobile-responsive menu
   - Smooth transitions

2. **Hero Section**
   - Eye-catching headline with gradient text
   - Call-to-action buttons
   - Animated scroll indicator
   - Grid pattern background

3. **Brand Logos**
   - Showcases luxury car brands (Rolls-Royce, Ferrari, Lamborghini, etc.)
   - Hover effects with scale animations

4. **Features Section**
   - Highlights key benefits (Fully Insured, 24/7 Support, Premium Service, Concierge)
   - Icon-based cards with hover effects

5. **Car Listings**
   - Grid layout showcasing available vehicles
   - Each card includes:
     - High-quality car images
     - Pricing information
     - Rating system
     - "Book Now" CTA
     - Featured badges

6. **About Section**
   - Company story and value proposition
   - Statistics showcase (500+ Rentals, 50+ Vehicles, 4.9 Rating)
   - Large hero image

7. **Testimonials**
   - Customer reviews with:
     - 5-star ratings
     - Customer photos
     - Names and roles
     - Detailed feedback

8. **CTA Section**
   - Bold gradient background
   - Multiple call-to-action buttons
   - Key selling points

9. **Footer**
   - Company information
   - Quick links and services
   - Contact information
   - Social media links
   - Legal links

## Tech Stack

- **Framework**: Next.js 16.1.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Button, Card, Badge)
- **Icons**: Lucide React
- **Images**: Unsplash API (stock photos)

## Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Component Structure

```
components/
├── Navigation.tsx       # Fixed header with mobile menu
├── Hero.tsx            # Main hero section
├── BrandLogos.tsx      # Luxury brand showcase
├── FeaturesSection.tsx # Key features/benefits
├── CarListings.tsx     # Vehicle showcase grid
├── AboutSection.tsx    # Company information
├── Testimonials.tsx    # Customer reviews
├── CTASection.tsx      # Call-to-action banner
└── Footer.tsx          # Site footer

app/
├── page.tsx           # Main landing page
├── layout.tsx         # Root layout
└── globals.css        # Global styles + animations
```

## Customization

### Colors
The color scheme uses cyan/blue accents on a dark background. To customize:
- Primary accent: `cyan-500` / `cyan-400`
- Background: `zinc-950` / `zinc-900`
- Text: `white` / `gray-400`

### Images
Replace Unsplash URLs in components with your own car images:
- Hero: `components/Hero.tsx`
- Car Listings: `components/CarListings.tsx`
- About Section: `components/AboutSection.tsx`
- Testimonials: `components/Testimonials.tsx`

### Content
Update text content directly in each component file:
- Company name: Search for "Adriaticbay Exotics"
- Pricing: Update in `CarListings.tsx`
- Contact info: Update in `Footer.tsx`

## Animations

Custom animations defined in `app/globals.css`:
- `animate-float`: Gentle floating effect
- `animate-fadeInUp`: Fade in with upward motion
- Hover effects on cards and buttons
- Smooth color transitions

## Responsive Design

- **Mobile**: Single column layouts, hamburger menu
- **Tablet**: 2-column grids
- **Desktop**: Full multi-column layouts

All components use Tailwind's responsive classes (sm:, md:, lg:, xl:)

## Performance

- Next.js Image component for optimized images
- CSS animations for smooth performance
- Lazy loading of images
- Optimized bundle size with tree-shaking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Built with ❤️ for premium luxury car rental experiences.
