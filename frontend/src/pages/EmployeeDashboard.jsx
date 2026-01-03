import React, { useState } from 'react';
import { User, Calendar, FileText, LogOut, Edit, Plus, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';


// Dashboard Component
function EmployeeDashboard() {
    const [showNotifications, setShowNotifications] = useState(false);

    const quickAccessCards = [
        { icon: User, label: 'Profile', color: 'from-blue-500 to-blue-600', action: 'profile' },
        { icon: Calendar, label: 'Attendance', color: 'from-green-500 to-green-600', action: 'attendance' },
        { icon: FileText, label: 'Leave Requests', color: 'from-purple-500 to-purple-600', action: 'leave' },
        { icon: LogOut, label: 'Logout', color: 'from-red-500 to-red-600', action: 'logout' }
    ];

    const recentActivity = [
        { text: 'Leave request approved', time: '2 hours ago', type: 'success' },
        { text: 'New salary slip available', time: '1 day ago', type: 'info' },
        { text: 'Profile updated successfully', time: '3 days ago', type: 'success' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Access Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {quickAccessCards.map((card, index) => (
                        card.action === 'profile' ? (
                            <Link
                                key={index}
                                to="/employee/profile"
                                className={`p-6 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex flex-col items-center`}
                            >
                                <card.icon className="w-8 h-8 mb-2" />
                                <span className="text-lg font-semibold">{card.label}</span>
                            </Link>
                        ) : (
                            <button
                                key={index}
                                className={`p-6 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200`}
                            >
                                <card.icon className="w-8 h-8 mb-2" />
                                <span className="text-lg font-semibold">{card.label}</span>
                            </button>
                        )
                    ))}
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Leaves</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-xs text-green-600 mt-2">+2 from last month</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Attendance Rate</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">98%</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-xs text-green-600 mt-2">Excellent performance</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Awaiting approval</p>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium">{activity.text}</p>
                                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDashboard;