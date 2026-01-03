import api from './api';

// Authentication service functions
export const authService = {
  // Login function
  async login(credentials) {
    try {
      const { email, password, role } = credentials;
      
      // Determine endpoint based on role
      const endpoint = role === 'admin' ? '/auth/company/login' : '/auth/employee/login';
      
      const response = await api.post(endpoint, { email, password });
      const { access_token, token_type } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);
      localStorage.setItem('token_type', token_type);
      
      // Create user object with role
      const user = {
        email,
        role,
        isAdmin: role === 'admin'
      };
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token: access_token };
    } catch (error) {
      throw error;
    }
  },

  // Signup function
  async signup(userData) {
    try {
      // Map frontend fields to backend API structure
      const requestBody = {
        company_name: userData.companyName,
        email: userData.email,
        password: userData.password
      };
      
      const response = await api.post('/auth/company/signup', requestBody);
      
      // Backend returns: { id, company_name, email, phone, logo, role }
      const { id, company_name, email, phone, logo, role } = response.data;
      
      // Construct user object
      const user = {
        id,
        company_name,
        companyName: company_name, // Keep both formats for compatibility
        email,
        phone,
        logo,
        role,
        isAdmin: role === 'admin'
      };
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user };
    } catch (error) {
      throw error;
    }
  },

  // Logout function
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }
};

export default authService;
