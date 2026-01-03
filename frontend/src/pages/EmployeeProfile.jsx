import React, { useState } from 'react';
import { User, Calendar, FileText, LogOut, Edit, Plus, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';


// Profile Component
export default function EmployeeProfile() {
    const [activeTab, setActiveTab] = useState('resume');

    const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS'];
    const certifications = ['AWS Certified Developer', 'React Professional'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                to="/employee/dashboard"
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ← Back
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        </div>
                    </div>
                </div>
            </header>

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
                                <h2 className="text-3xl font-bold mb-2">My Name</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                    <div>
                                        <p className="text-blue-100 text-sm">Login ID</p>
                                        <p className="font-medium">EMP001</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Company</p>
                                        <p className="font-medium">Tech Corp</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Email</p>
                                        <p className="font-medium">employee@company.com</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Department</p>
                                        <p className="font-medium">Engineering</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Mobile</p>
                                        <p className="font-medium">+1 234 567 8900</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Manager</p>
                                        <p className="font-medium">John Doe</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-sm">Location</p>
                                        <p className="font-medium">New York, USA</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
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
                                <h3 className="text-xl font-bold text-gray-900">Private Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                        <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Social Security Number</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="XXX-XX-XXXX" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contact Name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                                        <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+1 234 567 8900" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Home Address</label>
                                        <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="3" placeholder="Enter your address"></textarea>
                                    </div>
                                </div>
                                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {activeTab === 'salary-info' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-900">Salary Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-600 font-medium mb-1">Base Salary</p>
                                        <p className="text-3xl font-bold text-green-900">$85,000</p>
                                        <p className="text-sm text-green-600 mt-1">per year</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-600 font-medium mb-1">Monthly Take Home</p>
                                        <p className="text-3xl font-bold text-blue-900">$5,850</p>
                                        <p className="text-sm text-blue-600 mt-1">after deductions</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Recent Pay Slips</h4>
                                    <div className="space-y-3">
                                        {['December 2024', 'November 2024', 'October 2024'].map((month, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                                                <div className="flex items-center">
                                                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                                                    <span className="font-medium text-gray-900">{month}</span>
                                                </div>
                                                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                                    Download
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
