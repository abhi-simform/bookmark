-- Migration: Remove type and platform from bookmarks
-- This migration removes the type and platform columns from the bookmarks table

-- Drop the columns
ALTER TABLE public.bookmarks DROP COLUMN IF EXISTS type;
ALTER TABLE public.bookmarks DROP COLUMN IF EXISTS platform;
