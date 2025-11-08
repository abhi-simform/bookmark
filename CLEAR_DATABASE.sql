-- ⚠️ WARNING: This script will DELETE ALL DATA from your database
-- This includes all users, bookmarks, collections, and tags
-- Use with caution!

-- Delete all data from tables (if they exist)
DO $$ 
BEGIN
    -- Delete all bookmarks
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookmarks') THEN
        DELETE FROM public.bookmarks;
    END IF;

    -- Delete all collections
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'collections') THEN
        DELETE FROM public.collections;
    END IF;

    -- Delete all tags
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tags') THEN
        DELETE FROM public.tags;
    END IF;
END $$;

-- Drop tables if they exist (from approval system)
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;

-- Drop the view if it exists
DROP VIEW IF EXISTS public.users_pending_approval;

-- Drop the trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Delete all users from auth.users
-- Note: This requires direct access to the auth schema
-- You may need to run this in the SQL Editor with elevated permissions
DELETE FROM auth.users;

-- Reset sequences (optional - makes IDs start from 1 again)
-- Note: Only if you have sequences, Supabase typically uses UUIDs

-- Verify everything is cleared
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookmarks') THEN
        RAISE NOTICE 'Bookmarks count: %', (SELECT COUNT(*) FROM public.bookmarks);
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'collections') THEN
        RAISE NOTICE 'Collections count: %', (SELECT COUNT(*) FROM public.collections);
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tags') THEN
        RAISE NOTICE 'Tags count: %', (SELECT COUNT(*) FROM public.tags);
    END IF;

    RAISE NOTICE 'Users count: %', (SELECT COUNT(*) FROM auth.users);
END $$;
