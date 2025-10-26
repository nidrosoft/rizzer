-- =====================================================
-- Add Archived Column to Date Profiles Table
-- =====================================================
-- This migration adds the archived column to date_profiles
-- to support archiving profiles instead of deleting them
-- =====================================================

-- Add archived column to date_profiles table
ALTER TABLE public.date_profiles 
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;

-- Create index for faster queries filtering by archived status
CREATE INDEX IF NOT EXISTS idx_date_profiles_archived 
ON public.date_profiles(user_id, archived);

-- Add comment
COMMENT ON COLUMN public.date_profiles.archived IS 'Whether this profile has been archived by the user';

-- Update existing profiles to not be archived
UPDATE public.date_profiles 
SET archived = FALSE 
WHERE archived IS NULL;
