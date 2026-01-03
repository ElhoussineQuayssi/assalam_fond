-- Add onboarding tracking columns to admins table
ALTER TABLE admins
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN admins.onboarding_completed IS 'Tracks if admin has completed onboarding';
COMMENT ON COLUMN admins.onboarding_step IS 'Current step in onboarding process (0-100)';
COMMENT ON COLUMN admins.onboarding_data IS 'JSON data storing onboarding preferences and progress';
