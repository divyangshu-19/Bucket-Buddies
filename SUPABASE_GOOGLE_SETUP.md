# 🔧 Google OAuth Setup for Supabase

## Problem
You're getting this error:
```json
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

This means **Google OAuth is not enabled** in your Supabase project.

## ✅ Solution: Enable Google OAuth in Supabase

### Step 1: Go to Supabase Dashboard

1. Open your Supabase project at [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers** (in the left sidebar)

### Step 2: Enable Google Provider

1. Scroll down to find **Google**
2. Toggle **"Enable sign in with Google"** to **ON**
3. You'll see fields for:
   - **Client ID**
   - **Client Secret**

### Step 3: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Configure OAuth consent screen if prompted
   - Set application type to **"Web application"**
   - Add authorized redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
     (Replace `your-project-id` with your actual Supabase project ID)

5. Copy the **Client ID** and **Client Secret**

### Step 4: Configure in Supabase

1. Back in Supabase dashboard
2. Paste your **Client ID** and **Client Secret** into the Google provider settings
3. Click **"Save"**

### Step 5: Update Redirect URLs (Important!)

In Supabase → **Authentication** → **URL Configuration**:

1. **Site URL**: `https://your-project-id.supabase.co`
2. **Redirect URLs**:
   - `https://your-project-id.supabase.co/auth/v1/callback`
   - If deploying to Vercel/Netlify, also add: `https://your-app-domain.com/auth/v1/callback`

### Step 6: Test

1. Restart your dev server: `npm run dev`
2. Try Google sign-in again
3. Should work now! 🎉

## 🚨 Important Notes

### Redirect URL Must Match Exactly
- The redirect URL in Google Cloud Console **must exactly match** what's configured in Supabase
- Case sensitive, no extra spaces or characters

### Development vs Production
- For local development: Use `http://localhost:3001/auth/callback` (or your dev port)
- For production: Use your deployed domain + `/auth/callback`

### Google Cloud Console Settings
- **Authorized JavaScript origins**: `http://localhost:3001` (for dev) + your production domain
- **Authorized redirect URIs**: Must include the Supabase callback URL

## 🔍 Troubleshooting

### Still getting the error?
1. **Check provider is enabled**: Supabase → Authentication → Providers → Google → "Enable sign in with Google"
2. **Verify credentials**: Make sure Client ID and Secret are correct
3. **Check redirect URLs**: Must match exactly between Google Console and Supabase
4. **Wait 5-10 minutes**: Changes sometimes take time to propagate

### Console errors?
Open browser DevTools → Console tab to see detailed error messages.

## 📱 Mobile Testing

Google OAuth works on mobile devices, but test thoroughly as some mobile browsers handle redirects differently.

---

## 🎯 Quick Checklist

- [ ] Supabase project created
- [ ] Google OAuth enabled in Supabase
- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Client ID & Secret copied to Supabase
- [ ] Redirect URLs configured correctly
- [ ] Tested sign-in flow

Once configured, Google OAuth will work seamlessly! 🚀

