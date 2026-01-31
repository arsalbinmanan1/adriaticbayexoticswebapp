-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read-only access to settings" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to settings" ON settings
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Insert default settings
INSERT INTO settings (key, value) VALUES
('company_info', '{"name": "Adriatic Bay Exotics", "email": "info@adriaticbayexotics.com", "phone": "+1 (555) 000-0000", "address": "123 Luxury Way, Miami, FL"}'::jsonb),
('business_hours', '{"monday": "9am - 8pm", "tuesday": "9am - 8pm", "wednesday": "9am - 8pm", "thursday": "9am - 8pm", "friday": "9am - 9pm", "saturday": "10am - 9pm", "sunday": "10am - 6pm"}'::jsonb),
('pricing_config', '{"tax_rate": 7, "security_deposit_percentage": 10}'::jsonb)
ON CONFLICT (key) DO NOTHING;
