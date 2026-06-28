# Supabase Google OAuth Setup Guide

## Error: "Auth callback error code: no_code"

This error occurs when Google doesn't send the authorization code back to your redirect URL. This is a **Supabase configuration issue**, not a code issue.

## Solution: Configure Google OAuth Redirect URLs in Supabase

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project

### Step 2: Navigate to Authentication Settings
1. Go to **Authentication** in the left sidebar
2. Click on **Providers**
3. Find and click on **Google**

### Step 3: Add Redirect URL
You need to add your app's redirect URL to the **Redirect URLs** list:

**For Local Development:**
```
http://localhost:3000/auth/callback
```

**For Production:**
```
https://your-domain.com/auth/callback
```

### Step 4: Verify Google OAuth Configuration
Make sure you have:
- ✅ Google Client ID (from Google Cloud Console)
- ✅ Google Client Secret (from Google Cloud Console)
- ✅ Redirect URL added to both:
  - Supabase redirect URLs list
  - Google Cloud Console OAuth app settings

## How It Works

1. User clicks "Continue with Google"
2. They're redirected to Google's login page
3. After login, Google sends them to: `http://localhost:3000/auth/callback?code=XXXXX`
4. Your app's callback handler at `/app/auth/callback/route.ts` receives the code
5. It exchanges the code for a Supabase session using `exchangeCodeForSession(code)`
6. User is authenticated and redirected to `/protected`

## Testing

1. Run the dev server: `npm run dev`
2. Go to http://localhost:3000
3. Click "Continue with Google"
4. Sign in with your Google account
5. Check the console for `[v0]` logs to see what's happening

## Debugging

If you still get the error, check:

1. **Console Logs**: Look for `[v0]` messages in browser DevTools
2. **Supabase Logs**: In dashboard → Logs → Auth service
3. **URL Match**: Ensure redirect URL exactly matches in Supabase settings
4. **Case Sensitivity**: URL matching is case-sensitive

## Alternative: Check Supabase Project Settings

1. Dashboard → Project Settings → API
2. Copy your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Verify these are in your `.env.local` file
