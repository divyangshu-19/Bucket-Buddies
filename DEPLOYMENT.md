# Free Deployment Guide 🚀

## Best Option: Vercel (Recommended)

**Why Vercel?**
- ✅ Made by Next.js creators (perfect fit)
- ✅ Completely free for personal projects
- ✅ Zero configuration needed
- ✅ Automatic deployments from GitHub
- ✅ Built-in environment variable management
- ✅ Free SSL certificate
- ✅ Global CDN

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a new repository on GitHub.com, then:
git remote add origin https://github.com/yourusername/bucket-buddies.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up** with your GitHub account (free)
3. **Click "Add New Project"**
4. **Import your GitHub repository** (bucket-buddies)
5. **Vercel auto-detects Next.js** - no config needed!
6. **Click "Deploy"**

### 3. Add Environment Variables in Vercel

**IMPORTANT:** Your `.env.local` file is NOT deployed. You need to add variables in Vercel dashboard.

1. **In Vercel dashboard**, go to your project
2. **Click "Settings"** → **"Environment Variables"**
3. **Add these three variables:**

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://your-project-id.supabase.co
   Environment: Production, Preview, Development (select all)
   ```

   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: your-anon-key-here
   Environment: Production, Preview, Development (select all)
   ```

   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: your-service-role-key-here
   Environment: Production, Preview, Development (select all)
   ```

4. **Click "Save"** for each variable
5. **Redeploy** your app (Vercel will auto-redeploy, or click "Redeploy")

### 4. Update Supabase Redirect URLs

After deployment, you'll get a URL like: `https://bucket-buddies.vercel.app`

1. **Go to Supabase Dashboard** → **Authentication** → **URL Configuration**
2. **Add your Vercel URL** to:
   - **Site URL**: `https://bucket-buddies.vercel.app`
   - **Redirect URLs**: 
     - `https://bucket-buddies.vercel.app/**`
     - `https://your-project-id.supabase.co/auth/v1/callback`

### 5. That's It! 🎉

Your app is now live at `https://your-project.vercel.app`

---

## Alternative: Netlify (Also Free)

### Steps:

1. **Push to GitHub** (same as above)
2. **Go to [netlify.com](https://netlify.com)**
3. **Sign up** with GitHub
4. **Click "Add new site"** → **"Import an existing project"**
5. **Select your repository**
6. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
7. **Add environment variables:**
   - Go to **Site settings** → **Environment variables**
   - Add the same three variables as Vercel
8. **Deploy!**

---

## Environment Variables Cheat Sheet

### What to Add in Hosting Platform:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Where to Get These Values:

1. **Supabase Dashboard** → **Settings** → **API**
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### Important Notes:

- ✅ **Never commit `.env.local`** to GitHub (it's in `.gitignore`)
- ✅ **Add variables in hosting platform dashboard** (Vercel/Netlify)
- ✅ **Variables are encrypted** and secure in hosting platforms
- ✅ **Redeploy after adding variables** for changes to take effect

---

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel/Netlify
- [ ] Environment variables added in hosting dashboard
- [ ] Supabase redirect URLs updated
- [ ] Migration SQL run in Supabase (if not done already)
- [ ] Test the live site!

---

## Troubleshooting

### "Missing environment variables" error:
- Check variables are added in Vercel/Netlify dashboard
- Make sure variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Auth not working:
- Update Supabase redirect URLs with your live domain
- Check environment variables are set correctly

### Database errors:
- Make sure migration SQL was run in Supabase
- Check RLS policies are enabled

---

**That's it! Your app is now live and free! 🎉**

