-- =====================================================
-- Add Email Column to Users Table
-- =====================================================
-- This migration adds the email column to the users table
-- so users can sign in with email during onboarding
-- =====================================================

-- Add email column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Add comment
COMMENT ON COLUMN public.users.email IS 'User email address for backup sign-in';
