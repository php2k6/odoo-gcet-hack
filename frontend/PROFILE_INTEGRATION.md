# Profile Component - Backend Integration Guide

## Overview
The unified Profile component (`/src/pages/EmployeeProfile.jsx`) supports role-based rendering for both **admin** and **employee** users. This document explains how to integrate backend data and implement role-based access control.

---

## Table of Contents
1. [User Role Management](#user-role-management)
2. [API Endpoints](#api-endpoints)
3. [Data Structure](#data-structure)
4. [Role-Based Tab Visibility](#role-based-tab-visibility)
5. [Implementation Examples](#implementation-examples)
6. [Security Considerations](#security-considerations)

---

## User Role Management

### Getting User Role from Backend

The component expects a `userRole` value that can be either `'admin'` or `'employee'`. You should fetch this from your authentication context or backend.

### Method 1: From Authentication Context (Recommended)

```javascript
// Create an AuthContext (src/contexts/AuthContext.jsx)
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Fetch user data on mount
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    
    fetchUser();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

**Update Profile Component:**
```javascript
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(user?.role || 'employee');
  // ... rest of component
}
```

### Method 2: From localStorage

```javascript
export default function Profile() {
  const [userRole, setUserRole] = useState(
    localStorage.getItem('userRole') || 'employee'
  );
  // ... rest of component
}
```

### Method 3: From Backend Response

```javascript
export default function Profile() {
  const [userRole, setUserRole] = useState('employee');
  
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUserRole(data.role))
      .catch(err => console.error(err));
  }, []);
  // ... rest of component
}
```

---

## API Endpoints

### Required Backend Endpoints

#### 1. Get Current User Profile
```
GET /api/profile
Headers: Authorization: Bearer <token>

Response:
{
  "role": "employee", // or "admin"
  "name": "John Doe",
  "loginId": "EMP001",
  "company": "Tech Corp",
  "email": "john.doe@company.com",
  "department": "Engineering",
  "mobile": "+1 234 567 8900",
  "manager": "Jane Smith", // only for employees
  "location": "New York, USA",
  "dateOfBirth": "1990-05-15",
  "gender": "Male",
  "nationality": "Indian",
  "maritalStatus": "Single",
  "personalEmail": "john.personal@email.com",
  "residingAddress": "123 Main St, New York, NY",
  "dateOfJoining": "2020-01-15",
  "empCode": "EMP001",
  "panNo": "ABCDE1234F",
  "uanNo": "123456789012",
  "accountNumber": "1234567890",
  "bankName": "State Bank",
  "ifscCode": "SBIN0001234",
  "emergencyContactName": "Jane Doe",
  "emergencyPhone": "+1 234 567 8901",
  "skills": ["JavaScript", "React", "Node.js"],
  "certifications": ["AWS Certified Developer"],
  "about": "Lorem ipsum...",
  "jobLove": "Lorem ipsum...",
  "hobbies": "Lorem ipsum..."
}
```

#### 2. Update Profile
```
PUT /api/profile
Headers: Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "personalEmail": "new.email@example.com",
  "residingAddress": "New address",
  "maritalStatus": "Married",
  "accountNumber": "9876543210",
  "bankName": "New Bank",
  "ifscCode": "NEWB0009876",
  "emergencyContactName": "John Doe",
  "emergencyPhone": "+1 987 654 3210"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated profile data */ }
}
```

#### 3. Get Salary Information (Employee Only)
```
GET /api/profile/salary
Headers: Authorization: Bearer <token>

Response:
{
  "baseSalary": 85000,
  "monthlySalary": 5850,
  "paySlips": [
    {
      "month": "December 2024",
      "downloadUrl": "/api/payslips/2024-12"
    },
    {
      "month": "November 2024",
      "downloadUrl": "/api/payslips/2024-11"
    }
  ]
}
```

---

## Data Structure

### Profile Data Interface

```typescript
interface ProfileData {
  // Basic Information
  role: 'admin' | 'employee';
  name: string;
  loginId: string;
  company: string;
  email: string;
  department: string;
  mobile: string;
  location: string;
  
  // Employee-only field
  manager?: string;
  
