import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Building2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Signup() {
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

    const handleSubmit = () => {
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

        setTimeout(() => {
            console.log('Signup attempted with:', formData);
            alert('Signup successful! (Demo)');
            setIsLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Logo Section */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-center">
                        <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                            <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-purple-100">Join us today and get started</p>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Company Name with Logo Upload - Full Width */}
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="companyName"
                                            name="companyName"
                                            type="text"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onKeyDown={handleKeyDown}
                                            className={`block w-full pl-10 pr-3 py-3 border ${errors.companyName && touched.companyName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-transparent transition duration-200`}
                                            placeholder="Your Company Name"
                                        />
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
                                            className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition duration-200 bg-gray-50 hover:bg-purple-50"
                                        >
                                            {logo ? (
                                                <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <Upload className="h-5 w-5 text-gray-400" />
                                            )}
                                        </label>
                                    </div>
                                </div>
                                {errors.companyName && touched.companyName && (
                                    <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>
                                )}
                                {!errors.companyName && (
                                    <p className="mt-1 text-xs text-gray-500">Click the icon to upload your company logo</p>
                                )}
                            </div>

                            {/* Two Column Layout for Name and Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onKeyDown={handleKeyDown}
                                            className={`block w-full pl-10 pr-3 py-3 border ${errors.name && touched.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-transparent transition duration-200`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {errors.name && touched.name && (
                                        <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Phone Input */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onKeyDown={handleKeyDown}
                                            className={`block w-full pl-10 pr-3 py-3 border ${errors.phone && touched.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-transparent transition duration-200`}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    {errors.phone && touched.phone && (
                                        <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email - Full Width */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        className={`block w-full pl-10 pr-3 py-3 border ${errors.email && touched.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-transparent transition duration-200`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && touched.email && (
                                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                                )}
                            </div>

                            {/* Two Column Layout for Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Password Input */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onKeyDown={handleKeyDown}
                                            className={`block w-full pl-10 pr-10 py-3 border ${errors.password && touched.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-transparent transition duration-200`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && touched.password && (
                                        <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password Input */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onKeyDown={handleKeyDown}
                                            className={`block w-full pl-10 pr-10 py-3 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'} rounded-lg focus:ring-2 focus:border-transparent transition duration-200`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && touched.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                    I agree to the{' '}
                                    <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
                                        Terms and Conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>

                            {/* Sign Up Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    'Sign Up'
                                )}
                            </button>
                        </div>

                        {/* Sign In Link */}
                        <p className="mt-8 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500 transition duration-200">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
