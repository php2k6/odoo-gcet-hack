import { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { getProfilePhoto, isAuthenticated, removeGoogleToken } from '../utils/googleUtils';
import { useNavigate } from 'react-router-dom';

/**
 * UserProfile Component
 * Displays the logged-in user's Google profile photo
 * 
 * Usage:
 * import UserProfile from './components/UserProfile';
 * <UserProfile />
 */
export default function UserProfile() {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [imageError, setImageError] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const loadUserData = () => {
        // Check if user is authenticated
        if (isAuthenticated()) {
            // Get profile data from localStorage
            const photo = getProfilePhoto();
            const name = localStorage.getItem('user_name');
            const email = localStorage.getItem('user_email');
            
            console.log("UserProfile - Retrieved from localStorage:");
            console.log("Photo:", photo);
            console.log("Name:", name);
            console.log("Email:", email);
            
            setProfilePhoto(photo);
            setUserName(name || 'User');
            setUserEmail(email || '');
            setImageError(false);
        }
    };

    useEffect(() => {
        loadUserData();
        
        // Listen for storage changes (in case of cross-tab updates)
        window.addEventListener('storage', loadUserData);
        
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('storage', loadUserData);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Clear all authentication data
        removeGoogleToken();
        setProfilePhoto(null);
        setUserName('');
        setUserEmail('');
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // If not authenticated, don't show anything
    if (!isAuthenticated()) {
        return null;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Photo and Name - Vertical Layout */}
            <div 
                className="flex flex-col items-center gap-1 cursor-pointer"
                onClick={toggleDropdown}
            >
                {profilePhoto && !imageError ? (
                    <img
                        src={profilePhoto}
                        alt={userName}
                        className="w-10 h-10 rounded-full border-2 border-blue-600 hover:border-blue-700 transition"
                        onError={() => setImageError(true)}
                        loading="eager"
                        crossOrigin="anonymous"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                )}
                
                {/* User Name below photo */}
                <p className="text-xs font-medium text-gray-900 dark:text-white text-center">
                    {userName}
                </p>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
