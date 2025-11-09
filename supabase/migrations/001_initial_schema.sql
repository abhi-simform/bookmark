-- ================================================
-- Bookmark Manager PWA - Initial Database Schema
-- ================================================
-- This migration creates the core tables for the bookmark management system
-- Tables: bookmarks, collections
-- Features: User isolation, foreign key constraints, timestamps

-- ================================================
-- Table: collections
-- ================================================
-- Stores user-created bookmark collections/folders
CREATE TABLE IF NOT EXISTS public.collections (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6366f1'::text,
    icon TEXT DEFAULT 'folder'::text,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_modified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- Table: bookmarks
-- ================================================
-- Stores user bookmarks with metadata and organization
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    collection_id TEXT REFERENCES public.collections(id) ON DELETE SET NULL,
    favicon TEXT,
    is_favorite BOOLEAN DEFAULT false,
    type TEXT DEFAULT 'link'::text,
    platform TEXT DEFAULT 'web'::text,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_modified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- Indexes for Performance
-- ================================================
-- Index for user_id lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);

-- Index for collection_id lookups
CREATE INDEX IF NOT EXISTS idx_bookmarks_collection_id ON public.bookmarks(collection_id);

-- Index for favorite bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_favorite ON public.bookmarks(is_favorite) WHERE is_favorite = true;

-- Index for timestamp-based queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON public.bookmarks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collections_order ON public.collections("order");

-- ================================================
-- Enable Row Level Security
-- ================================================
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- ================================================
-- RLS Policies for bookmarks
-- ================================================
-- Users can only view their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
    ON public.bookmarks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can only insert bookmarks for themselves
CREATE POLICY "Users can insert their own bookmarks"
    ON public.bookmarks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own bookmarks
CREATE POLICY "Users can update their own bookmarks"
    ON public.bookmarks
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can only delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
    ON public.bookmarks
    FOR DELETE
    USING (auth.uid() = user_id);

-- ================================================
-- RLS Policies for collections
-- ================================================
-- Users can only view their own collections
CREATE POLICY "Users can view their own collections"
    ON public.collections
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can only insert collections for themselves
CREATE POLICY "Users can insert their own collections"
    ON public.collections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own collections
CREATE POLICY "Users can update their own collections"
    ON public.collections
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can only delete their own collections
CREATE POLICY "Users can delete their own collections"
    ON public.collections
    FOR DELETE
    USING (auth.uid() = user_id);

-- ================================================
-- Function: create_default_collection
-- ================================================
-- Automatically creates a default "Miscellaneous" collection for new users
CREATE OR REPLACE FUNCTION public.create_default_collection()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.collections (id, user_id, name, description, "order")
    VALUES (
        gen_random_uuid()::text,
        NEW.id,
        'Miscellaneous',
        'Default collection for all bookmarks',
        0
    );
    RETURN NEW;
END;
$$;

-- ================================================
-- Trigger: Create default collection on user signup
-- ================================================
CREATE TRIGGER on_user_created_default_collection
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_default_collection();

-- ================================================
-- Comments for Documentation
-- ================================================
COMMENT ON TABLE public.bookmarks IS 'Stores user bookmarks with metadata and organization';
COMMENT ON TABLE public.collections IS 'Stores user-created bookmark collections/folders';
COMMENT ON COLUMN public.bookmarks.user_id IS 'References the auth.users table, ensures user isolation';
COMMENT ON COLUMN public.bookmarks.collection_id IS 'Optional reference to collections table for organization';
COMMENT ON COLUMN public.bookmarks.last_modified_at IS 'Used for sync conflict resolution (newest wins)';
COMMENT ON COLUMN public.collections.last_modified_at IS 'Used for sync conflict resolution (newest wins)';
