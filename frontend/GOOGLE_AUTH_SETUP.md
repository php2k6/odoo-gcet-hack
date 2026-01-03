# Google OAuth Setup Instructions

## ✅ Setup Status

All dependencies have been installed and the app is configured for Google OAuth login!

## 🔑 Get Your Google Client ID

**IMPORTANT:** You need to add your Google Client ID to make the login work.

### Step-by-Step Guide:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create/Select a Project**
   - Click on the project dropdown at the top
   - Create a new project or select an existing one

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google People API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"

5. **Configure Authorized Origins & Redirect URIs**
   - **Authorized JavaScript origins:**
     - `http://localhost:5173` (for development)
     - Add your production URL when deploying
   
   - **Authorized redirect URIs:**
     - `http://localhost:5173` (for development)
     - Add your production URL when deploying

6. **Copy Your Client ID**
   - After creating, copy the Client ID (looks like: `xxxxx.apps.googleusercontent.com`)

7. **Add Client ID to Your Project**
   - Open `src/main.jsx`
   - Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:
   ```jsx
   const GOOGLE_CLIENT_ID = "xxxxx.apps.googleusercontent.com"
   ```

## 📦 Installed Packages

- ✅ `@react-oauth/google` - Google OAuth integration
- ✅ `lucide-react` - Icons for the UI
- ✅ `react-router-dom` - Routing (already installed)
- ✅ `flowbite-react` - UI components
- ✅ `react-icons` - Additional icons

## 🚀 Running the App

```bash
npm run dev
```

Then visit: http://localhost:5173/login

## 📁 Created Files

- ✅ `src/pages/Login.jsx` - Login page with Google OAuth
- ✅ `src/components/MyToast.jsx` - Toast notifications
- ✅ `src/utils/googleUtils.js` - Google token utilities
- ✅ `src/main.jsx` - Wrapped with GoogleOAuthProvider

## 🔐 How Authentication Works

1. User clicks "Google" button on login page
2. Google OAuth popup appears
3. User logs in with Google account
4. On success:
   - Access token is stored in `localStorage`
   - Success toast appears
   - User is redirected to home page after 3 seconds
5. On error:
   - Error toast appears with failure message

## 💾 LocalStorage Keys

- `access_token` - Google OAuth access token
- `profile_photo` - User's Google profile picture URL
- `google_id_token` - Google ID token for profile data

## 🎨 Available Utility Functions

From `src/utils/googleUtils.js`:

- `fetchGoogleProfile(accessToken)` - Get user profile data
- `storeGoogleToken(token)` - Store access token
- `getGoogleToken()` - Retrieve access token
- `removeGoogleToken()` - Clear all auth data
- `isAuthenticated()` - Check if user is logged in
- `storeProfilePhoto(url)` - Store profile photo
- `getProfilePhoto()` - Get profile photo

## 🔧 Customization

### Change Redirect After Login

In `src/pages/Login.jsx`, line ~25:

```jsx
setTimeout(() => {
  navigate("/dashboard") // Change "/" to your desired route
}, 3000);
```

### Adjust Toast Duration

In `src/components/MyToast.jsx`, modify the timeout value.

## ⚠️ Important Notes

- The app will not work until you add your Google Client ID
- Make sure your Google Cloud Console project has the correct authorized origins
- For production, update the authorized origins to match your production URL

## 🆘 Troubleshooting

### "Error: [Google Identity Services] Invalid `client_id`"
→ You haven't replaced `YOUR_GOOGLE_CLIENT_ID_HERE` in `main.jsx`

### "redirect_uri_mismatch"
→ Add your app's URL to authorized redirect URIs in Google Cloud Console

### Login popup blocked
→ Allow popups for localhost in your browser settings

---

**Need help?** Check the Google OAuth documentation: https://developers.google.com/identity/oauth2/web/guides/overview
