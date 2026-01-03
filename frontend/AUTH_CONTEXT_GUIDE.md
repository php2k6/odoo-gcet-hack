# AuthContext Usage Guide

This guide explains how to use the AuthContext for managing user authentication and role-based access in the application.

## Overview

The AuthContext provides centralized authentication state management using React Context API. It stores user information including role (admin/employee) and provides methods for login, signup, and logout operations.

## Setup

The AuthProvider is already wrapped around the app in `main.jsx`:

```jsx
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>
```

## Using the Context

### Import the hook

```jsx
import { useAuth } from '../context/AuthContext';
```

### Available Properties and Methods

```jsx
const {
  user,           // Current user object with all user data
  isAdmin,        // Boolean: true if user is admin
  userRole,       // String: 'admin' or 'employee'
  isLoading,      // Boolean: true while loading user data
  isAuthenticated, // Boolean: true if user is logged in
  login,          // Function: (credentials) => Promise
  signup,         // Function: (userData) => Promise
  logout,         // Function: () => void
  updateUser      // Function: (updatedUser) => void
} = useAuth();
```

## Examples

### 1. Check if user is authenticated

```jsx
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

### 2. Display user information

```jsx
const { user, userRole } = useAuth();

return (
  <div>
    <h1>Welcome, {user?.name}</h1>
    <p>Role: {userRole}</p>
  </div>
);
```

### 3. Role-based rendering

```jsx
const { isAdmin } = useAuth();

return (
  <div>
    {isAdmin ? (
      <AdminDashboard />
    ) : (
      <EmployeeDashboard />
    )}
  </div>
);
```

### 4. Login form

```jsx
const { login } = useAuth();
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await login({ email, password });
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 5. Logout

```jsx
const { logout } = useAuth();

const handleLogout = () => {
  logout(); // Clears user data and redirects to login
};
```

### 6. Update user profile

```jsx
const { user, updateUser } = useAuth();

const handleProfileUpdate = async (newData) => {
  try {
    // Call API to update profile
    // const response = await api.put('/profile', newData);
    
    // Update context
    updateUser({
      ...user,
      ...newData
    });
  } catch (error) {
    console.error('Update failed:', error);
  }
};
```

## User Object Structure

The user object returned from the backend should include:

```javascript
{
  id: "user_id",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  role: "admin", // or "employee"
  isAdmin: true, // or false
  employeeId: "EMP001",
  department: "Engineering",
  designation: "Software Engineer",
  joinDate: "2023-01-15",
  location: "San Francisco, CA",
  manager: "Jane Smith",
  // ... other user properties
}
```

## Backend Integration

### Login Endpoint

```javascript
POST /api/auth/login
Body: { email, password }
Response: { token, user: { ...userObject } }
```

### Signup Endpoint

```javascript
POST /api/auth/signup
Body: { name, email, password, phone, companyName, ... }
Response: { token, user: { ...userObject } }
```

### Important Notes

1. The auth token is automatically included in API requests via axios interceptors
2. If a 401 response is received, the user is automatically logged out
3. User data persists in localStorage across page refreshes
4. The `isAdmin` flag is determined by checking if `user.role === 'admin'` or `user.isAdmin === true`

## Environment Variables

Set your API base URL in `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

## Components Updated

The following components have been updated to use AuthContext:

- ✅ `Login.jsx` - Uses `login()` method
- ✅ `Signup.jsx` - Uses `signup()` method
- ✅ `Dashboard.jsx` - Uses `userRole` and `isAdmin`
- ✅ `EmployeeProfile.jsx` - Uses `user`, `userRole`, and `updateUser()`
- ✅ `AdminNav.jsx` - Already linked to /profile
- ✅ `EmployeeNav.jsx` - Already linked to /profile

## Protected Routes (Optional Enhancement)

You can create a ProtectedRoute component:

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
```

Usage in routes:

```jsx
{
  path: 'dashboard',
  element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
}
```
