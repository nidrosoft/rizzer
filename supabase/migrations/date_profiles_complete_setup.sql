-- =====================================================
-- Date Profiles Complete Setup Migration
-- =====================================================
-- This migration:
-- 1. Adds missing columns to date_profiles table
-- 2. Creates RLS policies for all date profile tables
-- 3. Ensures users can fully manage their date profiles
-- =====================================================

-- =====================================================
-- 1. UPDATE date_profiles TABLE STRUCTURE
-- =====================================================

-- Add new columns if they don't exist
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS zodiac_sign VARCHAR(20);
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS occupation VARCHAR(255);
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS height INTEGER; -- in cm
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS love_language VARCHAR(50);
ALTER TABLE date_profiles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_date_profiles_user_id ON date_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_date_profiles_status ON date_profiles(status);
CREATE INDEX IF NOT EXISTS idx_date_profiles_created_at ON date_profiles(created_at DESC);

-- =====================================================
-- 2. ENABLE RLS ON ALL DATE PROFILE TABLES
-- =====================================================

ALTER TABLE date_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_profile_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_profile_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_profile_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_profile_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_profile_important_dates ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. DROP EXISTING POLICIES (IF ANY)
-- =====================================================

-- date_profiles
DROP POLICY IF EXISTS "Users can insert own date profiles" ON date_profiles;
DROP POLICY IF EXISTS "Users can view own date profiles" ON date_profiles;
DROP POLICY IF EXISTS "Users can update own date profiles" ON date_profiles;
DROP POLICY IF EXISTS "Users can delete own date profiles" ON date_profiles;

-- date_profile_photos
DROP POLICY IF EXISTS "Users can insert own profile photos" ON date_profile_photos;
DROP POLICY IF EXISTS "Users can view own profile photos" ON date_profile_photos;
DROP POLICY IF EXISTS "Users can update own profile photos" ON date_profile_photos;
DROP POLICY IF EXISTS "Users can delete own profile photos" ON date_profile_photos;

-- date_profile_interests
DROP POLICY IF EXISTS "Users can insert own profile interests" ON date_profile_interests;
DROP POLICY IF EXISTS "Users can view own profile interests" ON date_profile_interests;
DROP POLICY IF EXISTS "Users can update own profile interests" ON date_profile_interests;
DROP POLICY IF EXISTS "Users can delete own profile interests" ON date_profile_interests;

-- date_profile_notes
DROP POLICY IF EXISTS "Users can insert own profile notes" ON date_profile_notes;
DROP POLICY IF EXISTS "Users can view own profile notes" ON date_profile_notes;
DROP POLICY IF EXISTS "Users can update own profile notes" ON date_profile_notes;
DROP POLICY IF EXISTS "Users can delete own profile notes" ON date_profile_notes;

-- date_profile_dates
DROP POLICY IF EXISTS "Users can insert own profile dates" ON date_profile_dates;
DROP POLICY IF EXISTS "Users can view own profile dates" ON date_profile_dates;
DROP POLICY IF EXISTS "Users can update own profile dates" ON date_profile_dates;
DROP POLICY IF EXISTS "Users can delete own profile dates" ON date_profile_dates;

-- date_profile_memories
DROP POLICY IF EXISTS "Users can insert own profile memories" ON date_profile_memories;
DROP POLICY IF EXISTS "Users can view own profile memories" ON date_profile_memories;
DROP POLICY IF EXISTS "Users can update own profile memories" ON date_profile_memories;
DROP POLICY IF EXISTS "Users can delete own profile memories" ON date_profile_memories;

-- date_profile_important_dates
DROP POLICY IF EXISTS "Users can insert own profile important dates" ON date_profile_important_dates;
DROP POLICY IF EXISTS "Users can view own profile important dates" ON date_profile_important_dates;
DROP POLICY IF EXISTS "Users can update own profile important dates" ON date_profile_important_dates;
DROP POLICY IF EXISTS "Users can delete own profile important dates" ON date_profile_important_dates;

-- =====================================================
-- 4. CREATE RLS POLICIES FOR date_profiles
-- =====================================================

-- INSERT: Users can create their own date profiles
CREATE POLICY "Users can insert own date profiles" ON date_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can view their own date profiles
CREATE POLICY "Users can view own date profiles" ON date_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- UPDATE: Users can update their own date profiles
CREATE POLICY "Users can update own date profiles" ON date_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Users can delete their own date profiles
CREATE POLICY "Users can delete own date profiles" ON date_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. CREATE RLS POLICIES FOR date_profile_photos
-- =====================================================

