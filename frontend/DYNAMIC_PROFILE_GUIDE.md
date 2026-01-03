# Dynamic Employee Profile Management Guide

## Overview
The Profile page has been transformed into a dynamic component that supports two modes:
1. **Employee Mode**: Employees view their own profile (read-only/limited editing)
2. **Admin Mode**: Admins can view and edit any employee's complete profile including salary details

## Features Implemented

### 1. Dynamic Employee Profile Loading
- **URL Parameter**: Uses `?id=` query parameter to specify which employee to view
- **Example URLs**:
  - Employee viewing own profile: `/profile`
  - Admin viewing employee: `/profile?id=EMP001`

### 2. Admin Capabilities
When an admin views an employee profile (`/profile?id=<employeeId>`):
- ✅ All fields become editable with edit icons
- ✅ Can view and edit salary information
- ✅ Can modify personal details (DOB, gender, nationality, etc.)
- ✅ Can update employment details (PAN, UAN, etc.)
- ✅ Can edit bank details
- ✅ Can modify emergency contact information
- ✅ Visual banner indicating admin is viewing employee profile
- ✅ Save button to persist changes

### 3. Employee View
When an employee views their own profile (`/profile`):
- Shows current profile page as-is
- All three tabs: Resume, Private Info, Salary Info
- Fields remain as originally configured (some editable, some read-only)

### 4. Integration with Dashboard
The admin dashboard now includes:
- **"Edit Full Profile" button** in employee detail modal
- Clicking opens the dynamic profile page with full edit capabilities
- Seamless navigation between dashboard and profile editing

## Technical Implementation

### URL Structure
```javascript
// Employee viewing own profile
/profile

// Admin viewing/editing employee profile
/profile?id=EMP001
```

### Key Components Updated

#### Profile.jsx
```javascript
// Imports
import { useSearchParams } from 'react-router-dom';

// Get employee ID from URL
const [searchParams] = useSearchParams();
const employeeId = searchParams.get('id');

// Determine if admin is viewing employee
const isViewingEmployee = isAdmin && employeeId;
const canEdit = isAdmin && isViewingEmployee;

// Dynamic tab configuration
const getAvailableTabs = () => {
  if (isAdmin && isViewingEmployee) {
    return ['resume', 'private-info', 'salary-info']; // Admin sees all
  }
  if (isAdmin && !isViewingEmployee) {
    return ['resume', 'private-info']; // Admin own profile
  }
  return ['resume', 'private-info', 'salary-info']; // Employee
};
```

#### Dashboard.jsx
```javascript
// Added "Edit Full Profile" button in modal
<Link
  to={`/profile?id=${selectedEmployee.id}`}
  className="..."
>
  <Edit className="w-4 h-4 mr-2" />
  Edit Full Profile
</Link>
```

### State Management
```javascript
const [editableData, setEditableData] = useState({});

// Handle field changes
const handleFieldChange = (field, value) => {
  setEditableData(prev => ({
    ...prev,
    [field]: value
  }));
};

// Save changes
const handleSave = async () => {
  // API call to save employee data
  console.log('Saving employee data:', editableData);
  alert('Employee details updated successfully!');
};
```

## Field Edit Controls

All fields in Private Info tab use conditional rendering:

```javascript
<input 
  type="text"
  className={`... ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 ...'}`}
  value={editableData.fieldName || ''}
  onChange={(e) => handleFieldChange('fieldName', e.target.value)}
  readOnly={!canEdit}
/>
```

**Edit Icons** appear only when admin is viewing employee:
```javascript
{canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
```

## Visual Indicators

### Admin Viewing Banner
When admin views employee profile, a blue banner appears at the top:
```
ℹ️ Admin View: You are viewing and editing Sarah Johnson's profile (ID: EMP001)
```

### Save Button
Only visible when admin is editing employee profile:
```javascript
{canEdit && (
  <button onClick={handleSave}>
    Save Changes
  </button>
)}
```

## Usage Flow

### For Admins:
1. Navigate to Dashboard
2. Click on any employee card
3. Employee detail modal opens
4. Click "Edit Full Profile" button
5. Full profile page opens with all fields editable
6. Make changes to any field
7. Click "Save Changes" to persist
8. See success message

### For Employees:
1. Navigate to Profile (from nav menu)
2. View own profile in standard mode
3. Edit allowed fields as before
4. No access to other employees' profiles

## API Integration Points

The following API endpoints should be implemented:

### Fetch Employee Data(for admin)
```javascript
// GET /employees/:emp_id
// Returns full employee profile data```
```json
{
  "employee": {
    "id": "string",
    "company_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "phone": "string",
    "department": "string",
    "email": "user@example.com",
    "manager": "string",
    "location": "string",
    "job_position": "string",
    "prof_pic": "string",
    "current_status": 0
  },
  "private_info": {
    "emp_id": "string",
    "dob": "2026-01-03",
    "address": "string",
    "nationality": "string",
    "gender": "string",
    "martial_status": true,
    "doj": "2026-01-03",
    "bank_acc_no": "string",
    "bank_name": "string",
    "ifsc_code": "string",
    "pan_no": "string",
    "uan_no": "string"
  },
  "salary": {
    "emp_id": "string",
    "monthly_wage": 0,
    "yearly_wage": 0,
    "basic_sal": 0,
    "hra": 0,
    "sa": 0,
    "perf_bonus": 0,
    "ita": 0,
    "fa": 0,
    "pf1": 0,
    "pf2": 0,
    "prof_tax": 0
  },
  "resume": {
    "emp_id": "string",
    "about": 0,
    "skills": "string",
    "certification": "string"
  },
  "attendance_records": [],
  "leave_records": [],
  "summary": {
    "emp_id": "string",
    "present_days": 0,
    "leave_count": 0,
    "leave_left": 0,
    "tot_work_days": 0
  }
}
```

### Update Employee Data
```javascript
// PUT /api/admin/employee/:employeeId
// Body: { ...editableData }
// Updates employee profile
    ```json
    {
  "name": "string",
  "phone": "string",
  "department": "string",
  "email": "user@example.com",
  "manager": "string",
  "location": "string",
  "job_position": "string",
  "prof_pic": "string",
  "current_status": 0
}```
```

### Fetch Own Profile
```javascript
// GET /employees/emp_id
// Returns current user's profile
```json
{
  "id": "string",
  "company_id": "string",
  "name": "string",
  "phone": "string",
  "department": "string",
  "email": "string",
  "manager": "string",
  "location": "string",
  "job_position": "string",
  "resume": "string",
  "prof_pic": "string",
  "current_status": 0,
  "role": "employee",
  "private_info": {
    "emp_id": "string",
    "dob": "2026-01-03",
    "address": "string",
    "nationality": "string",
    "gender": "string",
    "martial_status": true,
    "doj": "2026-01-03",
    "bank_acc_no": "string",
    "bank_name": "string",
    "ifsc_code": "string",
    "pan_no": "string",
    "uan_no": "string"
  },
  "resume_data": {
    "emp_id": "string",
    "about": 0,
    "skills": "string",
    "certification": "string",
    "column_0": 0
  },
  "salary": {
    "emp_id": "string",
    "monthly_wage": 0,
    "yearly_wage": 0,
    "basic_sal": 0,
    "hra": 0,
    "sa": 0,
    "perf_bonus": 0,
    "ita": 0,
    "fa": 0,
    "pf1": 0,
    "pf2": 0,
    "prof_tax": 0
  }
}

```

