/*
  Adriatic Bay Exotics - Notification Preferences
  Module: 5.5
  Description: Table to store user notification opt-in/out settings.
*/

-- 1. Create table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email TEXT UNIQUE NOT NULL,
    email_transactional BOOLEAN DEFAULT TRUE,
    email_promotional BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE, -- SMS is optional/recommended but not currently used as per request
    marketing_consent BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexing
CREATE INDEX IF NOT EXISTS idx_notif_pref_email ON notification_preferences(customer_email);

-- 3. RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notification preferences"
ON notification_preferences FOR ALL
TO authenticated
USING (customer_email = auth.jwt() ->> 'email')
WITH CHECK (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Admins have full access to notification preferences"
ON notification_preferences FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');

-- 4. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_notification_preferences_updated_at
BEFORE UPDATE ON notification_preferences
FOR EACH ROW
EXECUTE FUNCTION update_notification_preferences_updated_at();
