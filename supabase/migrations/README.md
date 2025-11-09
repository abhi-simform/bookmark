# 📚 Database Migrations

This directory contains SQL migration files for the Bookmark Manager PWA database schema.

---

## 🗂️ Migration Files

### `001_initial_schema.sql`

**Complete database schema** including:
- ✅ **bookmarks** table - Stores user bookmarks with metadata
- ✅ **collections** table - Organizes bookmarks into folders
- ✅ **Row Level Security (RLS)** - User data isolation policies
- ✅ **Indexes** - Performance optimization for queries
- ✅ **Triggers** - Auto-create default collection for new users

**When to use:** Run this once when setting up a new Supabase project.

---

## 🚀 How to Run Migrations

### Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the contents of `001_initial_schema.sql`
5. Click **"Run"** (or press `Ctrl/Cmd + Enter`)
6. You should see: ✅ "Success. No rows returned"

### Method 2: Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

---

## ✅ Verification

After running migrations, verify everything is set up correctly:

### Check Tables Exist

```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected output:**
- `bookmarks`
- `collections`

### Check RLS is Enabled

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Both tables should show:** `rowsecurity = true`

### Check Policies Exist

```sql
-- List all RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected: 8 policies total** (4 for bookmarks, 4 for collections):
- Users can view their own [bookmarks/collections]
- Users can insert their own [bookmarks/collections]
- Users can update their own [bookmarks/collections]
- Users can delete their own [bookmarks/collections]

### Check Indexes Exist

```sql
-- List all indexes
SELECT 
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Check Trigger Exists

```sql
-- List triggers
SELECT 
    event_object_table as table_name,
    trigger_name
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

**Expected:** `on_user_created` trigger on `auth.users` table

---

## 📊 Schema Overview

### Relationships

```
auth.users (Supabase Auth)
    ├── bookmarks (user_id) - CASCADE DELETE
    └── collections (user_id) - CASCADE DELETE
        └── bookmarks (collection_id) - SET NULL
```

**What this means:**
- When a user is deleted, all their bookmarks and collections are automatically deleted
- When a collection is deleted, bookmarks in that collection have `collection_id` set to NULL

### Tables

| Table | Rows (approx) | Purpose |
|-------|---------------|---------|
| `bookmarks` | Varies by user | Stores all user bookmarks |
| `collections` | Varies by user | Organizes bookmarks into folders |

### Key Features

#### Bookmarks Table
- 🔐 User isolation via RLS
- 🔗 Links to collections
- ⭐ Favorite marking
- 🏷️ Tag support (array)
- 📅 Automatic timestamps
- 🌐 URL metadata (favicon, type, platform)

#### Collections Table
- 🔐 User isolation via RLS
- 🎨 Customizable (icon + color)
- 📊 Sortable (order field)
- 📅 Automatic timestamps
- 🗂️ Default collection auto-created

---

## 🐛 Troubleshooting

### Issue: "permission denied for schema auth"
**Solution:** This is expected. The trigger references `auth.users` which is in the `auth` schema. The migration script handles this correctly with `SECURITY DEFINER`.

### Issue: "relation already exists"
**Solution:** Tables already exist. This is fine - the migration uses `IF NOT EXISTS` clauses.

### Issue: "could not create unique index"
**Solution:** There might be duplicate data. Either:
1. Clear the tables first, or
2. Remove duplicates manually

### Issue: RLS policies blocking queries
**Solution:**
- Ensure you're authenticated (`auth.uid()` should return your user ID)
- Check policies are created correctly
- Test with: `SELECT auth.uid();` - should return your UUID

---

## 🔄 Modifying the Schema

### Adding a New Column

1. **Create a new migration file:**
   ```sql
   -- File: 002_add_notes_column.sql
   
   -- Add notes column to bookmarks
   ALTER TABLE bookmarks 
   ADD COLUMN IF NOT EXISTS notes TEXT;
   ```

2. **Run in Supabase SQL Editor**

3. **Update TypeScript types:**
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
   ```

### Creating a New Table

1. **Create migration file** with:
   - Table definition
   - RLS policies
   - Indexes
   - Foreign keys

2. **Follow the pattern** from `001_initial_schema.sql`

3. **Always use:**
   - `IF NOT EXISTS` clauses
   - `ON DELETE CASCADE` or `ON DELETE SET NULL`
   - Proper indexes for foreign keys
   - RLS policies for user data

---

## 📚 Migration Best Practices

1. ✅ **Use IF NOT EXISTS** - Makes migrations idempotent
2. ✅ **Add comments** - Explain what each section does
3. ✅ **Test locally first** - Use Supabase CLI or local instance
4. ✅ **Create indexes** - For foreign keys and common queries
5. ✅ **Enable RLS** - Always for user data
6. ✅ **Use transactions** - Wrap complex migrations in BEGIN/COMMIT
7. ✅ **Document changes** - Update this README for new migrations
8. ✅ **Version control** - Commit migration files to Git
9. ✅ **Sequential naming** - Use `001_`, `002_`, etc.
10. ✅ **Backup first** - Before running on production

---

## 📖 Additional Resources

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)

---

**Questions?** Open an issue on GitHub!
