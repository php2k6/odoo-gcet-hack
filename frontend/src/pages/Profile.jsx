import React, { useState, useEffect } from 'react';
import { Edit, Plus, Save, X, Trash2 } from 'lucide-react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import SalaryInfo from '../components/SalaryInfo';
import { useAuth } from '../context/AuthContext';
import EmployeeNav from '../components/EmployeeNav';
import api, { updateEmployeeDetails, updateEmployeeResume, updateEmployeeSalary, deleteEmployee } from '../utils/api';
import MyToast from '../components/MyToast';


// Unified Profile Component - supports both employee and admin views
export default function Profile() {
    console.log("Profile component loaded");
    
    // Get employee ID from URL params (for admin viewing employee profile)
    const [searchParams] = useSearchParams();
    const employeeId = searchParams.get('id');
    const navigate = useNavigate();
    
    // Get user role and data from authentication context
    const { user, userRole, isAdmin, isLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState('resume');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState('profile');
    const [isViewingEmployee, setIsViewingEmployee] = useState(false);
    const [editableData, setEditableData] = useState({});
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [editableResumeData, setEditableResumeData] = useState({});
    const [salaryData, setSalaryData] = useState(null);
    const [editableSalaryData, setEditableSalaryData] = useState({});
    const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
    const [isEditingResume, setIsEditingResume] = useState(false);
    const [isEditingSalary, setIsEditingSalary] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Use fetched resume data or fallback to demo data
    const skills = (isEditingResume ? editableResumeData.skills : resumeData?.skills) || ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS'];
    const certifications = (isEditingResume ? editableResumeData.certification : resumeData?.certification) || ['AWS Certified Developer', 'React Professional'];
    
    // Show toast message
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Fetch profile data based on role and employee ID
    useEffect(() => {
        // Check if admin is viewing an employee's profile
        const viewingEmployee = isAdmin && employeeId;
        setIsViewingEmployee(viewingEmployee);
        
        // Fetch employee data
        const fetchEmployeeData = async () => {
            setApiLoading(true);
            setApiError(null);
            
            try {
                let response;
                
                // Admin viewing specific employee
                if (viewingEmployee) {
                    response = await api.get(`/employees/${employeeId}`);
                    const data = response.data;
                    
                    // Map API response for admin viewing employee
                    const mappedData = {
                        id: data.employee?.id || employeeId,
                        name: data.employee?.name || '',
                        loginId: data.private_info?.emp_id || employeeId,
                        company: data.employee?.company_id || '',
                        email: data.employee?.email || '',
                        department: data.employee?.department || '',
                        mobile: data.employee?.phone || '',
                        manager: data.employee?.manager || '',
                        location: data.employee?.location || '',
                        role: data.employee?.job_position || '',
                        // Private info fields
                        dob: data.private_info?.dob || '',
                        gender: data.private_info?.gender || '',
                        nationality: data.private_info?.nationality || '',
                        maritalStatus: data.private_info?.martial_status ? 'Married' : 'Single',
                        personalEmail: data.employee?.email || '',
                        dateOfJoining: data.private_info?.doj || '',
                        residingAddress: data.private_info?.address || '',
                        empCode: data.private_info?.emp_id || '',
                        panNo: data.private_info?.pan_no || '',
                        uanNo: data.private_info?.uan_no || '',
                        accountNumber: data.private_info?.bank_acc_no || '',
                        bankName: data.private_info?.bank_name || '',
                        ifscCode: data.private_info?.ifsc_code || '',
                        emergencyContactName: '',
                        emergencyPhone: '',
                        currentStatus: data.employee?.current_status,
                        profPic: data.employee?.prof_pic,
                    };
                    
                    setProfileData(mappedData);
                    setEditableData(mappedData);
                    
                    // Store resume data
                    if (data.resume) {
                        const resumeInfo = {
                            about: data.resume.about || '',
                            skills: data.resume.skills ? data.resume.skills.split(',').map(s => s.trim()) : [],
                            certification: data.resume.certification ? data.resume.certification.split(',').map(c => c.trim()) : []
                        };
                        setResumeData(resumeInfo);
                        setEditableResumeData(resumeInfo);
                    }
                    
                    // Store salary data
                    if (data.salary) {
                        setSalaryData(data.salary);
                        setEditableSalaryData(data.salary);
                    }
                    
                } else if (userRole === 'employee') {
                    // Employee viewing own profile
                    response = await api.get('/auth/employee/me');
                    const data = response.data;
                    
                    // Map API response to profile data structure
                    const mappedData = {
                        id: data.id,
                        name: data.name,
                        loginId: data.private_info?.emp_id || data.id,
                        company: data.company_id,
                        email: data.email,
                        department: data.department,
                        mobile: data.phone,
                        manager: data.manager,
                        location: data.location,
                        role: data.job_position,
                        // Private info fields
                        dob: data.private_info?.dob || '',
                        gender: data.private_info?.gender || '',
                        nationality: data.private_info?.nationality || '',
                        maritalStatus: data.private_info?.martial_status ? 'Married' : 'Single',
                        personalEmail: data.email,
                        dateOfJoining: data.private_info?.doj || '',
                        residingAddress: data.private_info?.address || '',
                        empCode: data.private_info?.emp_id || '',
                        panNo: data.private_info?.pan_no || '',
                        uanNo: data.private_info?.uan_no || '',
                        accountNumber: data.private_info?.bank_acc_no || '',
                        bankName: data.private_info?.bank_name || '',
                        ifscCode: data.private_info?.ifsc_code || '',
                        emergencyContactName: '',
                        emergencyPhone: '',
                        // Additional data
                        currentStatus: data.current_status,
                        profPic: data.prof_pic,
                        resume: data.resume
                    };
                    
                    setProfileData(mappedData);
                    setEditableData(mappedData);
                    
                    // Store resume data separately
                    if (data.resume_data) {
                        setResumeData({
                            about: data.resume_data.about,
                            skills: data.resume_data.skills ? data.resume_data.skills.split(',').map(s => s.trim()) : [],
                            certification: data.resume_data.certification ? data.resume_data.certification.split(',').map(c => c.trim()) : []
                        });
                    }
                    
                    // Store salary data separately
                    if (data.salary) {
                        setSalaryData(data.salary);
                    }
                    
                } else if (isAdmin && !viewingEmployee) {
                    // Admin viewing own profile - use demo data for now
                    setDemoData();
                }
                
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setApiError(error.response?.data?.message || 'Failed to load profile data');
                // Fall back to demo data on error
                setDemoData();
            } finally {
                setApiLoading(false);
            }
        };

        const setDemoData = () => {
            let demoData;
            if (viewingEmployee) {
                // Admin viewing employee profile - fetch employee data
                demoData = {
                    id: employeeId,
                    name: 'Sarah Johnson',
                    loginId: employeeId,
                    company: 'Tech Corp',
                    email: 'sarah.j@company.com',
                    department: 'Engineering',
                    mobile: '+1 234-567-8901',
                    manager: 'John Doe',
                    location: 'New York, USA',
                    role: 'Senior Developer',
                    dob: '1990-05-15',
                    gender: 'Female',
                    nationality: 'American',
                    maritalStatus: 'Single',
                    personalEmail: 'sarah.personal@email.com',
                    dateOfJoining: '2022-01-15',
                    residingAddress: '123 Main Street, Apartment 4B, New York, NY 10001',
                    empCode: employeeId,
                    panNo: 'ABCDE1234F',
                    uanNo: '123456789012',
                    accountNumber: '1234567890',
                    bankName: 'ABC Bank',
                    ifscCode: 'ABCD0123456',
                    emergencyContactName: 'Mike Johnson',
                    emergencyPhone: '+1 234-567-8999',
                };
            } else {
                // Admin viewing own profile
                demoData = {
                    name: user?.name || (userRole === 'employee' ? 'My Name' : 'Admin User'),
                    loginId: user?.loginId || user?.employeeId || 'EMP001',
                    company: user?.company || 'Tech Corp',
                    email: user?.email || (userRole === 'employee' ? 'employee@company.com' : 'admin@company.com'),
                    department: user?.department || 'Engineering',
                    mobile: user?.mobile || user?.phone || '+1 234 567 8900',
                    manager: user?.manager || 'John Doe',
                    location: user?.location || 'New York, USA',
                    dob: '1990-05-15',
                    gender: 'Male',
                    nationality: 'Indian',
                    maritalStatus: 'Single',
                    personalEmail: 'personal@email.com',
                    dateOfJoining: '2020-01-15',
                    residingAddress: '456 Park Avenue, New York, NY',
                    empCode: 'EMP001',
                    panNo: 'ABCDE1234F',
                    uanNo: '123456789012',
                    accountNumber: '',
                    bankName: '',
                    ifscCode: '',
                    emergencyContactName: '',
                    emergencyPhone: '',
                };
            }
            
            setProfileData(demoData);
            setEditableData(demoData);
        };

        fetchEmployeeData();
    }, [user, userRole, isAdmin, employeeId]);

    // Determine which tabs to show based on role
    const getAvailableTabs = () => {
        // If admin is viewing an employee profile, show all tabs including salary
        if (isAdmin && isViewingEmployee) {
            return ['resume', 'private-info', 'salary-info'];
        }
        // If admin is viewing their own profile, hide salary info
        if (isAdmin && !isViewingEmployee) {
            return ['resume', 'private-info'];
        }
        // Employee viewing their own profile sees all tabs
        return ['resume', 'private-info', 'salary-info'];
    };

    const availableTabs = getAvailableTabs();
    
    // Determine if fields should be editable
    const canEdit = isAdmin && isViewingEmployee;
    
    // Handle field changes
    const handleFieldChange = (field, value) => {
        setEditableData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    // Handle resume field changes
    const handleResumeFieldChange = (field, value) => {
        setEditableResumeData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    // Handle salary field changes
    const handleSalaryFieldChange = (field, value) => {
        setEditableSalaryData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    // Handle basic info save
    const handleSaveBasicInfo = async () => {
        if (!canEdit || !employeeId) return;
        
        setApiLoading(true);
        setApiError(null);
        
        try {
            // Prepare data for API
            const updateData = {
                name: editableData.name,
                phone: editableData.mobile,
                department: editableData.department,
                email: editableData.email,
                manager: editableData.manager,
                location: editableData.location,
                job_position: editableData.role,
                prof_pic: editableData.profPic || '',
                current_status: editableData.currentStatus || 0
            };
            
            // Send update request
            await updateEmployeeDetails(employeeId, updateData);
            
            // Update local state
            setProfileData(editableData);
            setIsEditingBasicInfo(false);
            
            showToast('Employee basic details updated successfully!', 'success');
            
        } catch (error) {
            console.error('Error updating employee data:', error);
            setApiError(error.response?.data?.message || 'Failed to update employee data');
            showToast(`Failed to update: ${error.response?.data?.message || error.message}`, 'error');
        } finally {
            setApiLoading(false);
        }
    };
    
    // Handle resume save
    const handleSaveResume = async () => {
        if (!canEdit || !employeeId) return;
        
        setApiLoading(true);
        setApiError(null);
        
        try {
            // Prepare data for API
            const updateData = {
                about: editableResumeData.about || '',
                skills: Array.isArray(editableResumeData.skills) 
                    ? editableResumeData.skills.join(', ') 
                    : editableResumeData.skills || '',
                certification: Array.isArray(editableResumeData.certification)
                    ? editableResumeData.certification.join(', ')
                    : editableResumeData.certification || ''
            };
            
            // Send update request
            await updateEmployeeResume(employeeId, updateData);
            
            // Update local state
            setResumeData(editableResumeData);
            setIsEditingResume(false);
            
            showToast('Employee resume updated successfully!', 'success');
            
        } catch (error) {
            console.error('Error updating resume data:', error);
            setApiError(error.response?.data?.message || 'Failed to update resume data');
            showToast(`Failed to update resume: ${error.response?.data?.message || error.message}`, 'error');
        } finally {
            setApiLoading(false);
        }
    };
    
    // Handle salary save
    const handleSaveSalary = async () => {
        if (!canEdit || !employeeId) return;
        
        setApiLoading(true);
        setApiError(null);
        
        try {
            // Prepare data for API - ensure all fields are numbers
            const updateData = {
                monthly_wage: parseFloat(editableSalaryData.monthly_wage) || 0,
                yearly_wage: parseFloat(editableSalaryData.yearly_wage) || 0,
                basic_sal: parseFloat(editableSalaryData.basic_sal) || 0,
                hra: parseFloat(editableSalaryData.hra) || 0,
                sa: parseFloat(editableSalaryData.sa) || 0,
                perf_bonus: parseFloat(editableSalaryData.perf_bonus) || 0,
                ita: parseFloat(editableSalaryData.ita) || 0,
                fa: parseFloat(editableSalaryData.fa) || 0,
                pf1: parseFloat(editableSalaryData.pf1) || 0,
                pf2: parseFloat(editableSalaryData.pf2) || 0,
                prof_tax: parseFloat(editableSalaryData.prof_tax) || 0
            };
            
            // Send update request
            await updateEmployeeSalary(employeeId, updateData);
            
            // Update local state
            setSalaryData(editableSalaryData);
            setIsEditingSalary(false);
            
            showToast('Employee salary updated successfully!', 'success');
            
        } catch (error) {
            console.error('Error updating salary data:', error);
            setApiError(error.response?.data?.message || 'Failed to update salary data');
            showToast(`Failed to update salary: ${error.response?.data?.message || error.message}`, 'error');
        } finally {
            setApiLoading(false);
        }
    };
    
    // Handle delete employee
    const handleDeleteEmployee = async () => {
        if (!canEdit || !employeeId) return;
        
        const confirmed = window.confirm('Are you sure you want to delete this employee? This action cannot be undone.');
        if (!confirmed) return;
        
        setApiLoading(true);
        
        try {
            await deleteEmployee(employeeId);
            showToast('Employee deleted successfully!', 'success');
            
            // Redirect to dashboard after short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
            
        } catch (error) {
            console.error('Error deleting employee:', error);
            showToast(`Failed to delete employee: ${error.response?.data?.message || error.message}`, 'error');
            setApiLoading(false);
        }
    };
    
    // Cancel editing
    const handleCancelBasicInfo = () => {
        setEditableData(profileData);
        setIsEditingBasicInfo(false);
    };
    
    const handleCancelResume = () => {
        setEditableResumeData(resumeData);
        setIsEditingResume(false);
    };
    
    const handleCancelSalary = () => {
        setEditableSalaryData(salaryData);
        setIsEditingSalary(false);
    };

    if (isLoading || apiLoading || !profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Show error state if API call failed but still render with demo data
    const showErrorBanner = apiError && userRole === 'employee';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" onClick={() => setShowProfileMenu(false)}>
            {/* Header - Unified navigation for all users */}
            <EmployeeNav 
                showProfileMenu={showProfileMenu} 
                setShowProfileMenu={setShowProfileMenu}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Show error banner if API call failed */}
                {showErrorBanner && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    <span className="font-medium">Error loading profile data:</span> {apiError}. Showing demo data.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Show banner when admin is viewing employee profile */}
                {isViewingEmployee && (
                    <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <span className="font-medium">Admin View:</span> You are viewing and editing {profileData?.name}'s profile (ID: {employeeId})
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-pink-300 flex items-center justify-center shadow-lg">
                                    <Edit className="w-8 h-8 text-gray-600" />
                                </div>
                                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                                    <Edit className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            <div className="text-white flex-1 text-center md:text-left">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-3xl font-bold">{profileData.name}</h2>
                                    
                                    {/* Admin Edit/Save Buttons for Basic Info */}
                                    {canEdit && (
                                        <div className="flex gap-2">
                                            {!isEditingBasicInfo ? (
                                                <button
                                                    onClick={() => setIsEditingBasicInfo(true)}
                                                    className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition duration-200 shadow-md flex items-center"
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit Info
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={handleSaveBasicInfo}
                                                        disabled={apiLoading}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-200 shadow-md flex items-center disabled:opacity-50"
                                                    >
                                                        <Save className="w-4 h-4 mr-2" />
                                                        {apiLoading ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button
                                                        onClick={handleCancelBasicInfo}
                                                        disabled={apiLoading}
                                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition duration-200 shadow-md flex items-center disabled:opacity-50"
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={handleDeleteEmployee}
                                                disabled={apiLoading}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition duration-200 shadow-md flex items-center disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                    <div>
                                        <p className="text-blue-100 text-sm">Login ID</p>
                                        <p className="font-medium">{profileData.loginId}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Company</p>
                                        <p className="font-medium">{profileData.company}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Email</p>
                                        {isEditingBasicInfo ? (
                                            <input
                                                type="email"
                                                value={editableData.email || ''}
                                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                                className="w-full px-2 py-1 rounded text-gray-900 font-medium"
                                            />
                                        ) : (
                                            <p className="font-medium">{profileData.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Department</p>
                                        {isEditingBasicInfo ? (
                                            <input
                                                type="text"
                                                value={editableData.department || ''}
                                                onChange={(e) => handleFieldChange('department', e.target.value)}
                                                className="w-full px-2 py-1 rounded text-gray-900 font-medium"
                                            />
                                        ) : (
                                            <p className="font-medium">{profileData.department}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Mobile</p>
                                        {isEditingBasicInfo ? (
                                            <input
                                                type="text"
                                                value={editableData.mobile || ''}
                                                onChange={(e) => handleFieldChange('mobile', e.target.value)}
                                                className="w-full px-2 py-1 rounded text-gray-900 font-medium"
                                            />
                                        ) : (
                                            <p className="font-medium">{profileData.mobile}</p>
                                        )}
                                    </div>
                                    {userRole === 'employee' && (
                                        <div>
                                            <p className="text-blue-100 text-sm">Manager</p>
                                            <p className="font-medium">{profileData.manager}</p>
                                        </div>
                                    )}
                                    {isEditingBasicInfo && (
                                        <div>
                                            <p className="text-blue-100 text-sm">Manager</p>
                                            <input
                                                type="text"
                                                value={editableData.manager || ''}
                                                onChange={(e) => handleFieldChange('manager', e.target.value)}
                                                className="w-full px-2 py-1 rounded text-gray-900 font-medium"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-blue-100 text-sm">Location</p>
                                        {isEditingBasicInfo ? (
                                            <input
                                                type="text"
                                                value={editableData.location || ''}
                                                onChange={(e) => handleFieldChange('location', e.target.value)}
                                                className="w-full px-2 py-1 rounded text-gray-900 font-medium"
                                            />
                                        ) : (
                                            <p className="font-medium">{profileData.location}</p>
                                        )}
                                    </div>
                                    {isEditingBasicInfo && (
                                        <div>
                                            <p className="text-blue-100 text-sm">Job Position</p>
                                            <input
                                                type="text"
                                                value={editableData.role || ''}
                                                onChange={(e) => handleFieldChange('role', e.target.value)}
                                                className="w-full px-2 py-1 rounded text-gray-900 font-medium"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div clasavailableTabs>
                        <div className="flex">
                            {['resume', 'private-info', 'salary-info'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 font-medium transition-colors relative ${activeTab === tab
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'resume' && (
                            <>
                                {/* Admin Edit/Save Buttons for Resume */}
                                {canEdit && (
                                    <div className="flex justify-end gap-2 mb-6">
                                        {!isEditingResume ? (
                                            <button
                                                onClick={() => setIsEditingResume(true)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-md flex items-center"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit Resume
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleSaveResume}
                                                    disabled={apiLoading}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-200 shadow-md flex items-center disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {apiLoading ? 'Saving...' : 'Save Resume'}
                                                </button>
                                                <button
                                                    onClick={handleCancelResume}
                                                    disabled={apiLoading}
                                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition duration-200 shadow-md flex items-center disabled:opacity-50"
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                                About
                                            </h3>
                                            {isEditingResume ? (
                                                <textarea
                                                    value={editableResumeData.about || ''}
                                                    onChange={(e) => handleResumeFieldChange('about', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    rows="5"
                                                    placeholder="Enter about information..."
                                                />
                                            ) : (
                                                <p className="text-gray-600 leading-relaxed">
                                                    {resumeData?.about || 'No about information available.'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
                                            {isEditingResume ? (
                                                <div>
                                                    <textarea
                                                        value={Array.isArray(editableResumeData.skills) ? editableResumeData.skills.join(', ') : editableResumeData.skills || ''}
                                                        onChange={(e) => {
                                                            const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                                                            handleResumeFieldChange('skills', skillsArray);
                                                        }}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        rows="3"
                                                        placeholder="Enter skills separated by commas..."
                                                    />
                                                    <p className="text-xs text-gray-500 mt-2">Separate skills with commas</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {skills.map((skill, index) => (
                                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Certification</h3>
                                            {isEditingResume ? (
                                                <div>
                                                    <textarea
                                                        value={Array.isArray(editableResumeData.certification) ? editableResumeData.certification.join(', ') : editableResumeData.certification || ''}
                                                        onChange={(e) => {
                                                            const certsArray = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                                                            handleResumeFieldChange('certification', certsArray);
                                                        }}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        rows="3"
                                                        placeholder="Enter certifications separated by commas..."
                                                    />
                                                    <p className="text-xs text-gray-500 mt-2">Separate certifications with commas</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 mb-4">
                                                    {certifications.map((cert, index) => (
                                                        <div key={index} className="flex items-center text-gray-700">
                                                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                                            {cert}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'private-info' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Private Information</h3>
                                
                                {/* Personal Details Section */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Date of Birth
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="date" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                value={editableData.dob || ''}
                                                onChange={(e) => handleFieldChange('dob', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Gender
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="text" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                value={editableData.gender || ''}
                                                onChange={(e) => handleFieldChange('gender', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Nationality
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="text" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                value={editableData.nationality || ''}
                                                onChange={(e) => handleFieldChange('nationality', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Marital Status
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <select 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={editableData.maritalStatus || 'Single'}
                                                onChange={(e) => handleFieldChange('maritalStatus', e.target.value)}
                                                disabled={!canEdit}
                                            >
                                                <option>Single</option>
                                                <option>Married</option>
                                                <option>Divorced</option>
                                                <option>Widowed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Personal Email
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="email" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                placeholder="personal@email.com"
                                                value={editableData.personalEmail || ''}
                                                onChange={(e) => handleFieldChange('personalEmail', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Date of Joining
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="date" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                value={editableData.dateOfJoining || ''}
                                                onChange={(e) => handleFieldChange('dateOfJoining', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Residing Address
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <textarea 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                rows="3" 
                                                placeholder="Enter your residing address"
                                                value={editableData.residingAddress || ''}
                                                onChange={(e) => handleFieldChange('residingAddress', e.target.value)}
                                                readOnly={!canEdit}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Details Section */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Emp Code
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="text" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                value={editableData.empCode || ''}
                                                onChange={(e) => handleFieldChange('empCode', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                PAN No
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="text" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                value={editableData.panNo || ''}
                                                onChange={(e) => handleFieldChange('panNo', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                UAN NO
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="text" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                value={editableData.uanNo || ''}
                                                onChange={(e) => handleFieldChange('uanNo', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Details Section */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Account Number
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="text" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                placeholder="Enter account number"
                                                value={editableData.accountNumber || ''}
                                                onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Bank Name
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="text" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                placeholder="Enter bank name"
                                                value={editableData.bankName || ''}
                                                onChange={(e) => handleFieldChange('bankName', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                IFSC Code
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="text" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                placeholder="Enter IFSC code"
                                                value={editableData.ifscCode || ''}
                                                onChange={(e) => handleFieldChange('ifscCode', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency Contact Section */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Emergency Contact Name
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="text" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                placeholder="Contact Name"
                                                value={editableData.emergencyContactName || ''}
                                                onChange={(e) => handleFieldChange('emergencyContactName', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                Emergency Phone
                                                {canEdit && <Edit className="w-3 h-3 ml-2 text-gray-400" />}
                                            </label>
                                            <input 
                                                type="tel" 
                                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
                                                placeholder="+91 98765 43210"
                                                value={editableData.emergencyPhone || ''}
                                                onChange={(e) => handleFieldChange('emergencyPhone', e.target.value)}
                                                readOnly={!canEdit}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {canEdit && (
                                    <button 
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        )}

                        {activeTab === 'salary-info' && (
                            <SalaryInfo 
                                isAdmin={isAdmin && isViewingEmployee}
                                salaryData={salaryData}
                                isEditing={isEditingSalary}
                                onEdit={() => setIsEditingSalary(true)}
                                onSave={handleSaveSalary}
                                onCancel={handleCancelSalary}
                                editableData={editableSalaryData}
                                onFieldChange={handleSalaryFieldChange}
                                isLoading={apiLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
            
            {/* Toast Notification */}
            {toast.show && (
                <MyToast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ show: false, message: '', type: 'success' })}
                />
            )}
        </div>
    );
}
