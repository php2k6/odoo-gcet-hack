import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Building2, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        companyName: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [logo, setLogo] = useState(null);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasNumber) {
            return 'Password must contain at least one number';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }
        return null;
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'companyName':
                if (!value.trim()) error = 'Company name is required';
                break;
            case 'name':
                if (!value.trim()) error = 'Full name is required';
                break;
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!validateEmail(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'phone':
                if (!value.trim()) {
                    error = 'Phone number is required';
                } else if (value.replace(/\D/g, '').length < 10) {
                    error = 'Please enter a valid phone number';
                }
                break;
            case 'password':
                error = validatePassword(value) || '';
                break;
            case 'confirmPassword':
                if (!value) {
                    error = 'Please confirm your password';
                } else if (value !== formData.password) {
                    error = 'Passwords do not match';
                }
                break;
            default:
                break;
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Validate field if it has been touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors({
                ...errors,
                [name]: error
            });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({
            ...touched,
            [name]: true
        });

        const error = validateField(name, value);
        setErrors({
            ...errors,
            [name]: error
        });
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        // Mark all fields as touched
        const allTouched = {};
        Object.keys(formData).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        // If there are errors, set them and return
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Call signup function from context
            // Backend expects: company_name, email, password
            const result = await signup({
                companyName: formData.companyName,
                email: formData.email,
                password: formData.password
            });
            
            console.log('Signup successful:', result);
            
            // Redirect to dashboard on success
            navigate('/dashboard');
        } catch (error) {
            console.error('Signup error:', error);
            
            // Extract error message from response
            let errorMessage = 'Signup failed. Please try again.';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setErrors({
                ...errors,
                submit: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Form */}
            <div className="flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <div className="w-5 h-5 border-2 border-white rounded"></div>
                            </div>
                            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DayFlow HRM</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-6">
                        <p className="text-sm text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium mb-2">Get Started</p>
                        <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        {/* Company Name with Logo Upload */}
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name
                            </label>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <input
                                        id="companyName"
                                        name="companyName"
                                        type="text"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        className={`block w-full pl-10 pr-3 py-3 border-2 ${errors.companyName && touched.companyName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-purple-500 outline-none transition bg-white hover:border-purple-300`}
                                        placeholder="Your Company Name"
                                    />
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                                </div>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="logoUpload"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="logoUpload"
                                        className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-500 transition duration-200 bg-white hover:bg-purple-50"
                                        title="Upload logo"
                                    >
                                        {logo ? (
                                            <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <Upload className="h-5 w-5 text-purple-400" />
                                        )}
                                    </label>
                                </div>
                            </div>
                            {errors.companyName && touched.companyName && (
                                <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>
                            )}
                        </div>

                        {/* Name and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        className={`block w-full pl-10 pr-3 py-3 border-2 ${errors.name && touched.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-purple-500 outline-none transition bg-white hover:border-purple-300`}
                                        placeholder="John Doe"
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                                </div>
                                {errors.name && touched.name && (
                                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        className={`block w-full pl-10 pr-3 py-3 border-2 ${errors.phone && touched.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-purple-500 outline-none transition bg-white hover:border-purple-300`}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                                </div>
                                {errors.phone && touched.phone && (
                                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    className={`block w-full pl-10 pr-3 py-3 border-2 ${errors.email && touched.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-purple-500 outline-none transition bg-white hover:border-purple-300`}
                                    placeholder="you@example.com"
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                            </div>
                            {errors.email && touched.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        className={`block w-full pl-10 pr-10 py-3 border-2 ${errors.password && touched.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-purple-500 outline-none transition bg-white hover:border-purple-300`}
                                        placeholder="••••••••"
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && touched.password && (
                                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        className={`block w-full pl-10 pr-10 py-3 border-2 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-purple-500 outline-none transition bg-white hover:border-purple-300`}
                                        placeholder="••••••••"
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* Error Message Display */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{errors.submit}</p>
                                </div>
                            </div>
                        )}

                        {/* Sign Up Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>

                    {/* Sign In Link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold hover:from-blue-700 hover:to-purple-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column - Abstract Image Background */}
            <div className="relative overflow-hidden min-h-screen hidden lg:block">
                <div className="absolute inset-0">
                    {/* Gradient background with animated layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-12">
                        {/* Animated gradient orbs */}
                        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                        
                        <div className="text-center text-white max-w-2xl relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                                Join DayFlow HRM
                            </h2>
                            <blockquote className="text-xl md:text-2xl font-light italic opacity-90 drop-shadow-md">
                                "Transform your HR operations with our powerful, intuitive platform designed for modern workplaces."
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
