import axios from 'axios';

const API_BASE_URL = 'https://localhost:7023/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});


export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return mapUsersFromApi(response.data);
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
    throw error;
  }
};

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
    const response = await api.post('/users', apiData);
    return mapUserFromApi(response.data);
  } catch (error) {
    console.error('Fehler beim Erstellen des Benutzers:', error);
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
  // Kann auch als API-Request implementiert werden, falls dynamisch
  return {
    roles: [
      { value: 'Admin', label: 'Admin - Volle Verwaltung aller Bereiche', color: 'error' },
      { value: 'Editor', label: 'Editor - Kann Lizenzen bearbeiten', color: 'primary' },
      { value: 'Viewer', label: 'Viewer - Nur Anzeige und Suche', color: 'default' },
      { value: 'Lizenzuser', label: 'Lizenzuser - Lizenznutzer', color: 'success' }
    ],
    departments: ['IT', 'LIS', 'ITM'],
    roleFilters: ['Alle Rollen', 'Admin', 'Editor', 'Viewer', 'Lizenzuser'],
    departmentFilters: ['Alle Abteilungen', 'IT', 'LIS', 'ITM']
  };
};

const mapUserFromApi = (apiUser) => {
  const roleName = apiUser.role?.name || reverseRoleMapping[apiUser.roleId] || '';
  const departmentName = apiUser.department?.name || reverseDepartmentMapping[apiUser.departmentId] || '';
  const createdAt = formatDateFromApi(apiUser.createdAt);
  
  return {
    id: apiUser.id?.toString() || '',
    name: apiUser.name || '',
    email: apiUser.email || '',
    role: roleName,
    roleId: apiUser.roleId || null,
    department: departmentName,
    departmentId: apiUser.departmentId || null,
  };
};

const mapUsersFromApi = (apiUsers) => {
  if (!Array.isArray(apiUsers)) return [];
  return apiUsers.map(mapUserFromApi);
};

const mapUserToApi = (frontendUser, isUpdate = false) => {
  const apiData = {
    name: frontendUser.name,
    email: frontendUser.email,
    roleId: roleMapping[frontendUser.role] || 1,
    departmentId: departmentMapping[frontendUser.department] || 1
  };
  

  if (!isUpdate) {
    apiData.password = frontendUser.password || 'InitialPassword123!';
  }
  
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

const formatDateToApi = (dateString) => {
  if (!dateString) return new Date().toISOString();
  
  if (dateString.includes('.')) {
    const [day, month, year] = dateString.split('.');
    return new Date(year, month - 1, day).toISOString();
  } else if (dateString.includes('-')) {
    return new Date(dateString).toISOString();
  }
  
  return new Date(dateString).toISOString();
};

const roleMapping = {
  'Admin': 1,
  'Editor': 2,
  'Viewer': 3,
  'Lizenzuser': 4
};

const reverseRoleMapping = {
  1: 'Admin',
  2: 'Editor',
  3: 'Viewer',
  4: 'Lizenzuser'
};

const departmentMapping = {
  'IT': 1,
  'LIS': 2,
  'ITM': 3
};

const reverseDepartmentMapping = {
  1: 'IT',
  2: 'LIS',
  3: 'ITM'
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