import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../utils/authService';

// Create the Auth Context
const AuthContext = createContext(null);

// Custom hook to use the Auth Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load user data on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    // Assuming the user object has a 'role' property
                    // that can be 'admin' or 'employee'
                    setIsAdmin(currentUser.role === 'admin' || currentUser.isAdmin === true);
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            setIsAdmin(data.user.role === 'admin' || data.user.isAdmin === true);
            return data;
        } catch (error) {
            throw error;
        }
    };

    // Signup function
    const signup = async (userData) => {
        try {
            const data = await authService.signup(userData);
            setUser(data.user);
            setIsAdmin(data.user.role === 'admin' || data.user.isAdmin === true);
            return data;
        } catch (error) {
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAdmin(false);
    };

    // Update user function (for profile updates)
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        setIsAdmin(updatedUser.role === 'admin' || updatedUser.isAdmin === true);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        isAdmin,
        userRole: isAdmin ? 'admin' : 'employee',
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
