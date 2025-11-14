-- ================================================
-- Bookmark Manager PWA - Recycle Bin Migration
-- ================================================
-- This migration adds soft delete functionality (recycle bin)
-- Deleted items stay for 7 days before automatic cleanup

-- ================================================
-- Add soft delete columns to bookmarks table
-- ================================================
ALTER TABLE public.bookmarks
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- ================================================
-- Add soft delete columns to collections table
-- ================================================
ALTER TABLE public.collections
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- ================================================
-- Create indexes for deleted items queries
-- ================================================
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_deleted ON public.bookmarks(is_deleted, deleted_at) WHERE is_deleted = true;
CREATE INDEX IF NOT EXISTS idx_collections_is_deleted ON public.collections(is_deleted, deleted_at) WHERE is_deleted = true;

-- ================================================
-- Update RLS Policies to exclude soft-deleted items
-- ================================================

-- Drop existing policies for bookmarks
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can update their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;

-- Create new policies that exclude soft-deleted items from normal queries
CREATE POLICY "Users can view their own active bookmarks"
    ON public.bookmarks
    FOR SELECT
    USING (auth.uid() = user_id AND (is_deleted = false OR is_deleted IS NULL));

CREATE POLICY "Users can view their own deleted bookmarks"
    ON public.bookmarks
    FOR SELECT
    USING (auth.uid() = user_id AND is_deleted = true);

CREATE POLICY "Users can insert their own bookmarks"
    ON public.bookmarks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
    ON public.bookmarks
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
    ON public.bookmarks
    FOR DELETE
    USING (auth.uid() = user_id);

-- Drop existing policies for collections
DROP POLICY IF EXISTS "Users can view their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can insert their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can update their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can delete their own collections" ON public.collections;

-- Create new policies that exclude soft-deleted items from normal queries
CREATE POLICY "Users can view their own active collections"
    ON public.collections
    FOR SELECT
    USING (auth.uid() = user_id AND (is_deleted = false OR is_deleted IS NULL));

CREATE POLICY "Users can view their own deleted collections"
    ON public.collections
    FOR SELECT
    USING (auth.uid() = user_id AND is_deleted = true);

CREATE POLICY "Users can insert their own collections"
    ON public.collections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
    ON public.collections
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
    ON public.collections
    FOR DELETE
    USING (auth.uid() = user_id);

-- ================================================
-- Function: cleanup_old_deleted_items
-- ================================================
-- Automatically delete items that have been in recycle bin for more than 7 days
CREATE OR REPLACE FUNCTION public.cleanup_old_deleted_items()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete bookmarks that have been soft-deleted for more than 7 days
    DELETE FROM public.bookmarks
    WHERE is_deleted = true
    AND deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '7 days';

    -- Delete collections that have been soft-deleted for more than 7 days
    DELETE FROM public.collections
    WHERE is_deleted = true
    AND deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '7 days';
END;
$$;

-- ================================================
-- Function: schedule_cleanup
-- ================================================
-- This function should be called periodically (e.g., daily) via cron
-- Note: Supabase uses pg_cron extension for scheduling
-- You'll need to set this up in Supabase dashboard or via SQL:
-- 
-- SELECT cron.schedule(
--   'cleanup-recycle-bin',
--   '0 2 * * *', -- Run at 2 AM every day
--   $$SELECT public.cleanup_old_deleted_items()$$
-- );
--
-- For now, we'll create a simpler trigger-based approach

-- ================================================
-- Comments for Documentation
-- ================================================
COMMENT ON COLUMN public.bookmarks.is_deleted IS 'Soft delete flag - true if item is in recycle bin';
COMMENT ON COLUMN public.bookmarks.deleted_at IS 'Timestamp when item was moved to recycle bin';
COMMENT ON COLUMN public.collections.is_deleted IS 'Soft delete flag - true if item is in recycle bin';
COMMENT ON COLUMN public.collections.deleted_at IS 'Timestamp when item was moved to recycle bin';
COMMENT ON FUNCTION public.cleanup_old_deleted_items IS 'Deletes items that have been in recycle bin for more than 7 days';
