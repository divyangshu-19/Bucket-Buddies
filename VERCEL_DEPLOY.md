# Quick Vercel Deployment (5 Minutes) ⚡

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Ready to deploy"
git remote add origin https://github.com/YOUR_USERNAME/bucket-buddies.git
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to **vercel.com** → Sign up (free)
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Click **"Deploy"** (Vercel auto-configures Next.js!)

## Step 3: Add Environment Variables

**In Vercel Dashboard:**
1. Project → **Settings** → **Environment Variables**
2. Add these 3 variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
```

3. Select **all environments** (Production, Preview, Development)
4. Click **"Save"**
5. **Redeploy** (happens automatically or click Redeploy button)

## Step 4: Update Supabase

**In Supabase Dashboard:**
1. **Authentication** → **URL Configuration**
2. Add your Vercel URL:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

## Done! 🎉

Your app is live at: `https://your-app.vercel.app`

---

## Pro Tips

- ✅ Every push to GitHub = automatic deployment
- ✅ Preview URLs for every pull request
- ✅ Free SSL certificate included
- ✅ Global CDN (fast worldwide)
- ✅ Environment variables are encrypted

**No credit card required!** 🎉

