-- =====================================================
-- CREATE DATE PROFILE FAVORITES TABLE
-- =====================================================
-- This table stores favorite things for each date profile
-- (e.g., favorite color, restaurant, music, etc.)

CREATE TABLE IF NOT EXISTS date_profile_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_favorites_profile_id ON date_profile_favorites(profile_id);

-- Enable RLS
ALTER TABLE date_profile_favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert own profile favorites" ON date_profile_favorites;
DROP POLICY IF EXISTS "Users can view own profile favorites" ON date_profile_favorites;
DROP POLICY IF EXISTS "Users can update own profile favorites" ON date_profile_favorites;
DROP POLICY IF EXISTS "Users can delete own profile favorites" ON date_profile_favorites;

-- RLS Policies
-- Users can only access favorites for their own date profiles

-- INSERT
CREATE POLICY "Users can insert own profile favorites" ON date_profile_favorites
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_favorites.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile favorites" ON date_profile_favorites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_favorites.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile favorites" ON date_profile_favorites
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_favorites.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile favorites" ON date_profile_favorites
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_favorites.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_date_profile_favorites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_date_profile_favorites_updated_at_trigger ON date_profile_favorites;

CREATE TRIGGER update_date_profile_favorites_updated_at_trigger
  BEFORE UPDATE ON date_profile_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_date_profile_favorites_updated_at();
