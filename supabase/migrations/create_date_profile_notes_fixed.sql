-- =====================================================
-- CREATE DATE PROFILE NOTES TABLES (FIXED)
-- =====================================================
-- This migration creates tables for the Notes feature:
-- 1. date_profile_note_folders - Stores note folders (Important, Preferences, etc.)
-- 2. date_profile_notes - Stores individual notes within folders

-- =====================================================
-- TABLE 1: NOTE FOLDERS
-- =====================================================

CREATE TABLE IF NOT EXISTS date_profile_note_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('blue', 'yellow', 'green', 'purple', 'pink', 'orange')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique folder names per profile
  UNIQUE(profile_id, name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_note_folders_profile 
  ON date_profile_note_folders(profile_id);

CREATE INDEX IF NOT EXISTS idx_note_folders_order 
  ON date_profile_note_folders(profile_id, order_index);

-- =====================================================
-- TABLE 2: NOTES
-- =====================================================

CREATE TABLE IF NOT EXISTS date_profile_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES date_profile_note_folders(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  style TEXT DEFAULT 'default' CHECK (style IN ('default', 'important', 'love', 'idea', 'reminder')),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_profile 
  ON date_profile_notes(profile_id);

CREATE INDEX IF NOT EXISTS idx_notes_folder 
  ON date_profile_notes(folder_id);

CREATE INDEX IF NOT EXISTS idx_notes_created 
  ON date_profile_notes(profile_id, created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY - NOTE FOLDERS
-- =====================================================

-- Enable RLS
ALTER TABLE date_profile_note_folders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert own profile note folders" ON date_profile_note_folders;
DROP POLICY IF EXISTS "Users can view own profile note folders" ON date_profile_note_folders;
DROP POLICY IF EXISTS "Users can update own profile note folders" ON date_profile_note_folders;
DROP POLICY IF EXISTS "Users can delete own profile note folders" ON date_profile_note_folders;

-- INSERT
CREATE POLICY "Users can insert own profile note folders" ON date_profile_note_folders
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile note folders" ON date_profile_note_folders
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile note folders" ON date_profile_note_folders
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile note folders" ON date_profile_note_folders
  FOR DELETE
  USING (
    profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- ROW LEVEL SECURITY - NOTES
-- =====================================================

-- Enable RLS
ALTER TABLE date_profile_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert own profile notes" ON date_profile_notes;
DROP POLICY IF EXISTS "Users can view own profile notes" ON date_profile_notes;
DROP POLICY IF EXISTS "Users can update own profile notes" ON date_profile_notes;
DROP POLICY IF EXISTS "Users can delete own profile notes" ON date_profile_notes;

-- INSERT
CREATE POLICY "Users can insert own profile notes" ON date_profile_notes
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile notes" ON date_profile_notes
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile notes" ON date_profile_notes
  FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile notes" ON date_profile_notes
  FOR DELETE
  USING (
    profile_id IN (
      SELECT id FROM date_profiles WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_note_folders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS update_note_folders_updated_at_trigger ON date_profile_note_folders;
DROP TRIGGER IF EXISTS update_notes_updated_at_trigger ON date_profile_notes;

-- Create triggers
CREATE TRIGGER update_note_folders_updated_at_trigger
  BEFORE UPDATE ON date_profile_note_folders
  FOR EACH ROW
  EXECUTE FUNCTION update_note_folders_updated_at();

CREATE TRIGGER update_notes_updated_at_trigger
  BEFORE UPDATE ON date_profile_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_notes_updated_at();
