-- Remove all system rizz categories
-- Users will create their own categories from scratch

DELETE FROM rizz_categories WHERE is_system = true;

-- Update RLS policies to ensure users only see their own categories
-- (No system categories anymore)
