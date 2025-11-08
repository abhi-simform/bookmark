-- =====================================================
-- SUPABASE TABLES SETUP - Run this FIRST
-- =====================================================
-- This creates the tables for bookmarks and collections
-- Make sure to run this in Supabase SQL Editor

-- Drop existing tables if they exist (CAUTION: This will delete data!)
-- DROP TABLE IF EXISTS public.tags CASCADE;
-- DROP TABLE IF EXISTS public.bookmarks CASCADE;
-- DROP TABLE IF EXISTS public.collections CASCADE;

-- =====================================================
-- 1. COLLECTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT DEFAULT '#6366f1',
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_modified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_name ON public.collections(name);

-- Enable Row Level Security
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collections
DROP POLICY IF EXISTS "Users can view their own collections" ON public.collections;
CREATE POLICY "Users can view their own collections"
  ON public.collections FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own collections" ON public.collections;
CREATE POLICY "Users can insert their own collections"
  ON public.collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own collections" ON public.collections;
CREATE POLICY "Users can update their own collections"
  ON public.collections FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own collections" ON public.collections;
CREATE POLICY "Users can delete their own collections"
  ON public.collections FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 2. BOOKMARKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  collection_id TEXT REFERENCES public.collections(id) ON DELETE SET NULL,
  favicon TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  type TEXT DEFAULT 'link',
  platform TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_modified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_collection_id ON public.bookmarks(collection_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_url ON public.bookmarks(url);
CREATE INDEX IF NOT EXISTS idx_bookmarks_favorite ON public.bookmarks(is_favorite);
CREATE INDEX IF NOT EXISTS idx_bookmarks_archived ON public.bookmarks(is_archived);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmarks
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert their own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can update their own bookmarks"
  ON public.bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. TAGS TABLE (Optional - for future use)
-- =====================================================
-- Note: Tags are for future enhancement. Commenting out for now
-- since we're not using them yet and they add complexity.
-- Uncomment when ready to implement tags feature.

/*
CREATE TABLE IF NOT EXISTS public.tags (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bookmark_id TEXT REFERENCES public.bookmarks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON public.tags(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_bookmark_id ON public.tags(bookmark_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags(name);

-- Enable Row Level Security
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tags
DROP POLICY IF EXISTS "Users can view their own tags" ON public.tags;
CREATE POLICY "Users can view their own tags"
  ON public.tags FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tags" ON public.tags;
CREATE POLICY "Users can insert their own tags"
  ON public.tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tags" ON public.tags;
CREATE POLICY "Users can delete their own tags"
  ON public.tags FOR DELETE
  USING (auth.uid() = user_id);
*/

-- =====================================================
-- 4. TRIGGER FOR DEFAULT COLLECTION
-- =====================================================
-- This creates a "Miscellaneous" collection for new users

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert the default "Miscellaneous" collection for the new user
  INSERT INTO public.collections (id, user_id, name, description, color, "order")
  VALUES (
    'misc_' || NEW.id,
    NEW.id,
    'Miscellaneous',
    'Default collection for uncategorized bookmarks',
    '#6366f1',
    0
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail user creation
    RAISE WARNING 'Failed to create default collection for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify everything is set up correctly

-- Check if tables exist (should show 2 tables: collections and bookmarks)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('collections', 'bookmarks');

-- Check if RLS is enabled (should all be true)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('bookmarks', 'collections');

-- Check if policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- =====================================================
-- SUCCESS!
-- =====================================================
-- If you see the tables and policies above, you're all set!
-- Now try adding a bookmark in your app and check here:
-- SELECT * FROM public.bookmarks;
-- SELECT * FROM public.collections;
