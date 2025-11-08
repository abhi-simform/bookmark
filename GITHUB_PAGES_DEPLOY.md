# Deploy to GitHub Pages

This guide will help you deploy your Bookmark Manager PWA to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your computer
3. Your project code ready to push

## Setup Instructions

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository: `bookmark` (or any name you prefer)
4. Make it **Public** (required for free GitHub Pages)
5. Do NOT initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Update Vite Config (Already Done ✅)

The `vite.config.ts` has been updated with:
```typescript
base: process.env.NODE_ENV === 'production' ? '/bookmark/' : '/',
```

**Important:** If you named your repository differently, update `/bookmark/` to match your repo name.

### Step 3: Initialize Git and Push to GitHub

Run these commands in your project directory:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit"

# Add your GitHub repository as remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/bookmark.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. The site will start building automatically

### Step 5: Wait for Deployment

1. Go to the **Actions** tab in your repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually 2-3 minutes)
4. Once complete, your site will be live at:
   ```
   https://USERNAME.github.io/bookmark/
   ```

## Automatic Deployment

The GitHub Actions workflow is configured to automatically deploy whenever you push to the `main` branch:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push
```

The site will automatically rebuild and deploy!

## Manual Deployment (Alternative Method)

If you prefer to deploy manually using gh-pages package:

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Deploy:
```bash
npm run deploy
```

This will build and deploy to the `gh-pages` branch.

## Environment Variables

**Important:** Since GitHub Pages is a static hosting service, you need to handle environment variables carefully.

### For Supabase Configuration:

You have two options:

#### Option 1: Public Environment Variables (Recommended for Demo)
Create a `.env.production` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then update your build script to include these.

#### Option 2: Use GitHub Secrets (More Secure)
1. Go to your repository Settings
2. Click on "Secrets and variables" → "Actions"
3. Add new repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Update `.github/workflows/deploy.yml` to use these secrets:
```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

## Troubleshooting

### 404 Error on Refresh
If you get 404 errors when refreshing pages other than home, add a `404.html` file that redirects to `index.html`:

```bash
cp dist/index.html dist/404.html
```

This is already handled by the build process.

### Assets Not Loading
Make sure the `base` path in `vite.config.ts` matches your repository name.

### Build Fails
Check the Actions tab for error logs. Common issues:
- TypeScript errors
- Missing dependencies
- Environment variables not set

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain:
```
yourdomain.com
```

2. Configure DNS with your domain provider:
   - Add a CNAME record pointing to `USERNAME.github.io`

3. In GitHub repository settings under Pages:
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## Testing Locally

Before deploying, test the production build locally:

```bash
npm run build
npm run preview
```

This will start a local server with the production build.

## Notes

- GitHub Pages serves static files only (no backend server)
- All authentication and data storage happens through Supabase
- The PWA will work offline once installed
- Free GitHub Pages has bandwidth limits (100GB/month)
- Repository must be public for free GitHub Pages

## Need Help?

If deployment fails:
1. Check the Actions tab for error logs
2. Ensure all environment variables are set
3. Verify the repository name matches the base path in vite.config.ts
4. Make sure the repository is public

Happy deploying! 🚀
