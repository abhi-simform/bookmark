-- Migration: Remove default collection auto-creation
-- This migration removes the trigger and function that automatically creates
-- a "Miscellaneous" collection for new users. Users will now need to create
-- collections manually.

-- Drop the trigger first
DROP TRIGGER IF EXISTS on_user_created_default_collection ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS create_default_collection();
