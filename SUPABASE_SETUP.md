# 🗄️ Supabase Setup Guide# Supabase Integration Guide



Complete guide to setting up Supabase backend for the Bookmark Manager PWA.## ✅ Step 1: Install Supabase (COMPLETED)

The Supabase client library has been installed.

---

## 📝 Step 2: Add Your Credentials

## 📋 Prerequisites

1. **Open the `.env` file** in your project root

- A Supabase account (sign up at [supabase.com](https://supabase.com))2. **Replace the placeholders** with your actual Supabase credentials:

- Your Bookmark Manager PWA project cloned locally

- Basic understanding of SQL (helpful but not required)```env

VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

---VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...

```

## 🚀 Quick Setup (5 minutes)

**Where to find these:**

### Step 1: Create Supabase Project- Go to your Supabase dashboard: https://supabase.com/dashboard

- Select your project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)- Click **Settings** (⚙️) in the sidebar

2. Click **"New Project"**- Go to **API** section

3. Fill in project details:- Copy:

   - **Name**: `bookmark-manager`  - **Project URL** → `VITE_SUPABASE_URL`

   - **Database Password**: Create a strong password (save this!)  - **anon public** key → `VITE_SUPABASE_ANON_KEY`

   - **Region**: Choose closest to you

   - **Plan**: Free tier## 🗄️ Step 3: Create Database Tables

4. Click **"Create new project"**

5. Wait 2-3 minutes for setup to completeGo to your Supabase dashboard and run this SQL:



### Step 2: Get Your API Credentials### SQL Script to Create Tables



1. In your project dashboard, go to **Settings** (⚙️ icon)```sql

2. Click **API** in the left sidebar-- Enable UUID extension

3. Copy these two values:CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   - **Project URL** (e.g., `https://xxxxx.supabase.co`)

   - **anon public** key (starts with `eyJ...`)-- Create collections table

CREATE TABLE collections (

### Step 3: Configure Your App    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,

    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

1. In your project root, create `.env` file:    name TEXT NOT NULL,

   ```bash    description TEXT,

   touch .env    icon TEXT,

   ```    color TEXT,

    parent_id TEXT REFERENCES collections(id) ON DELETE CASCADE,

2. Add your credentials:    "order" INTEGER DEFAULT 0,

   ```env    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,

   VITE_SUPABASE_URL=https://your-project-id.supabase.co    last_modified_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000

   VITE_SUPABASE_ANON_KEY=your-anon-key-here);

   ```

-- Create bookmarks table

3. **Save the file** (don't commit to Git - it's already in `.gitignore`)CREATE TABLE bookmarks (

    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,

### Step 4: Create Database Schema    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

    url TEXT NOT NULL,

1. In Supabase dashboard, go to **SQL Editor**    title TEXT NOT NULL,

2. Click **"New Query"**    description TEXT,

3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`    favicon TEXT,

4. Paste into the SQL Editor    thumbnail TEXT,

5. Click **"Run"** (or press `Ctrl/Cmd + Enter`)    type TEXT DEFAULT 'website',

6. You should see: ✅ "Success. No rows returned"    platform TEXT,

    collection_id TEXT REFERENCES collections(id) ON DELETE SET NULL NOT NULL,

### Step 5: Verify Setup    tags TEXT[] DEFAULT ARRAY[]::TEXT[],

    is_favorite BOOLEAN DEFAULT FALSE,

1. Go to **Table Editor** in Supabase    is_archived BOOLEAN DEFAULT FALSE,

2. You should see two tables:    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,

   - ✅ `bookmarks`    last_modified_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000

   - ✅ `collections`);



3. Start your development server:-- Create tags table

   ```bashCREATE TABLE tags (

   npm run dev    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,

   ```    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

    name TEXT NOT NULL,

4. Open `http://localhost:5173`    color TEXT,

5. Sign up with a test account    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,

6. Add a bookmark    UNIQUE(user_id, name)

7. Check Supabase **Table Editor** → `bookmarks` → you should see your bookmark!);



----- Create indexes for better performance

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);

## 📊 Database Schema DetailsCREATE INDEX idx_bookmarks_collection_id ON bookmarks(collection_id);

CREATE INDEX idx_bookmarks_is_favorite ON bookmarks(is_favorite);

### Tables OverviewCREATE INDEX idx_bookmarks_is_archived ON bookmarks(is_archived);

CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at);

| Table | Purpose | Key Relationships |CREATE INDEX idx_collections_user_id ON collections(user_id);

|-------|---------|-------------------|CREATE INDEX idx_collections_parent_id ON collections(parent_id);

| `bookmarks` | Stores all bookmarks with metadata | Links to `auth.users` and `collections` |CREATE INDEX idx_tags_user_id ON tags(user_id);

| `collections` | Organizes bookmarks into folders | Links to `auth.users` |

-- Enable Row Level Security

### Bookmarks TableALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

```sqlALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE TABLE bookmarks (

    id TEXT PRIMARY KEY,-- Create policies for bookmarks

    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,CREATE POLICY "Users can view their own bookmarks"

    url TEXT NOT NULL,    ON bookmarks FOR SELECT

    title TEXT NOT NULL,    USING (auth.uid() = user_id);

    description TEXT,

    favicon TEXT,CREATE POLICY "Users can insert their own bookmarks"

    collection_id TEXT REFERENCES collections(id) ON DELETE SET NULL,    ON bookmarks FOR INSERT

    tags TEXT[] DEFAULT '{}',    WITH CHECK (auth.uid() = user_id);

    is_favorite BOOLEAN DEFAULT false,

    type TEXT DEFAULT 'link',CREATE POLICY "Users can update their own bookmarks"

    platform TEXT DEFAULT 'web',    ON bookmarks FOR UPDATE

    created_at TIMESTAMPTZ DEFAULT NOW(),    USING (auth.uid() = user_id)

    last_modified_at TIMESTAMPTZ DEFAULT NOW()    WITH CHECK (auth.uid() = user_id);

);

```CREATE POLICY "Users can delete their own bookmarks"

    ON bookmarks FOR DELETE

**Key Features:**    USING (auth.uid() = user_id);

- 🔐 User-specific (linked to `auth.users`)

- 🗂️ Can belong to a collection-- Create policies for collections

- ⭐ Can be favoritedCREATE POLICY "Users can view their own collections"

- 🏷️ Supports tags (array field)    ON collections FOR SELECT

- 🔗 Tracks URL metadata (favicon, thumbnail)    USING (auth.uid() = user_id);

- 📅 Automatic timestamps

CREATE POLICY "Users can insert their own collections"

### Collections Table    ON collections FOR INSERT

    WITH CHECK (auth.uid() = user_id);

```sql

CREATE TABLE collections (CREATE POLICY "Users can update their own collections"

    id TEXT PRIMARY KEY,    ON collections FOR UPDATE

    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,    USING (auth.uid() = user_id)

    name TEXT NOT NULL,    WITH CHECK (auth.uid() = user_id);

    description TEXT,

    icon TEXT DEFAULT 'folder',CREATE POLICY "Users can delete their own collections"

    color TEXT DEFAULT '#6366f1',    ON collections FOR DELETE

    "order" INTEGER DEFAULT 0,    USING (auth.uid() = user_id);

    created_at TIMESTAMPTZ DEFAULT NOW(),

    last_modified_at TIMESTAMPTZ DEFAULT NOW()-- Create policies for tags

);CREATE POLICY "Users can view their own tags"

```    ON tags FOR SELECT

    USING (auth.uid() = user_id);

**Key Features:**

- 🔐 User-specificCREATE POLICY "Users can insert their own tags"

- 🎨 Customizable (icon + color)    ON tags FOR INSERT

- 📊 Sortable (order field)    WITH CHECK (auth.uid() = user_id);

- 📅 Automatic timestamps

CREATE POLICY "Users can update their own tags"

### Row Level Security (RLS)    ON tags FOR UPDATE

    USING (auth.uid() = user_id)

Every table has RLS enabled with 4 policies:    WITH CHECK (auth.uid() = user_id);



| Policy | Action | Rule |CREATE POLICY "Users can delete their own tags"

|--------|--------|------|    ON tags FOR DELETE

| View | `SELECT` | User can only see their own data |    USING (auth.uid() = user_id);

| Create | `INSERT` | User can only create for themselves |

| Update | `UPDATE` | User can only update their own data |-- Create a function to automatically create a default Miscellaneous collection for new users

| Delete | `DELETE` | User can only delete their own data |CREATE OR REPLACE FUNCTION create_default_collection()

RETURNS TRIGGER AS $$

**This means:**BEGIN

- ✅ Complete data isolation between users    INSERT INTO collections (user_id, name, description, "order")

- ✅ No user can access another user's bookmarks    VALUES (NEW.id, 'Miscellaneous', 'Default collection for all bookmarks', 0);

- ✅ Security enforced at database level    RETURN NEW;

END;

### Indexes for Performance$$ LANGUAGE plpgsql SECURITY DEFINER;



```sql-- Create a trigger to run the function when a new user signs up

-- User lookups (most common query)CREATE TRIGGER on_auth_user_created

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);    AFTER INSERT ON auth.users

CREATE INDEX idx_collections_user_id ON collections(user_id);    FOR EACH ROW

    EXECUTE FUNCTION create_default_collection();

-- Collection filtering```

CREATE INDEX idx_bookmarks_collection_id ON bookmarks(collection_id);

**How to run this SQL:**

-- Favorites filtering1. In Supabase dashboard, go to **SQL Editor** (left sidebar)

CREATE INDEX idx_bookmarks_is_favorite ON bookmarks(is_favorite) 2. Click **New query**

WHERE is_favorite = true;3. Paste the entire SQL script above

4. Click **Run** (or press Cmd/Ctrl + Enter)

-- Sorting by date

CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);## 🔐 Step 4: Enable Authentication Providers

