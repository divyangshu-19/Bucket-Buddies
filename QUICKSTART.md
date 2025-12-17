# Quick Start Guide

## 🚀 5-Minute Setup

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) → Sign up (free)
- Click "New Project"
- Wait ~2 minutes for setup

### 2. Run Migration SQL (One-Time Setup)

**What is this?** The migration SQL creates all your database tables, security rules, and indexes. You only run it **once** when first setting up.

**How to run:**
1. Supabase dashboard → **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `supabase/migrations/001_initial_schema.sql` from this project
4. Copy **everything** and paste into SQL Editor
5. Click **Run** ✅

That's it! Your database is now set up.

### 3. Get Your Keys
1. Supabase dashboard → **Settings** → **API**
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Create `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."
```

### 5. Install & Run
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` 🎉

## ✅ What's Built

- ✅ Supabase Auth (email + Google OAuth)
- ✅ Bucket list CRUD
- ✅ Smart matching
- ✅ Realtime chat
- ✅ Profile management

## 🔧 Optional: Google OAuth

1. Supabase → **Authentication** → **Providers**
2. Enable **Google**
3. Add Google OAuth credentials
4. Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

## ❓ FAQ

**Q: Do I need to run the migration every time?**  
A: No! Only once when first setting up. It creates your database structure.

**Q: What if I make a mistake?**  
A: You can delete your Supabase project and create a new one, then run the migration again.

**Q: Can I skip the migration?**  
A: No - the app needs those tables to work. The migration creates everything in one go.

---

That's it! Much simpler than managing your own database! 🎉
