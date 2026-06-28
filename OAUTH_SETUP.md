# Google OAuth + Supabase Setup Guide

## Your Configuration Details

- **Google Client ID**: Your Client ID from Google Cloud Console
- **Google Client Secret**: Your Client Secret from Google Cloud Console  
- **Supabase Callback URL**: Your Supabase project's auth callback URL (provided by Supabase)
- **Your App Redirect URL**: `http://localhost:3000/auth/callback`

**Note**: Keep your Client ID and Secret secure! Never commit them to git.

## Step-by-Step Setup

### ✅ Part 1: Supabase Configuration (ALREADY DONE)
You've already added the redirect URL to Supabase authentication settings. Good!

### ⚠️ Part 2: Google Cloud Console Configuration (NEED TO DO THIS)

**This is likely why you're getting "Auth callback error code: no_code"**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services → Credentials**
4. Find your OAuth 2.0 Client ID (the one you're using)
5. Click on it to edit
6. In **Authorized redirect URIs** section, you should see:
   - `https://vxykiwifugieiwgqnlih.supabase.co/auth/v1/callback` (Supabase redirect)
   
7. **You need to ADD ALSO:**
   - `http://localhost:3000/auth/callback` (for local development)

8. Click **Save**

### 📋 Expected Authorized Redirect URIs in Google Cloud:

```
https://vxykiwifugieiwgqnlih.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

## Why This is Needed

When you click "Continue with Google":
1. Google redirects to its login page
2. After authentication, Google redirects BACK to one of your configured redirect URIs with the authorization code
3. If your `localhost:3000/auth/callback` is NOT in Google's authorized list, Google rejects the redirect
4. This causes the "Auth callback error code: no_code" error

## Testing After Setup

1. Save the changes in Google Cloud Console
2. Wait 30 seconds for changes to propagate
3. Go back to http://localhost:3000
4. Click "Continue with Google"
5. Complete the Google sign-in flow
6. You should be redirected to your `/protected` page

## Troubleshooting

### Still getting "no_code" error?

1. **Check Google Cloud Console**: Make sure `http://localhost:3000/auth/callback` is in the **Authorized redirect URIs** list
2. **Check Supabase**: Make sure `https://vxykiwifugieiwgqnlih.supabase.co/auth/v1/callback` is in the redirect URLs
3. **Clear browser cache**: Sometimes browser cookies interfere
4. **Check credentials match**: Verify the Client ID and Client Secret in Supabase match what's in Google Cloud

### Getting CORS errors?

This means the request is being blocked. Check:
- Your origin URL is correct (http://localhost:3000)
- Supabase credentials are correct in your environment variables

## Environment Variables Check

Make sure these are set in your project:
```
NEXT_PUBLIC_SUPABASE_URL=https://vxykiwifugieiwgqnlih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

These should already be set by the Supabase integration, but verify in Settings → Vars.
