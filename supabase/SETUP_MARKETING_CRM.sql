/*
  Adriatic Bay Exotics - Complete Marketing & CRM Setup
  Description: Creates marketing system tables and updates for CRM integration
  Run this ONCE to set up the complete marketing and CRM system
*/

-- ==========================================
-- 1. CREATE CAMPAIGNS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'spin_wheel', 'holiday', 'flash_sale', etc.
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    config JSONB DEFAULT '{}'::jsonb, -- Store theme, weights, timer settings, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. ENHANCE PROMO_CODES TABLE
-- ==========================================
ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL;
ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS is_unique BOOLEAN DEFAULT false;
ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- ==========================================
-- 3. MARKETING INTERACTIONS (For Analytics)
-- ==========================================
CREATE TABLE IF NOT EXISTS marketing_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    visitor_id TEXT, -- localStorage or session ID
    interaction_type TEXT NOT NULL, -- 'view', 'spin', 'click', 'application'
    meta JSONB DEFAULT '{}'::jsonb, -- Store details like spin result, promo used
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. MARKETING LEADS (Spin Wheel & Contact Form)
-- ==========================================
CREATE TABLE IF NOT EXISTS marketing_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,                              -- For contact form submissions
    source TEXT NOT NULL,                    -- 'spin_wheel', 'contact_form', 'valentine'
    interaction_id UUID REFERENCES marketing_interactions(id) ON DELETE SET NULL,
    meta JSONB DEFAULT '{}'::jsonb,          -- Store messages and additional data
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_marketing_leads_source ON marketing_leads(source);
CREATE INDEX IF NOT EXISTS idx_marketing_leads_email ON marketing_leads(email);
CREATE INDEX IF NOT EXISTS idx_marketing_leads_phone ON marketing_leads(phone_number);
CREATE INDEX IF NOT EXISTS idx_marketing_leads_created_at ON marketing_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_interactions_campaign ON marketing_interactions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- ==========================================
-- 6. RLS POLICIES
-- ==========================================
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_leads ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active campaigns
CREATE POLICY "Allow public read access to active campaigns" ON campaigns
    FOR SELECT USING (status = 'active');

-- Allow admin full access to marketing system
CREATE POLICY "Allow admin full access to campaigns" ON campaigns
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow public to insert interactions
CREATE POLICY "Allow public to insert interactions" ON marketing_interactions
    FOR INSERT WITH CHECK (true);

-- Allow admin to view interactions
CREATE POLICY "Allow admin to view interactions" ON marketing_interactions
    FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow public to insert leads
CREATE POLICY "Allow public to insert leads" ON marketing_leads
    FOR INSERT WITH CHECK (true);

-- Allow admin to view leads
CREATE POLICY "Allow admin to view leads" ON marketing_leads
    FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- ==========================================
-- 7. DEFAULT CAMPAIGNS (Initial Seed)
-- ==========================================
INSERT INTO campaigns (name, slug, description, type, status, start_date, end_date, config)
VALUES (
    'Spin the Wheel',
    'spin-the-wheel',
    'Interactive lead generation wheel',
    'spin_wheel',
    'active',
    NOW(),
    '2099-12-31'::timestamptz,
    '{
        "weights": {
            "5% off": 40,
            "10% off": 30,
            "15% off": 20,
            "20% off": 5,
            "Try Again": 5
        },
        "trigger": {
            "delay_seconds": 5,
            "scroll_percentage": 30
        }
    }'::jsonb
),
(
    'Valentine''s Day 2026',
    'valentine-2026',
    'Romantic getaway special',
    'holiday',
    'active',
    '2026-02-10 00:00:00+00',
    '2026-02-17 23:59:59+00',
    '{
        "theme": {
            "primary": "#DC2626",
            "accent": "#FDF2F2",
            "banner": "Valentine''s Sale: 20% Off Romantic Rides!"
        },
        "promo": "VALENTINE2026",
        "discount": 20
    }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 8. VERIFICATION
-- ==========================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Marketing & CRM System Setup Complete!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Tables Created:';
    RAISE NOTICE '   ✓ campaigns';
    RAISE NOTICE '   ✓ marketing_interactions';
    RAISE NOTICE '   ✓ marketing_leads (with email & meta columns)';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 RLS Policies:';
    RAISE NOTICE '   ✓ Public can insert leads & interactions';
    RAISE NOTICE '   ✓ Admin can view all data';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Default Campaigns:';
    RAISE NOTICE '   ✓ Spin the Wheel (active)';
    RAISE NOTICE '   ✓ Valentine''s Day 2026 (active)';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Ready for CRM integration!';
    RAISE NOTICE '';
END $$;

-- Show table structures
SELECT 'marketing_leads' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'marketing_leads'
ORDER BY ordinal_position;