  // Private Information
  dateOfBirth: string; // ISO date format
  gender: string;
  nationality: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  personalEmail: string;
  residingAddress: string;
  dateOfJoining: string; // ISO date format
  
  // Employment Details (Read-only)
  empCode: string;
  panNo: string;
  uanNo: string;
  
  // Bank Details (Editable)
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  
  // Emergency Contact (Editable)
  emergencyContactName: string;
  emergencyPhone: string;
  
  // Resume Information
  skills: string[];
  certifications: string[];
  about: string;
  jobLove: string;
  hobbies: string;
  
  // Salary (Employee only)
  salaryInfo?: {
    baseSalary: number;
    monthlySalary: number;
    paySlips: Array<{
      month: string;
      downloadUrl: string;
    }>;
  };
}
```

---

## Role-Based Tab Visibility

### Current Implementation

```javascript
const getAvailableTabs = () => {
  if (userRole === 'admin') {
    return ['resume', 'private-info']; // Admin cannot see salary info
  }
  return ['resume', 'private-info', 'salary-info']; // Employee sees all
};
```

### Customizing Tab Visibility

You can modify this based on your business rules:

```javascript
const getAvailableTabs = () => {
  const tabs = ['resume', 'private-info'];
  
  // Add salary tab only for employees
  if (userRole === 'employee') {
    tabs.push('salary-info');
  }
  
  // Add admin-specific tabs
  if (userRole === 'admin') {
    tabs.push('team-management');
  }
  
  return tabs;
};
```

---

## Implementation Examples

### Complete Integration Example

```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth(); // Get authenticated user
  const [userRole, setUserRole] = useState(user?.role || 'employee');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('resume');

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfileData(data);
        setUserRole(data.role);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update
  const handleSaveChanges = async (updatedFields) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      setProfileData(result.data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  // ... rest of component JSX
}
```

### Axios Integration Example

```javascript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function Profile() {
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        setProfileData(data);
        setUserRole(data.role);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveChanges = async (updatedFields) => {
    try {
      const { data } = await api.put('/profile', updatedFields);
      setProfileData(data.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update profile');
    }
  };
}
```

---

## Security Considerations

### 1. Authentication
Always verify the user is authenticated before accessing profile data:

```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login
    window.location.href = '/login';
    return;
  }
  
  fetchProfile();
}, []);
```

### 2. Role Verification
Verify role on the backend, never trust frontend role checks:

```javascript
// Backend (Express example)
app.get('/api/profile/salary', authenticateToken, (req, res) => {
  // Check if user is employee
  if (req.user.role !== 'employee') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Return salary data
  res.json(salaryData);
});
```

### 3. Data Validation
Always validate and sanitize input on the backend:

```javascript
// Backend validation example
app.put('/api/profile', authenticateToken, (req, res) => {
  const allowedFields = [
    'personalEmail', 
    'residingAddress', 
    'maritalStatus',
    'accountNumber',
    'bankName',
    'ifscCode',
    'emergencyContactName',
    'emergencyPhone'
  ];
  
  // Only update allowed fields
  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = sanitize(req.body[field]);
    }
  });
  
  // Save to database
  // ...
});
```

### 4. Read-only Fields
Some fields should never be editable via the profile page:
- `empCode`
- `panNo`
- `uanNo`
- `dateOfBirth`
- `gender`
- `nationality`
- `dateOfJoining`

Ensure backend rejects attempts to modify these fields.

---

## Route Configuration

### Updated Routes in main.jsx

```javascript
{
  path: 'profile',
  element: <Profile />, // Unified profile for both roles
}
```

### Access URLs
- Admin Profile: `/profile` (with admin role)
- Employee Profile: `/profile` (with employee role)

The same route serves both, but displays different content based on role.

---

## Testing Checklist

- [ ] Admin user can access `/profile`
- [ ] Employee user can access `/profile`
- [ ] Admin cannot see "Salary Info" tab
- [ ] Employee can see all three tabs
- [ ] Read-only fields cannot be edited
- [ ] Editable fields save correctly
- [ ] Unauthorized users are redirected to login
- [ ] Profile data loads from backend
- [ ] Error states display correctly
- [ ] Loading states display correctly

---

## Support

For questions or issues, please contact the development team or refer to the main project documentation.
