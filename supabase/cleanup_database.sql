-- ============================================
-- CLEANUP: REMOVE USER APPROVAL & ARCHIVE FEATURES
-- ============================================
-- Run these commands in Supabase SQL Editor

-- ============================================
-- PART 1: REMOVE USER APPROVAL SYSTEM
-- ============================================
-- Step 1: Drop the trigger that auto-creates user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop the function that creates user profiles
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Drop the admins table
DROP TABLE IF EXISTS public.admins CASCADE;

-- Step 4: Drop the user_profiles table
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- ============================================
-- PART 2: REMOVE ARCHIVE FEATURE
-- ============================================
-- Step 5: Drop the is_archived index
DROP INDEX IF EXISTS public.idx_bookmarks_is_archived;

-- Step 6: Remove is_archived column from bookmarks table
ALTER TABLE public.bookmarks 
DROP COLUMN IF EXISTS is_archived;

-- ============================================
-- VERIFICATION
-- ============================================
-- Check remaining tables (should only show bookmarks and collections)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check remaining columns in bookmarks table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'bookmarks'
ORDER BY ordinal_position;

-- Check for any remaining triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- ============================================
-- NOTES
-- ============================================
-- After running these commands:
-- 1. Users can sign up directly without approval
-- 2. Archive feature has been removed from bookmarks
-- 3. Only bookmarks and collections tables remain
-- 4. All RLS policies for user data isolation remain intact
