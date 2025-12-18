# 🚨 Google OAuth Not Working - Fix Required

## Error Message
```
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

## Root Cause
**Google OAuth provider is NOT enabled** in your Supabase project.

## ⚡ Quick Fix (5 Minutes)

### Step 1: Enable Google in Supabase
1. Go to [supabase.com](https://supabase.com)
2. Open your project → **Authentication** → **Providers**
3. Find **Google** → Toggle **"Enable sign in with Google"** to **ON**
4. You'll need Google OAuth credentials (see Step 2)

### Step 2: Get Google Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project → **APIs & Services** → **Credentials**
3. **Create Credentials** → **OAuth 2.0 Client IDs**
4. Set type to **"Web application"**
5. Add redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
6. Copy **Client ID** and **Client Secret**

### Step 3: Configure in Supabase
1. Back in Supabase → Paste Client ID and Secret into Google provider
2. **Save** changes
3. Update redirect URLs in **Authentication** → **URL Configuration**

### Step 4: Test
Restart your app and try Google sign-in again.

## 📋 Checklist
- [ ] Supabase project exists
- [ ] Google provider enabled in Supabase
- [ ] Google Cloud Console project created
- [ ] OAuth credentials created
- [ ] Client ID/Secret copied to Supabase
- [ ] Redirect URLs match exactly

**Once enabled, Google OAuth will work perfectly!** 🎉

## Alternative: Skip Google OAuth
If you don't need Google OAuth right now, you can:
- Remove Google buttons from auth pages
- Use email/password only (already working)

Let me know if you need help with any step!
