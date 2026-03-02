import axios from 'axios';
import { authenticatedApi } from './authService';
// API Base URL
const API_BASE_URL = 'https://localhost:7023/api';

// Axios Instance
const api = authenticatedApi;

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return mapUsersFromApi(response.data);
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
    throw error;
  }
};

/**
 * Holt einen einzelnen Benutzer anhand der ID
 * @param {number} id - Die Benutzer-ID
 * @returns {Promise<Object|null>} Der Benutzer oder null
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return mapUserFromApi(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Fehler beim Laden des Benutzers:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const apiData = mapUserToApi(userData);
    
    // Debug: Zeige was gesendet wird
    console.log('📤 Sending to API:', apiData);
    
    const response = await api.post('/users', apiData);
    
    // Debug: Zeige was zurückkommt
    console.log('📥 Received from API:', response.data);
    
    return mapUserFromApi(response.data);
  } catch (error) {
    // Zeige detaillierte Fehlerinfo
    console.error('Error creating user:', error.response?.data);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const apiData = mapUserToApi(userData);
    const response = await api.put(`/users/${id}`, apiData);
    return mapUserFromApi(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    console.error('Fehler beim Löschen des Benutzers:', error);
    throw error;
  }
};

export const getFilterOptions = async () => {
  try {
    // Departments dynamisch von API holen
    const deptResponse = await api.get('/departments');
    const departments = deptResponse.data.map(d => d.name);
    
    return {
      roles: [
        { value: 'Admin', label: 'Admin - Full access', color: 'error' },
        { value: 'Editor', label: 'Editor - Edit licenses', color: 'primary' },
        { value: 'Viewer', label: 'Viewer - Only view', color: 'default' },
        { value: 'Licenseuser', label: 'Licenseuser - License user', color: 'success' }
      ],
      departments: departments,
      roleFilters: ['All Roles', 'Admin', 'Editor', 'Viewer', 'Licenseuser'],
      departmentFilters: ['All Departments', ...departments]
    };
  } catch (error) {
    // Fallback bei Fehler
    console.error('Fehler beim Laden der Filter-Optionen:', error);
    return {
      roles: [
        { value: 'Admin', label: 'Admin - Full access', color: 'error' },
        { value: 'Editor', label: 'Editor - Edit licenses', color: 'primary' },
        { value: 'Viewer', label: 'Viewer - Only view', color: 'default' },
        { value: 'Licenseuser', label: 'Licenseuser - License user', color: 'success' }
      ],
      departments: ['IT', 'ITM', 'LIS'],
      roleFilters: ['All Roles', 'Admin', 'Editor', 'Viewer', 'Licenseuser'],
      departmentFilters: ['All Departments', 'IT', 'ITM', 'LIS']
    };
  }
};

const mapUserFromApi = (apiUser) => {
  return {
    id: apiUser.id?.toString() || '',
    name: apiUser.name || '',
    email: apiUser.email || '',
    role: apiUser.roleName || '',           // Backend gibt "roleName" zurück
    roleId: apiUser.roleId || null,
    department: apiUser.departmentName || '', // Backend gibt "departmentName" zurück
    departmentId: apiUser.departmentId || null,
    createdAt: formatDateFromApi(apiUser.createdAt)
  };
};

const mapUsersFromApi = (apiUsers) => {
  if (!Array.isArray(apiUsers)) return [];
  return apiUsers.map(mapUserFromApi);
};

const mapUserToApi = (frontendUser) => {
  console.log('🔄 Mapping Frontend User:', frontendUser);
  
  // Konvertiere Role Name zu ID
  let roleId = frontendUser.roleId;
  if (!roleId && frontendUser.role) {
    const roleMap = {
      'Admin': 1,
      'Editor': 2,
      'Viewer': 3,
      'Lizenzuser': 4
    };
    roleId = roleMap[frontendUser.role] || 2;
  }
  
  // Konvertiere Department Name zu ID (dynamisch später über API)
  let departmentId = frontendUser.departmentId;
  if (!departmentId && frontendUser.department) {
    // Temporär hardcoded, später über API holen
    const deptMap = {
      'IT': 1,
      'HR': 2,
      'Finance': 3,
      'Marketing': 4
    };
    departmentId = deptMap[frontendUser.department] || 1;
  }
  
  const apiData = {
    name: frontendUser.name,
    email: frontendUser.email,
    password: frontendUser.password || 'TempPassword123!',
    roleId: parseInt(roleId) || 2,
    departmentId: parseInt(departmentId) || 1
  };
  
  console.log('🔄 Mapped to API format:', apiData);
  return apiData;
};


const formatDateFromApi = (isoDate) => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
};

// Default export für einfachen Import
const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getFilterOptions
};

export default userService;