import React, { useState } from 'react';
import EmployeeNav from '../components/EmployeeNav';

export default function EmployeeAttendance() {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" onClick={() => setShowProfileMenu(false)}>
            <EmployeeNav 
                showProfileMenu={showProfileMenu} 
                setShowProfileMenu={setShowProfileMenu}
            />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">My Attendance</h2>
                    <p className="text-gray-600">Track your attendance records</p>
                </div>
            </main>
        </div>
    );
}
