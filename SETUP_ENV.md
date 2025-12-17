# Setting Up Environment Variables

## Quick Steps

1. **Copy the example file:**
   ```bash
   # On Windows (PowerShell)
   Copy-Item .env.example .env.local
   
   # On Mac/Linux
   cp .env.example .env.local
   ```

2. **Get your Supabase keys:**
   - Go to [supabase.com](https://supabase.com)
   - Open your project (or create a new one)
   - Go to **Settings** → **API**
   - Copy these three values:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

3. **Edit `.env.local` and paste your values:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."
   ```

4. **Save the file** - Next.js will automatically load it

## Important Notes

- ✅ `.env.local` is already in `.gitignore` - your secrets are safe
- ✅ Never commit `.env.local` to git
- ✅ The `anon` key is safe to expose (protected by Row Level Security)
- ⚠️ The `service_role` key is SECRET - never expose it in client code!

## Troubleshooting

**"Missing Supabase environment variables" error:**
- Make sure `.env.local` exists (not just `.env.example`)
- Check that all three variables are set
- Restart your dev server after creating/editing `.env.local`

---

That's it! Once you have `.env.local` set up, you're ready to run the app! 🚀

