# Recycle Bin Feature

## Overview

The recycle bin feature provides a safety net for deleted bookmarks and collections. Instead of permanently deleting items immediately, they are moved to a recycle bin where they remain for 7 days before being automatically removed.

## Features

### Soft Delete
- When you delete a bookmark or collection, it's marked as deleted (`is_deleted = true`) with a timestamp (`deleted_at`)
- Items remain in the database but are hidden from normal views
- The original data is preserved for potential recovery

### Auto-Cleanup
- Items in the recycle bin are automatically deleted after 7 days
- Cleanup runs when the app starts
- A database function is available for server-side cleanup (see migration file)

### Restore Functionality
- Users can restore any item from the recycle bin
- Restored items return to their original location
- Collections can be restored with a single click

### Visual Indicators
- Recycle bin shows remaining days before permanent deletion
- Color-coded warnings help users understand urgency
- Tab interface separates bookmarks and collections

## Database Schema Changes

### New Columns
Both `bookmarks` and `collections` tables have these new fields:
- `is_deleted` (boolean): Indicates if item is in recycle bin
- `deleted_at` (timestamp): When item was moved to recycle bin

### RLS Policies
Updated Row Level Security policies to:
- Exclude soft-deleted items from normal queries
- Allow viewing deleted items only for recycle bin
- Maintain user isolation for deleted items

### Auto-Cleanup Function
A PostgreSQL function `cleanup_old_deleted_items()` permanently removes items older than 7 days:

```sql
DELETE FROM public.bookmarks
WHERE is_deleted = true
AND deleted_at < NOW() - INTERVAL '7 days';
```

## Implementation Details

### Local Storage (IndexedDB)
- `getAllBookmarks()` filters out deleted items
- `getDeletedBookmarks()` returns only deleted items
- `deleteBookmark()` performs soft delete
- `restoreBookmark()` unmarks deleted items
- `permanentlyDeleteBookmark()` performs hard delete

### Cloud Sync
- Soft delete state syncs between devices
- Deleted items sync to all user's devices
- Auto-cleanup happens independently on each device
- Server-side cleanup can be scheduled via pg_cron

### User Interface
- New "Recycle Bin" page accessible from Profile menu
- Shows deleted bookmarks and collections in tabs
- Actions: Restore, Permanent Delete, Empty Bin
- Displays days remaining for each item

## Usage

### Accessing Recycle Bin
1. Go to Profile page
2. Click "Recycle Bin" button
3. View deleted items in tabs

### Restoring Items
1. Open Recycle Bin
2. Find the item to restore
3. Click the restore icon (⟳)
4. Item returns to original location

### Permanent Deletion
1. Open Recycle Bin
2. Click trash icon on individual item
3. Confirm permanent deletion
4. OR click "Empty Bin" to delete all items

### Collection Deletion
When a collection is deleted:
- Collection is soft-deleted
- All bookmarks in that collection are also soft-deleted
- Restoring the collection does NOT auto-restore bookmarks
- Each bookmark must be restored individually

## Server-Side Auto-Cleanup (Optional)

To enable automatic server-side cleanup in Supabase:

1. Ensure pg_cron extension is enabled
2. Run this SQL in Supabase dashboard:

```sql
SELECT cron.schedule(
  'cleanup-recycle-bin',
  '0 2 * * *', -- Run at 2 AM every day
  $$SELECT public.cleanup_old_deleted_items()$$
);
```

This will automatically clean up old deleted items daily.

## Migration

To add recycle bin to an existing installation:

1. Run the migration: `supabase/migrations/002_add_recycle_bin.sql`
2. Existing items will have `is_deleted = false` (or NULL)
3. No data loss occurs - all existing items remain active
4. New deletions will use soft delete

## Technical Notes

- Local cleanup runs on app startup via `db.cleanupOldDeletedItems()`
- Cloud cleanup should be scheduled via cron for best results
- Items older than 7 days at startup are permanently removed
- Sync service handles both active and deleted items
- Database indexes optimize deleted item queries

## Testing

To test the recycle bin:
1. Delete a bookmark or collection
2. Check Recycle Bin - item should appear
3. Restore the item - it returns to original location
4. Delete again and wait 7 days (or modify timestamp)
5. Start app - old item should be permanently removed

## Future Enhancements

Potential improvements:
- Configurable retention period
- Bulk restore operations
- Search within recycle bin
- Export deleted items before permanent removal
- Admin panel for managing retention policies
