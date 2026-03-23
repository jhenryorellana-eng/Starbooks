-- Add enrollment tracking fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enrollment_status TEXT DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hub_user_id TEXT DEFAULT NULL;

-- Index for quick enrollment checks
CREATE INDEX IF NOT EXISTS idx_profiles_enrollment_status ON profiles(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_profiles_hub_user_id ON profiles(hub_user_id);
