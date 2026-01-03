-- Create settings table for storing application configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB,
  type VARCHAR(50) NOT NULL DEFAULT 'string', -- string, number, boolean, json
  category VARCHAR(100) NOT NULL DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on key for fast lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);

-- Insert default settings
INSERT INTO settings (key, value, type, category, description, is_public) VALUES
-- Site Information
('site_name', '"My Organization"', 'string', 'site', 'The name of your organization', true),
('site_description', '"Welcome to our organization website"', 'string', 'site', 'Brief description of your organization', true),
('site_url', '"https://example.com"', 'string', 'site', 'Your website URL', true),
('site_email', '"contact@example.com"', 'string', 'site', 'Primary contact email', true),

-- Contact Information
('contact_phone', '"", 'string', 'contact', 'Primary phone number', true),
('contact_address', '"", 'string', 'contact', 'Physical address', true),
('contact_city', '"", 'string', 'contact', 'City', true),
('contact_country', '"", 'string', 'contact', 'Country', true),

-- Social Media Links
('social_facebook', '"", 'string', 'social', 'Facebook profile URL', true),
('social_twitter', '"", 'string', 'social', 'Twitter/X profile URL', true),
('social_instagram', '"", 'string', 'social', 'Instagram profile URL', true),
('social_linkedin', '"", 'string', 'social', 'LinkedIn profile URL', true),
('social_youtube', '"", 'string', 'social', 'YouTube channel URL', true),

-- System Settings
('default_language', '"en"', 'string', 'system', 'Default language for the site', false),
('timezone', '"UTC"', 'string', 'system', 'Default timezone', false),
('maintenance_mode', 'false', 'boolean', 'system', 'Enable maintenance mode', false),

-- Content Settings
('posts_per_page', '10', 'number', 'content', 'Number of posts to display per page', false),
('enable_comments', 'true', 'boolean', 'content', 'Allow comments on posts', false),
('require_comment_approval', 'true', 'boolean', 'content', 'Require admin approval for comments', false)

ON CONFLICT (key) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER settings_updated_at_trigger
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings access
-- Allow authenticated users to read all settings
CREATE POLICY "Allow authenticated users to read settings" ON settings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admin users to manage settings
CREATE POLICY "Allow admin users to manage settings" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('admin', 'super_admin')
    )
  );

-- Allow public read access for public settings
CREATE POLICY "Allow public read access for public settings" ON settings
  FOR SELECT USING (is_public = true);
