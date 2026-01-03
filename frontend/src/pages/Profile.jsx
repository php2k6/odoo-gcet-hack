import React, { useState, useEffect } from 'react';
import { Edit, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import SalaryInfo from '../components/SalaryInfo';
import { useAuth } from '../context/AuthContext';
import EmployeeNav from '../components/EmployeeNav';


// Unified Profile Component - supports both employee and admin views
export default function Profile() {
    console.log("Profile component loaded");
    
    // Get user role and data from authentication context
    const { user, userRole, isAdmin, isLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState('resume');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState('profile');

    const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS'];
    const certifications = ['AWS Certified Developer', 'React Professional'];

    // Fetch profile data based on role
    useEffect(() => {
        // This is where you'd fetch from your backend
        // Example: fetch(`/api/${userRole}/profile`)
        //   .then(res => res.json())
        //   .then(data => setProfileData(data))
        
        // Use data from context or fallback to demo data
        const demoData = {
            name: user?.name || (userRole === 'employee' ? 'My Name' : 'Admin User'),
            loginId: user?.loginId || user?.employeeId || 'EMP001',
            company: user?.company || 'Tech Corp',
            email: user?.email || (userRole === 'employee' ? 'employee@company.com' : 'admin@company.com'),
            department: user?.department || 'Engineering',
            mobile: user?.mobile || user?.phone || '+1 234 567 8900',
            manager: user?.manager || 'John Doe',
            location: user?.location || 'New York, USA',
        };
        setProfileData(demoData);
    }, [user, userRole]);

    // Determine which tabs to show based on role
    const getAvailableTabs = () => {
        if (userRole === 'admin') {
            return ['resume', 'private-info']; // Admin can't see salary info
        }
        return ['resume', 'private-info', 'salary-info']; // Employee can see all
    };

    const availableTabs = getAvailableTabs();

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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                            <input 
                                                type="date" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" 
                                                defaultValue="1990-05-15"
                                                readOnly 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" 
                                                defaultValue="Male"
                                                readOnly 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" 
                                                defaultValue="Indian"
                                                readOnly 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                <option>Single</option>
                                                <option>Married</option>
                                                <option>Divorced</option>
                                                <option>Widowed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Personal Email</label>
                                            <input 
                                                type="email" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                placeholder="personal@email.com" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
                                            <input 
                                                type="date" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" 
                                                defaultValue="2020-01-15"
                                                readOnly 
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Residing Address</label>
                                            <textarea 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                rows="3" 
                                                placeholder="Enter your residing address"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Details Section */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Emp Code</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" 
                                                defaultValue="EMP001"
                                                readOnly 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">PAN No</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" 
                                                defaultValue="ABCDE1234F"
                                                readOnly 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">UAN NO</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" 
                                                defaultValue="123456789012"
                                                readOnly 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Details Section */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                placeholder="Enter account number" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                placeholder="Enter bank name" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                placeholder="Enter IFSC code" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency Contact Section */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                placeholder="Contact Name" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                                            <input 
                                                type="tel" 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                placeholder="+91 98765 43210" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
                                    Save Changes
                                </button>
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
