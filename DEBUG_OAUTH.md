# OAuth Debugging Checklist

## 🔍 Before Testing

### 1. Verify Environment Variables
In v0 Settings → Vars, confirm you have:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` 
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Verify Google Cloud Console
Go to: https://console.cloud.google.com/
1. Select your project
2. Go to APIs & Services → Credentials
3. Find your OAuth Client ID (it will look like: `1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`)
4. Click to edit
5. Check **Authorized redirect URIs** contains **BOTH**:
   - ✅ `https://vxykiwifugieiwgqnlih.supabase.co/auth/v1/callback`
   - ✅ `http://localhost:3000/auth/callback`

If `http://localhost:3000/auth/callback` is missing, add it and click Save!

### 3. Verify Supabase Configuration
Go to: https://supabase.com/ → Your Project
1. Navigate to Authentication → Providers → Google
2. Check that Client ID and Secret are entered correctly
3. Verify the redirect URLs are set

## 🧪 Testing Steps

### Step 1: Open Browser Console
1. Go to http://localhost:3000
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Go to Console tab

### Step 2: Try Google Sign-In
1. Click "Continue with Google" button
2. Watch the Console for `[v0]` debug messages
3. You should see: `[v0] Google OAuth redirect URL: http://localhost:3000/auth/callback`

### Step 3: Check the Error
If you get "Auth callback error code: no_code":
- Look at the Console tab
- You should see `[v0] Google OAuth error: ...`
- This tells us what went wrong

## ❌ Common Issues & Fixes

### Issue 1: "Auth callback error code: no_code"
**Most likely cause**: `http://localhost:3000/auth/callback` not in Google Cloud's authorized URIs

**Fix**: 
1. Go to Google Cloud Console
2. Add `http://localhost:3000/auth/callback` to Authorized redirect URIs
3. Click Save
4. Wait 30 seconds
5. Refresh and try again

### Issue 2: "Error: redirect_uri_mismatch"
**Cause**: The redirect URI doesn't exactly match

**Fix**: 
- Verify case-sensitivity
- No trailing slashes: use `http://localhost:3000/auth/callback` NOT `http://localhost:3000/auth/callback/`

### Issue 3: CORS Error
**Cause**: Supabase credentials don't match

**Fix**: 
1. Verify `NEXT_PUBLIC_SUPABASE_URL` matches your Supabase project URL
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct

### Issue 4: Stuck on Google Login Screen
**Cause**: Browser cookies or cache

**Fix**: 
1. Open Incognito/Private window
2. Try signing in again

## ✅ Expected Flow

1. Click "Continue with Google"
2. Redirected to Google login
3. Enter Google credentials
4. Redirected back to `http://localhost:3000/auth/callback`
5. See console: `[v0] Auth callback received: { code: '...', error_code: null }`
6. Redirected to `/protected` page
7. See your user info displayed

## 📝 What the Code Does

**callback/route.ts**:
- Receives the authorization `code` from Google
- Exchanges it with Supabase for a session
- Stores the session in cookies
- Redirects to `/protected` page

**components/auth-form.tsx**:
- Shows "Continue with Google" button
- Calls `supabase.auth.signInWithOAuth()`
- Passes redirect URL: `http://localhost:3000/auth/callback`

## 🚀 Final Test

After adding redirect URI to Google Cloud:

1. Clear browser cache (or use Incognito)
2. Go to http://localhost:3000
3. Click "Continue with Google"
4. You should see the Google login screen
5. After logging in with Google, you should see your info on `/protected`

If this works, you're done! 🎉

## 💬 Still Stuck?

Open browser Developer Tools (F12) → Console tab and:
1. Click "Continue with Google"
2. Look for `[v0]` messages
3. Share what error message you see

The console logging will help pinpoint the exact issue!
