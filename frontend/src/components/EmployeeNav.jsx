import { User, LogOut, Clock, FileCheck, Users, CircleDot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import MyToast from './MyToast';

function EmployeeNav({ showProfileMenu, setShowProfileMenu }) {
    const { isAdmin, logout } = useAuth();
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [showAttendanceMenu, setShowAttendanceMenu] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [attendanceData, setAttendanceData] = useState(null);

    // Check if user has already checked in today
    useEffect(() => {
        const checkTodayAttendance = () => {
            const today = new Date().toDateString();
            const lastCheckIn = localStorage.getItem('lastCheckIn');
            const lastCheckOut = localStorage.getItem('lastCheckOut');
            
            if (lastCheckIn === today && lastCheckOut !== today) {
                setHasCheckedIn(true);
            } else {
                setHasCheckedIn(false);
            }
        };
        
        checkTodayAttendance();
    }, []);

    const handleProfileClick = (e) => {
        e.stopPropagation();
        setShowProfileMenu(!showProfileMenu);
        setShowAttendanceMenu(false);
    };

    const handleAttendanceClick = (e) => {
        e.stopPropagation();
        setShowAttendanceMenu(!showAttendanceMenu);
        setShowProfileMenu(false);
    };

    const handleCheckIn = async () => {
        try {
            const response = await api.post('/attendance/checkin', {});
            
            setAttendanceData(response.data);
            setHasCheckedIn(true);
            setShowAttendanceMenu(false);
            
            // Store check-in time in localStorage
            const today = new Date().toDateString();
            localStorage.setItem('lastCheckIn', today);
            localStorage.removeItem('lastCheckOut');
            
            setToast({
                show: true,
                message: `Check-in successful! Time: ${new Date(response.data.check_in_time).toLocaleTimeString()}`,
                type: 'success'
            });
        } catch (error) {
            console.error('Check-in failed:', error);
            setToast({
                show: true,
                message: error.response?.data?.message || 'Failed to check in. Please try again.',
                type: 'error'
            });
        }
    };

    const handleCheckOut = async () => {
        try {
            const response = await api.post('/attendance/checkout', {});
            
            setAttendanceData(response.data);
            setHasCheckedIn(false);
            setShowAttendanceMenu(false);
            
            // Store check-out time in localStorage
            const today = new Date().toDateString();
            localStorage.setItem('lastCheckOut', today);
            
            setToast({
                show: true,
                message: `Check-out successful! Work hours: ${response.data.work_hours}h${response.data.extra_hours > 0 ? ` (Extra: ${response.data.extra_hours}h)` : ''}`,
                type: 'success'
            });
        } catch (error) {
            console.error('Check-out failed:', error);
            setToast({
                show: true,
                message: error.response?.data?.message || 'Failed to check out. Please try again.',
                type: 'error'
            });
        }
    };

    const markAttendance = (type) => {
        // In production, this would call your backend API
        console.log(`Marking attendance as: ${type}`);
        setHasMarkedAttendance(true);
        setShowAttendanceMenu(false);
        // You can add API call here
        // await fetch('/api/attendance/mark', { method: 'POST', body: JSON.stringify({ type }) });
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            {toast.show && (
                <MyToast 
                    show={toast.show}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: '' })}
                />
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            DayFlow
                        </Link>
                        <nav className="hidden md:flex space-x-2">
                            {isAdmin && (
                                <Link to="/dashboard" className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                                    <Users className="w-4 h-4" />
                                    <span>Employee List</span>
                                </Link>
                            )}
                            <Link to="/attendance" className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                                <Clock className="w-4 h-4" />
                                <span>Attendance</span>
                            </Link>
                            <Link to={isAdmin ? "/admin/leave" : "/employee/leave"} className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                                <FileCheck className="w-4 h-4" />
                                <span>{isAdmin ? "Leave Management" : "My Leaves"}</span>
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Attendance Marking Button - Only for Employees */}
                        {!isAdmin && (
                            <div className="relative">
                                <button
                                    onClick={handleAttendanceClick}
                                    className={`relative p-2 rounded-lg transition ${
                                        hasCheckedIn 
                                            ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                    title={hasCheckedIn ? "Checked In" : "Mark Attendance"}
                                >
                                    <CircleDot className="w-5 h-5" />
                                    {!hasCheckedIn && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    )}
                                </button>
                                {showAttendanceMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                                        {!hasCheckedIn ? (
                                            <button 
                                                onClick={handleCheckIn}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700 transition duration-200"
                                            >
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span>Check In</span>
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handleCheckOut}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700 transition duration-200"
                                            >
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <span>Check Out</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={handleProfileClick}
                                className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold hover:shadow-lg transition duration-200"
                            >
                                <User className="w-5 h-5" />
                                {!isAdmin && !hasCheckedIn && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                                    <Link to="/profile" className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700 transition duration-200">
                                        <User className="w-4 h-4" />
                                        <span>My Profile</span>
                                    </Link>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600 transition duration-200"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default EmployeeNav;
