# Quick Deploy to GitHub Pages

## 🚀 Quick Start (5 Minutes)

### 1. Create GitHub Repository
```bash
# Go to https://github.com/new
# Repository name: bookmark
# Make it PUBLIC
# Don't initialize with anything
```

### 2. Push Your Code
```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/bookmark.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Actions
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: **GitHub Actions**

### 4. Done! 🎉
Your site will be live at: `https://YOUR_USERNAME.github.io/bookmark/`

---

## ⚠️ Important: Update Base Path

If your repository name is NOT "bookmark", update `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

---

## 🔐 Add Supabase Credentials

### Option A: GitHub Secrets (Recommended)
1. GitHub repo → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option B: Create `.env.production`
```env
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

**Note:** Don't commit this file if using Option B!

---

## 🔄 Deploy Updates

Just push to main branch:
```bash
git add .
git commit -m "Update feature"
git push
```

Automatic deployment happens via GitHub Actions!

---

## 🛠️ Manual Deploy (Alternative)

```bash
npm run deploy
```

---

## 📖 Full Documentation

See `GITHUB_PAGES_DEPLOY.md` for complete instructions.
