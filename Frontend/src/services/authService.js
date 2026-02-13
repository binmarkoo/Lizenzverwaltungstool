import axios from 'axios';

const API_BASE_URL = 'https://localhost:7023/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ==========================================
// TOKEN MANAGEMENT
// ==========================================

//Saves Token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

//Gets Token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

//Removes Token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

//Saves User Info in localStorage
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

//Gets User Info from localStorage
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

//Removes User Info from localStorage
const removeUser = () => {
  localStorage.removeItem('user');
};

//Checks if user is authenticated (has valid token and user info)
const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return token !== null && user !== null;
};

// ==========================================
// API CALLS
// ==========================================

/**
 * Login - Gibt Token und User zurück
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} { token, user }
 */
export const login = async (email, password) => {
  try {
    console.log('Attempting login for:', email);
    
    const response = await api.post('/auth/login', {
      email,
      password
    });

    console.log('Login successful:', response.data);

    const { token, user } = response.data;

    // Token und User speichern
    setToken(token);
    setUser(user);

    return { token, user };
  } catch (error) {
    console.error('Login failed:', error.response?.data);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password. Please try again.');
    }
    
    throw new Error('Login failed. Please try again.');
  }
};

// Logout - Removes token and user info
export const logout = () => {
  console.log('🚪 Logging out...');
  removeToken();
  removeUser();
};

// Get current user info
export const getCurrentUser = () => {
  return getUser();
};

// Checks if user has a specific role
export const hasRole = (roleName) => {
  const user = getUser();
  return user?.roleName === roleName;
};

// Checks if user is Admin
export const isAdmin = () => {
  return hasRole('Admin');
};

// Checks if user is Editor
export const isEditor = () => {
  return hasRole('Editor') || hasRole('Admin'); // Admin kann auch editieren
};

// ==========================================
// AXIOS INTERCEPTOR - Token automatically added to headers, and auto-logout on 401
// ==========================================

// Request Interceptor - Add token to headers if exists
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Added token to request:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Logging out...');
      
      // Tokeen invalid
      logout();
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Export the authenticated API instance for use in other services
export const authenticatedApi = api;

// Default export
const authService = {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  isAdmin,
  isEditor,
  getToken,
  setToken,
  removeToken
};

export default authService;