CREATE INDEX idx_collections_order ON collections("order");

```In your Supabase dashboard:



### Triggers1. Go to **Authentication** → **Providers**

2. Enable the providers you want:

**Auto-create default collection:**   - **Email** (enabled by default)

   - **Google** (recommended for easier sign-in)

When a user signs up, a trigger automatically creates a "Miscellaneous" collection for them:   - **GitHub** (optional)



```sql### For Google OAuth (Recommended):

CREATE FUNCTION create_default_collection()1. Enable Google provider in Supabase

RETURNS TRIGGER AS $$2. Follow the instructions to create Google OAuth credentials

BEGIN3. Add the credentials to Supabase

  INSERT INTO collections (id, user_id, name, description, icon, color)

  VALUES (## 🚀 Step 5: Restart Your Development Server

    gen_random_uuid()::text,

    NEW.id,After adding your credentials to `.env`:

    'Miscellaneous',

    'Default collection for uncategorized bookmarks',```bash

    'folder',# Stop the current dev server (Ctrl+C if running)

    '#6366f1'npm run dev

  );```

  RETURN NEW;

END;## 📋 Files Created

$$ LANGUAGE plpgsql SECURITY DEFINER;

✅ `/src/lib/supabase.ts` - Supabase client configuration

CREATE TRIGGER on_user_created✅ `/src/lib/database.types.ts` - TypeScript types for your database

  AFTER INSERT ON auth.users✅ `/src/vite-env.d.ts` - Environment variable types

  FOR EACH ROW✅ `/.env` - Environment variables (add your credentials here)

  EXECUTE FUNCTION create_default_collection();

```## 🎯 Next Steps



---After completing the steps above, I can help you with:



## 🔐 Authentication Setup1. **Create Authentication Pages**

   - Sign in / Sign up forms

### Email/Password Authentication (Default)   - Password reset

   - Google OAuth button

Email authentication is enabled by default. No additional configuration needed!   - Protected routes



**Flow:**2. **Implement Sync Logic**

1. User signs up with email and password   - Sync IndexedDB ↔ Supabase

2. Supabase creates user in `auth.users` table   - Offline-first with background sync

3. Trigger creates default "Miscellaneous" collection   - Conflict resolution

4. User can start adding bookmarks

3. **Add User Profile**

### Optional: Enable Email Confirmations   - User settings

   - Account management

For production, you may want email confirmation:   - Data export/import



1. Go to **Authentication** → **Providers** → **Email**4. **Real-time Features**

2. Enable **"Confirm email"**   - Live sync across devices

3. Configure email templates if needed   - Presence indicators

   - Real-time updates

### Optional: Add OAuth Providers

## 🔒 Security Notes

To add Google, GitHub, or other OAuth:

- **Row Level Security (RLS)** is enabled - users can only access their own data

1. Go to **Authentication** → **Providers**- **anon key** is safe to use in client-side code

2. Enable desired provider (e.g., Google)- Never commit your `.env` file to git (it's already in `.gitignore`)

3. Follow Supabase's provider-specific setup guide

4. Update your app code to add OAuth buttons## ❓ Troubleshooting



---If you get errors:

1. Make sure you've added your credentials to `.env`

## 🌐 Production Configuration2. Restart the dev server after changing `.env`

3. Check that all SQL scripts ran successfully

### URL Configuration4. Verify RLS policies are enabled in Supabase dashboard



When deploying to GitHub Pages or custom domain:---



1. Go to **Authentication** → **URL Configuration****Ready to continue?** Once you've:

2. Set **Site URL** to your production URL:1. Added your credentials to `.env`

   ```2. Run the SQL script in Supabase

   https://username.github.io/repo-name/3. Restarted your dev server

   ```

3. Add to **Redirect URLs**:Let me know and I'll help you build the authentication system and sync logic!

   ```
   https://username.github.io/repo-name/**
   ```

### Rate Limiting

Free tier includes:
- ✅ 50,000 monthly active users
- ✅ 500 MB database space
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth

For higher limits, upgrade to Pro tier.

---

## 🛠️ Database Management

### Backup Your Data

**Automatic Backups (Pro tier):**
- Daily backups included in Pro plan

**Manual Backup (Free tier):**

1. Go to **Database** → **Backups**
2. Click **"Create backup"**
3. Or use SQL:
   ```sql
   -- Export bookmarks
   COPY (SELECT * FROM bookmarks) TO STDOUT WITH CSV HEADER;
   
   -- Export collections
   COPY (SELECT * FROM collections) TO STDOUT WITH CSV HEADER;
   ```

### View Your Data

**Table Editor:**
1. Go to **Table Editor**
2. Select `bookmarks` or `collections`
3. View, edit, or delete records

**SQL Editor:**
```sql
-- View all your bookmarks
SELECT * FROM bookmarks ORDER BY created_at DESC;

-- Count bookmarks per collection
SELECT c.name, COUNT(b.id) as bookmark_count
FROM collections c
LEFT JOIN bookmarks b ON c.id = b.collection_id
GROUP BY c.id, c.name;

-- Find favorites
SELECT * FROM bookmarks WHERE is_favorite = true;
```

### Update Database Schema

If you need to modify the schema:

1. Go to **SQL Editor**
2. Run your ALTER TABLE commands:
   ```sql
   -- Example: Add a new column
   ALTER TABLE bookmarks ADD COLUMN notes TEXT;
   ```
3. Update your TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
   ```

---

## 🐛 Troubleshooting

### Issue: "Invalid API key"
**Solution:**
- Check `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after changing `.env`
- Verify keys are correct in Supabase dashboard

### Issue: "Row Level Security policy violation"
**Solution:**
- Ensure you're signed in
- Check RLS policies are created (run migration file)
- Verify policies use `auth.uid()` correctly

### Issue: "relation does not exist"
**Solution:**
- Run the migration SQL file
- Check table names are correct (lowercase: `bookmarks`, `collections`)
- Verify tables exist in **Table Editor**

### Issue: "Authentication required"
**Solution:**
- Check Site URL in Supabase → Authentication → URL Configuration
- Verify it matches your app's URL
- Add URL to Redirect URLs list

### Issue: Data not syncing
**Solution:**
1. Check browser console for errors
2. Verify Supabase credentials
3. Check internet connection
4. Try manual sync from Profile page
5. Check Supabase dashboard for data

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## 💡 Tips & Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use RLS policies** - They're enforced at database level
3. **Create indexes** - For better query performance
4. **Regular backups** - Export your data periodically
5. **Monitor usage** - Check dashboard for quota limits
6. **Test locally first** - Before deploying to production
7. **Use transactions** - For complex multi-table operations
8. **Add foreign keys** - Maintain data integrity
9. **Use timestamps** - Track when data changes
10. **Enable email confirmation** - For production apps

---

**Need help?** Open an issue on GitHub or check Supabase Community Discord!
