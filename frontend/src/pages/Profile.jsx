import React, { useState, useEffect } from 'react';
import { Edit, Plus } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import SalaryInfo from '../components/SalaryInfo';
import { useAuth } from '../context/AuthContext';
import EmployeeNav from '../components/EmployeeNav';


// Unified Profile Component - supports both employee and admin views
export default function Profile() {
    console.log("Profile component loaded");
    
    // Get employee ID from URL params (for admin viewing employee profile)
    const [searchParams] = useSearchParams();
    const employeeId = searchParams.get('id');
    
    // Get user role and data from authentication context
    const { user, userRole, isAdmin, isLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState('resume');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState('profile');
    const [isViewingEmployee, setIsViewingEmployee] = useState(false);
    const [editableData, setEditableData] = useState({});

    const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS'];
    const certifications = ['AWS Certified Developer', 'React Professional'];

    // Fetch profile data based on role and employee ID
    useEffect(() => {
        // Check if admin is viewing an employee's profile
        const viewingEmployee = isAdmin && employeeId;
        setIsViewingEmployee(viewingEmployee);
        
        // This is where you'd fetch from your backend
        // If viewing employee: fetch(`/api/admin/employee/${employeeId}`)
        // If viewing own: fetch(`/api/${userRole}/profile`)
        
        let demoData;
        if (viewingEmployee) {
            // Admin viewing employee profile - fetch employee data
            // In production, fetch actual employee data from API
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
                // Additional details for editing
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
            // Employee viewing own profile
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
    
    // Handle save
    const handleSave = async () => {
        // In production, send data to API
        // await fetch(`/api/admin/employee/${employeeId}`, {
        //     method: 'PUT',
        //     body: JSON.stringify(editableData)
        // });
        
        console.log('Saving employee data:', editableData);
        setProfileData(editableData);
        alert('Employee details updated successfully!');
    };

    if (isLoading || !profileData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" onClick={() => setShowProfileMenu(false)}>
            {/* Header - Unified navigation for all users */}
            <EmployeeNav 
                showProfileMenu={showProfileMenu} 
                setShowProfileMenu={setShowProfileMenu}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                <h2 className="text-3xl font-bold mb-2">{profileData.name}</h2>
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
                                        <p className="font-medium">{profileData.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Department</p>
                                        <p className="font-medium">{profileData.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Mobile</p>
                                        <p className="font-medium">{profileData.mobile}</p>
                                    </div>
                                    {userRole === 'employee' && (                                        <div>
                                            <p className="text-blue-100 text-sm">Manager</p>
                                            <p className="font-medium">{profileData.manager}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-blue-100 text-sm">Location</p>
                                        <p className="font-medium">{profileData.location}</p>
                                    </div>
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
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                            About <Edit className="w-4 h-4 ml-2 text-gray-400 cursor-pointer" />
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                            What I love about my job <Edit className="w-4 h-4 ml-2 text-gray-400 cursor-pointer" />
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                            My interests and hobbies <Edit className="w-4 h-4 ml-2 text-gray-400 cursor-pointer" />
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {skills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                                            <Plus className="w-4 h-4 mr-1" /> Add Skills
                                        </button>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Certification</h3>
                                        <div className="space-y-2 mb-4">
                                            {certifications.map((cert, index) => (
                                                <div key={index} className="flex items-center text-gray-700">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                                    {cert}
                                                </div>
                                            ))}
                                        </div>
                                        <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                                            <Plus className="w-4 h-4 mr-1" /> Add Skills
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                            <SalaryInfo />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
