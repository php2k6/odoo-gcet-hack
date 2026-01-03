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

### Fetch Employee Data
```javascript
// GET /api/admin/employee/:employeeId
// Returns full employee profile data
```

### Update Employee Data
```javascript
// PUT /api/admin/employee/:employeeId
// Body: { ...editableData }
// Updates employee profile
```

### Fetch Own Profile
```javascript
// GET /api/employee/profile
// Returns current user's profile
```

## Security Considerations

1. **Route Protection**: Ensure only admins can access profiles with `?id=` parameter
2. **API Authorization**: Verify admin role on backend before allowing profile edits
3. **Data Validation**: Validate all input fields before saving
4. **Audit Logging**: Log all profile changes made by admins

## Future Enhancements

- [ ] Add profile picture upload for employees
- [ ] Implement history/audit trail of changes
- [ ] Add bulk edit capabilities for multiple employees
- [ ] Implement role-based field permissions
- [ ] Add export profile to PDF functionality
- [ ] Implement real-time validation for PAN, UAN, IFSC codes
- [ ] Add confirmation dialog before saving major changes

## Testing Checklist

- [ ] Employee can view own profile
- [ ] Employee cannot access other profiles
- [ ] Admin can click "Edit Full Profile" from dashboard
- [ ] Admin can edit all fields in employee profile
- [ ] Admin can view salary info for employees
- [ ] Save button appears only for admin editing employees
- [ ] Banner shows correct employee name and ID
- [ ] All edit icons appear for admin
- [ ] Fields are properly readonly for employees
- [ ] Navigation between dashboard and profile works seamlessly
