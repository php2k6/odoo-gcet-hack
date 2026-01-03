import { User, LogOut, Clock, Users, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Navbar Component
function AdminNav({ showProfileMenu, setShowProfileMenu, currentPage }) {
    const handleProfileClick = (e) => {
        e.stopPropagation();
        setShowProfileMenu(!showProfileMenu);
    };

    const navItems = [
        { id: 'employees', label: 'Employee List', icon: Users },
        { id: 'attendance', label: 'Attendance Records', icon: Clock },
        { id: 'leave', label: 'Leave Approvals', icon: FileCheck },
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Company Portal
                        </h1>
                        <nav className="hidden md:flex space-x-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPage === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${isActive
                                                ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={handleProfileClick}
                                className="w-10 h-10 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold hover:shadow-lg transition duration-200"
                            >
                                <User className="w-5 h-5" />
                            </button>
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                                    <Link to="/profile" className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700 transition duration-200">
                                        <User className="w-4 h-4" />
                                        <span>My Profile</span>
                                    </Link>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600 transition duration-200">
                                        <LogOut className="w-4 h-4" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="md:hidden mt-4 flex flex-col space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                            <button
                                key={item.id}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${isActive
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}

export default AdminNav;
