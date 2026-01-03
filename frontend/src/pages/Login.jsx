import React, { useState } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { MyToast } from "../components/MyToast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [identifier, setIdentifier] = useState(''); // Email or Employee ID
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee');
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Handle identifier input change
    const handleIdentifierChange = (e) => {
        const value = e.target.value;
        setIdentifier(value);
        
        // Only validate as email if it contains @
        if (value.includes('@')) {
            if (!validateEmail(value)) {
                setEmailError('Please enter a valid email address');
            } else {
                setEmailError('');
            }
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate if identifier contains @ (email) before submitting
        if (identifier.includes('@') && !validateEmail(identifier)) {
            setToast({
                message: 'Please enter a valid email address',
                type: 'error'
            });
            return;
        }
        
        if (!identifier.trim()) {
            setToast({
                message: 'Please enter your email or employee ID',
                type: 'error'
            });
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Determine if identifier is email or ID
            const isEmail = identifier.includes('@');
            const loginData = isEmail 
                ? { email: identifier, password, role }
                : { id: identifier, password, role };
            
            // Call the login function from context
            await login(loginData);
            
            // Show success message
            setToast({
                message: 'Login successful!',
                type: 'success'
            });
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            // Show error message
            setToast({
                message: error.response?.data?.message || 'Login failed. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Form */}
            <div className="flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-white to-purple-50">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <div className="w-5 h-5 border-2 border-white rounded"></div>
                            </div>
                            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DayFlow HRM </span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <p className="text-sm text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium mb-2">Welcome back</p>
                        <h1 className="text-3xl font-bold text-gray-900">Sign In to HR Portal</h1>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Email or Employee ID Input */}
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                                Email / Employee ID
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="identifier"
                                    value={identifier}
                                    onChange={handleIdentifierChange}
                                    placeholder="email@example.com or EMP001"
                                    className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-purple-300 ${
                                        emailError ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                />
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                            </div>
                            {emailError && (
                                <p className="mt-1 text-sm text-red-600">{emailError}</p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                Sign in as
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-purple-300"
                            >
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-purple-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold hover:from-blue-700 hover:to-purple-700">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column - Abstract Image Background */}
            <div className="relative overflow-hidden min-h-screen">
                <div className="absolute inset-0">
                    {/* Gradient background with animated layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-12">
                        {/* Animated gradient orbs */}
                        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                        
                        <div className="text-center text-white max-w-2xl relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                                DayFlow HRM Solutions
                            </h2>
                            <blockquote className="text-xl md:text-2xl font-light italic opacity-90 drop-shadow-md">
                                "Empowering your workforce, streamlining your operations, and building a better workplace together."
                            </blockquote>
                        </div>
                    </div>

                </div>
            </div>
            {toast && <MyToast {...toast} />}
        </div>
    );
}