-- INSERT
CREATE POLICY "Users can insert own profile photos" ON date_profile_photos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_photos.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile photos" ON date_profile_photos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_photos.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile photos" ON date_profile_photos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_photos.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile photos" ON date_profile_photos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_photos.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- 6. CREATE RLS POLICIES FOR date_profile_interests
-- =====================================================

-- INSERT
CREATE POLICY "Users can insert own profile interests" ON date_profile_interests
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_interests.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile interests" ON date_profile_interests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_interests.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile interests" ON date_profile_interests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_interests.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile interests" ON date_profile_interests
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_interests.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- 7. CREATE RLS POLICIES FOR date_profile_notes
-- =====================================================

-- INSERT
CREATE POLICY "Users can insert own profile notes" ON date_profile_notes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_notes.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile notes" ON date_profile_notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_notes.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile notes" ON date_profile_notes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_notes.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile notes" ON date_profile_notes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_notes.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- 8. CREATE RLS POLICIES FOR date_profile_dates
-- =====================================================

-- INSERT
CREATE POLICY "Users can insert own profile dates" ON date_profile_dates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_dates.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile dates" ON date_profile_dates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_dates.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile dates" ON date_profile_dates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_dates.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile dates" ON date_profile_dates
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_dates.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- 9. CREATE RLS POLICIES FOR date_profile_memories
-- =====================================================

-- INSERT
CREATE POLICY "Users can insert own profile memories" ON date_profile_memories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_memories.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile memories" ON date_profile_memories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_memories.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile memories" ON date_profile_memories
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_memories.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile memories" ON date_profile_memories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_memories.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- 10. CREATE RLS POLICIES FOR date_profile_important_dates
-- =====================================================

-- INSERT
CREATE POLICY "Users can insert own profile important dates" ON date_profile_important_dates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_important_dates.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile important dates" ON date_profile_important_dates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_important_dates.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile important dates" ON date_profile_important_dates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_important_dates.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile important dates" ON date_profile_important_dates
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_important_dates.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- 11. CREATE HELPER FUNCTION FOR ZODIAC SIGN
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_zodiac_sign(birth_date DATE)
RETURNS VARCHAR(20) AS $$
DECLARE
  month INT;
  day INT;
BEGIN
  month := EXTRACT(MONTH FROM birth_date);
  day := EXTRACT(DAY FROM birth_date);
  
  IF (month = 3 AND day >= 21) OR (month = 4 AND day <= 19) THEN RETURN 'Aries';
  ELSIF (month = 4 AND day >= 20) OR (month = 5 AND day <= 20) THEN RETURN 'Taurus';
  ELSIF (month = 5 AND day >= 21) OR (month = 6 AND day <= 20) THEN RETURN 'Gemini';
  ELSIF (month = 6 AND day >= 21) OR (month = 7 AND day <= 22) THEN RETURN 'Cancer';
  ELSIF (month = 7 AND day >= 23) OR (month = 8 AND day <= 22) THEN RETURN 'Leo';
  ELSIF (month = 8 AND day >= 23) OR (month = 9 AND day <= 22) THEN RETURN 'Virgo';
  ELSIF (month = 9 AND day >= 23) OR (month = 10 AND day <= 22) THEN RETURN 'Libra';
  ELSIF (month = 10 AND day >= 23) OR (month = 11 AND day <= 21) THEN RETURN 'Scorpio';
  ELSIF (month = 11 AND day >= 22) OR (month = 12 AND day <= 21) THEN RETURN 'Sagittarius';
  ELSIF (month = 12 AND day >= 22) OR (month = 1 AND day <= 19) THEN RETURN 'Capricorn';
  ELSIF (month = 1 AND day >= 20) OR (month = 2 AND day <= 18) THEN RETURN 'Aquarius';
  ELSE RETURN 'Pisces';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- 12. CREATE TRIGGER TO AUTO-CALCULATE ZODIAC SIGN
-- =====================================================

CREATE OR REPLACE FUNCTION update_zodiac_sign()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.date_of_birth IS NOT NULL THEN
    NEW.zodiac_sign := calculate_zodiac_sign(NEW.date_of_birth);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_zodiac_sign ON date_profiles;

CREATE TRIGGER trigger_update_zodiac_sign
  BEFORE INSERT OR UPDATE OF date_of_birth ON date_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_zodiac_sign();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'date_profile%';

-- Verify policies exist
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename LIKE 'date_profile%'
ORDER BY tablename, cmd;
