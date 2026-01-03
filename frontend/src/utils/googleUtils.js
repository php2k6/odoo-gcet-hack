/**
 * Google OAuth Utility Functions with JWT Backend Integration
 * Handles JWT token management and backend authentication
 */

// TODO: Replace with your actual backend API URL
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api';

// Set to false to use backend authentication, true for client-side only (testing)
const USE_CLIENT_SIDE_AUTH = import.meta.env.VITE_USE_CLIENT_SIDE_AUTH === 'true' || true;

/**
 * Decode JWT token (client-side only - for development/testing)
 * WARNING: This does NOT verify the token signature!
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Authenticate with backend using Google ID token
 * @param {string} idToken - Google ID token (JWT)
 * @returns {Promise<Object>} Backend response with JWT token and user data
 */
export const authenticateWithGoogle = async (idToken) => {
  // Client-side mode (for testing without backend)
  if (USE_CLIENT_SIDE_AUTH) {
    try {
      const payload = decodeJWT(idToken);
      
      if (!payload) {
        throw new Error('Failed to decode token');
      }

      console.log('Decoded Google JWT:', payload);

      return {
        success: true,
        token: idToken, // Use Google's ID token as JWT
        user: {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        },
      };
    } catch (error) {
      console.error('Error in client-side authentication:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Backend mode (production)
  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Authentication failed');
    }

    const data = await response.json();
    return {
      success: true,
      token: data.token, // JWT from your backend
      user: data.user,   // User profile data
    };
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token from backend
 */
export const storeJwtToken = (token) => {
  localStorage.setItem('jwt_token', token);
};

/**
 * Get JWT token from localStorage
 * @returns {string|null} Stored JWT token or null
 */
export const getJwtToken = () => {
  return localStorage.getItem('jwt_token');
};

/**
 * Remove all authentication data from localStorage
 */
export const removeGoogleToken = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('profile_photo');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_email');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if JWT token exists
 */
export const isAuthenticated = () => {
  return !!getJwtToken();
};

/**
 * Get profile photo URL from localStorage
 * @returns {string|null} Stored photo URL or null
 */
export const getProfilePhoto = () => {
  return localStorage.getItem('profile_photo');
};

/**
 * Make authenticated API request with JWT token
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getJwtToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    ...options,
    headers,
  });
};
