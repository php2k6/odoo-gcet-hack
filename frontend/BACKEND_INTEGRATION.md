# Backend Integration - Company Signup

## Changes Made

### 1. Updated authService.js
**File**: `src/utils/authService.js`

**Changes**:
- Modified `signup()` function to use `/auth/company/signup` endpoint
- Request body now sends:
  ```javascript
  {
    company_name: userData.companyName,
    email: userData.email,
    password: userData.password
  }
  ```
- Response handling updated to match backend structure:
  ```javascript
  {
    id: number,
    company_name: string,
    email: string
  }
  ```
- Automatically sets user role to 'admin' for company signups
- Stores user data in localStorage (compatible with existing auth flow)

### 2. Updated api.js
**File**: `src/utils/api.js`

**Changes**:
- Changed environment variable from `VITE_API_URL` to `VITE_BACKEND_API_URL`
- Base URL now: `https://phpx.live`
- Maintains existing interceptors for auth token and error handling

### 3. Updated Signup.jsx
**File**: `src/pages/Signup.jsx`

**Changes**:
- Modified form submission to send only required fields:
  - `companyName` (mapped to `company_name`)
  - `email`
  - `password`
- Removed unnecessary fields from signup request (name, phone, logo)
- Enhanced error handling with better error message extraction
- Added visual error display component above Sign Up button
- Error messages now extracted from:
  - `error.response.data.message`
  - `error.response.data.error`
  - `error.message`

### 4. Environment Configuration
**Files**: `.env` and `.env.example`

**Changes**:
- Created `.env` file with production backend URL
- Updated `.env.example` to use `https://` protocol
- Backend API URL: `https://phpx.live`

## API Integration Details

### Endpoint
```
POST /auth/company/signup
```

### Request Body
```json
{
  "company_name": "string",
  "email": "string",
  "password": "string"
}
```

### Response Body (Success)
```json
{
  "id": 1,
  "company_name": "Tech Corp",
  "email": "admin@techcorp.com"
}
```

### Error Response (Expected)
```json
{
  "message": "Error description",
  "error": "Error type"
}
```

## User Flow

1. User fills signup form with:
   - Company Name
   - Email
   - Password
   - Confirm Password
   
2. Frontend validates:
   - All fields are required
   - Email format
   - Password strength (8+ chars, uppercase, lowercase, number, special char)
   - Password confirmation matches

3. On submit:
   - Frontend sends POST request to `https://phpx.live/auth/company/signup`
   - Backend creates company and admin user
   - Backend responds with user ID, company name, and email

4. Frontend receives response:
   - Stores user data in localStorage
   - Sets user role as 'admin' and `isAdmin: true`
   - Redirects to `/dashboard`

5. Error handling:
   - Displays error message in red box above Sign Up button
   - User can correct and retry

## Testing

### Test the Integration:

1. **Start the frontend dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Signup page**: `http://localhost:5173/signup`

3. **Fill in the form**:
   - Company Name: "Test Company"
   - Email: "test@example.com"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"

4. **Click Sign Up**

5. **Expected Results**:
   - Success: Redirects to dashboard
   - Error: Shows error message in red box

### Check Network Request:

Open DevTools → Network tab and verify:

**Request**:
```
URL: https://phpx.live/auth/company/signup
Method: POST
Headers: Content-Type: application/json
Body:
{
  "company_name": "Test Company",
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

**Response** (should be):
```json
{
  "id": 123,
  "company_name": "Test Company",
  "email": "test@example.com"
}
```

## Notes

- The backend endpoint doesn't return a JWT token yet
- User authentication relies on stored user data in localStorage
- Future: Implement token-based authentication if backend adds token support
- The signup form still displays name, phone, and logo upload fields but doesn't send them
- These fields can be removed or used for future profile updates

## Next Steps

1. ✅ Test signup with real backend
2. ⏳ Implement login endpoint integration
3. ⏳ Add JWT token handling if backend provides it
4. ⏳ Update AuthContext to handle token-based auth
5. ⏳ Add company profile completion after signup (name, phone, logo)
