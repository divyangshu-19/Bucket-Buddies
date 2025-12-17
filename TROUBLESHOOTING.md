# Troubleshooting Guide

## Common Issues and Fixes

### 1. "Missing Supabase environment variables"

**Error:** `Missing Supabase environment variables` or `NEXT_PUBLIC_SUPABASE_URL is undefined`

**Fix:**
1. Make sure `.env.local` exists in the project root
2. Check that all three variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. **Restart your dev server** after creating/editing `.env.local`
4. Make sure there are no quotes around the values (or if there are, they match)

### 2. "relation does not exist" or "table not found"

**Error:** `relation "profiles" does not exist` or similar

**Fix:**
- You haven't run the migration SQL yet!
- Go to Supabase dashboard → SQL Editor
- Copy and run `supabase/migrations/001_initial_schema.sql`
- This creates all the tables

### 3. "permission denied" or "RLS policy violation"

**Error:** `new row violates row-level security policy`

**Fix:**
- Make sure you ran the migration SQL (it sets up RLS policies)
- Check that you're signed in
- Verify the user exists in `auth.users` (Supabase Auth)

### 4. "Invalid API key" or Authentication Errors

**Error:** `Invalid API key` or auth not working

**Fix:**
1. Double-check your Supabase keys in `.env.local`
2. Make sure you copied the **anon/public** key (not service_role) for client-side
3. Restart dev server after changing env vars
4. Check Supabase dashboard → Settings → API to verify keys

### 5. Realtime Not Working (Chat)

**Error:** Messages not appearing in real-time

**Fix:**
1. Check browser console for errors
2. Verify Supabase Realtime is enabled (it is by default)
3. Make sure you're subscribed to the correct channel
4. Check that RLS policies allow reading messages

### 6. "Cannot find module" Errors

**Error:** `Cannot find module '@supabase/ssr'` or similar

**Fix:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 7. Build Errors

**Error:** TypeScript or build errors

**Fix:**
1. Make sure all dependencies are installed: `npm install`
2. Check that TypeScript is up to date
3. Restart your IDE/editor
4. Clear Next.js cache: `rm -rf .next`

### 8. Sign Up Not Creating Profile

**Error:** User created but profile not found

**Fix:**
- The migration SQL includes a trigger that auto-creates profiles
- Make sure you ran the migration SQL
- Check Supabase dashboard → Database → Triggers to verify the trigger exists

### 9. Field Name Mismatches

**Error:** `Cannot read property 'createdAt' of undefined`

**Fix:**
- The API routes transform `snake_case` (database) to `camelCase` (frontend)
- If you see this, check the API route is returning transformed data
- Check browser Network tab to see what the API actually returns

### 10. Google OAuth Not Working

**Error:** Google sign-in redirects but doesn't work

**Fix:**
1. In Supabase → Authentication → Providers → Google
2. Make sure Google is enabled
3. Add redirect URL: `https://your-project-id.supabase.co/auth/v1/callback`
4. Verify Google OAuth credentials are correct

## Still Not Working?

1. **Check the browser console** - Look for red errors
2. **Check the terminal** - Look for server errors
3. **Verify environment variables** - Add a console.log temporarily:
   ```js
   console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
   ```
4. **Check Supabase dashboard** - Verify tables exist and RLS is enabled
5. **Restart everything** - Dev server, browser, clear cache

## Getting Help

If nothing works:
1. Check Supabase logs: Dashboard → Logs
2. Check Next.js logs in terminal
3. Verify migration SQL ran successfully
4. Make sure `.env.local` is in the root directory (same as `package.json`)

