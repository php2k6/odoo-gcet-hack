import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API functions for employee management

// Update basic employee details (admin only)
export const updateEmployeeDetails = async (empId, data) => {
  try {
    const response = await api.put(`/employees/${empId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete employee (admin only)
export const deleteEmployee = async (empId) => {
  try {
    const response = await api.delete(`/employees/${empId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update employee resume (admin only)
export const updateEmployeeResume = async (empId, data) => {
  try {
    const response = await api.put(`/employees/${empId}/resume`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update employee salary (admin only)
export const updateEmployeeSalary = async (empId, data) => {
  try {
    const response = await api.put(`/employees/${empId}/salary`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
