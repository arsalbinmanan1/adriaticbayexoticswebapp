-- ==========================================
-- ADMIN USERS TABLE SETUP
-- Creates admin_users table and default admin account
-- ==========================================

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin-only access policy
CREATE POLICY "Admin-only access to admin_users" ON admin_users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create default admin user
-- Username: admin
-- Password: admin123
-- Bcrypt hash generated with: bcrypt.hash('admin123', 10)
INSERT INTO admin_users (username, email, password_hash, full_name)
VALUES (
    'admin',
    'admin@adriaticbayexotics.com',
    '$2b$10$pw2JyqWP907EmOyshsqzVeOTRXD4YS75tM.wh2CfDp8orxKCaYrym',
    'System Administrator'
)
ON CONFLICT (username) DO NOTHING;

-- Verify admin user was created
SELECT 
    username,
    email,
    full_name,
    is_active,
    created_at
FROM admin_users
WHERE username = 'admin';
