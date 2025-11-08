# Fix: Remove .env from Git History

## ⚠️ URGENT: Your .env file contains sensitive Supabase credentials!

You've committed your `.env` file which contains:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🔥 Immediate Actions Required:

### Step 1: Remove .env from Git (Right Now!)

Run these commands in your terminal:

```bash
# Remove .env from git tracking (but keep the local file)
git rm --cached .env

# Commit this change
git commit -m "Remove .env from repository"

# If you've already pushed, force push to remove it from GitHub
git push origin main --force
```

### Step 2: Rotate Your Supabase Keys (CRITICAL!)

Since your keys were exposed, you should rotate them:

1. Go to your Supabase Dashboard
2. Settings → API
3. Under "Project API keys" → Click "Reveal" on the anon key
4. Click "Reset" or regenerate the keys
5. Update your local `.env` file with the new keys

### Step 3: Add Credentials to GitHub Secrets

For GitHub Pages deployment:

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these secrets:
   - Name: `VITE_SUPABASE_URL`, Value: `your_new_url`
   - Name: `VITE_SUPABASE_ANON_KEY`, Value: `your_new_key`

### Step 4: Update GitHub Actions Workflow

The workflow file `.github/workflows/deploy.yml` needs to use these secrets.

Update the Build step to include environment variables:

```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

---

## ✅ Verification

After completing these steps:

1. Check that `.env` is not in your repo:
   ```bash
   git ls-files | grep .env
   ```
   (Should return nothing)

2. Verify `.gitignore` includes `.env`:
   ```bash
   cat .gitignore | grep .env
   ```
   (Should show `.env`)

3. Check GitHub - the `.env` file should not be visible

---

## 🛡️ Prevention for Future

The `.gitignore` has been updated to include:
- `.env`
- `.env.local`
- `.env.production`

This prevents future accidental commits.

---

## 📝 Alternative: Complete History Cleanup (If Paranoid)

If you want to completely remove `.env` from all git history:

```bash
# Install BFG Repo Cleaner (easier than git filter-branch)
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy of your repo
git clone --mirror https://github.com/YOUR_USERNAME/bookmark.git

# Remove .env from history
bfg --delete-files .env bookmark.git

# Clean up
cd bookmark.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force
```

**Warning:** This rewrites git history. Only do this if really necessary.

---

## 🔐 What to Do Moving Forward

1. ✅ Keep `.env` in `.gitignore`
2. ✅ Use GitHub Secrets for deployment
3. ✅ Never commit sensitive credentials
4. ✅ Consider using environment-specific files:
   - `.env.development` (for local dev)
   - `.env.production` (for production builds)
   - Both should be in `.gitignore`

5. ✅ Create `.env.example` for documentation:
   ```bash
   # Copy your .env and remove the actual values
   cp .env .env.example
   ```
   
   Then edit `.env.example` to:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
   
   This file CAN be committed - it shows what variables are needed without exposing actual keys.

---

## ✅ Quick Checklist

- [ ] Run `git rm --cached .env`
- [ ] Commit and force push
- [ ] Rotate Supabase keys
- [ ] Add new keys to GitHub Secrets
- [ ] Update GitHub Actions workflow
- [ ] Verify `.env` is in `.gitignore`
- [ ] Create `.env.example` for documentation
- [ ] Test deployment

---

Need help with any of these steps? Let me know!
