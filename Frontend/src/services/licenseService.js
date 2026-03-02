import { authenticatedApi } from './authService';

const api = authenticatedApi;

export const getAllLicenses = async () => {
  try {
    const response = await api.get('/licenses');
    return mapLicensesFromApi(response.data);
  } catch (error) {
    console.error('Error loading licenses:', error);
    throw error;
  }
};

export const getLicenseById = async (id) => {
  try {
    const response = await api.get(`/licenses/${id}`);
    return mapLicenseFromApi(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error loading license:', error);
    throw error;
  }
};

export const createLicense = async (licenseData) => {
  try {
    const apiData = mapLicenseToApi(licenseData);
    const response = await api.post('/licenses', apiData);
    return mapLicenseFromApi(response.data);
  } catch (error) {
    console.error('Error creating license:', error);
    throw error;
  }
};

export const updateLicense = async (id, licenseData) => {
  try {
    const apiData = mapLicenseToApi(licenseData);
    const response = await api.put(`/licenses/${id}`, apiData);
    return mapLicenseFromApi(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error updating license:', error);
    throw error;
  }
};

export const deleteLicense = async (id) => {
  try {
    await api.delete(`/licenses/${id}`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    console.error('Error deleting license:', error);
    throw error;
  }
};

export const searchLicenses = async (filterParams) => {
  try {
    const response = await api.post('/licenses/search', filterParams);
    return mapLicensesFromApi(response.data);
  } catch (error) {
    console.error('Error searching licenses:', error);
    throw error;
  }
};

const fetchDepartments = async () => {
  try {
    const response = await authenticatedApi.get('/departments');
    //Expected Format: [{ id: 1, name: 'IT' }, { id: 2, name: 'LIS' }, ...]
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

export const getFilterOptions = async () => {
  try {
    const departments = await fetchDepartments();
    return {
      departments, // Array of { id, name }
      departmentFilters: ['All Departments', ...departments.map(d => d.name)],
      types: ['All Types', 'Manual', 'Automatic', 'Subscription'],
      statuses: ['All Statuses', 'Active', 'Expiring soon', 'Expired'],
      renewalTypes: ['Normal', 'Subscription', 'Automatic', 'Manual']
    };
  } catch (error) {
    console.error('Error loading filter options:', error);
    // Fallback
    return {
      departments: [],
      departmentFilters: ['All Departments'],
      types: ['All Types', 'Manual', 'Automatic', 'Subscription'],
      statuses: ['All Statuses', 'Active', 'Expiring soon', 'Expired'],
      renewalTypes: ['Normal', 'Subscription', 'Automatic', 'Manual']
    };
  }
};

// Mapping functions
const mapLicenseFromApi = (apiLicense) => {
  return {
    id: apiLicense.id?.toString() || '',
    name: apiLicense.licenseName || '',
    count: apiLicense.purchasedCount || 0,
    department: apiLicense.departmentName || '',
    departmentId: apiLicense.departmentId || null,
    purchaseDate: formatDateFromApi(apiLicense.purchaseDate),
    duration: apiLicense.licenseDurationMonths?.toString() || '',
    expirationDate: formatDateFromApi(apiLicense.expirationDate),
    type: apiLicense.renewalType || 'Manual',
    status: mapStatusFromApi(apiLicense.status),
    file: apiLicense.executableFile || '',
    searchTerm: apiLicense.searchKeywords || '',
    description: apiLicense.description || '',
    licenseKey: apiLicense.licenseKey || '',
    createdAt: apiLicense.createdAt,
    updatedAt: apiLicense.updatedAt,
    documentCount: apiLicense.documentCount || 0
  };
};

const mapLicensesFromApi = (apiLicenses) => {
  if (!Array.isArray(apiLicenses)) return [];
  return apiLicenses.map(mapLicenseFromApi);
};

const mapLicenseToApi = (frontendLicense) => {
  return {
    licenseName: frontendLicense.name,
    licenseKey: frontendLicense.licenseKey || null,
    purchasedCount: parseInt(frontendLicense.count) || 1,
    departmentId: parseInt(frontendLicense.departmentId) || 1,
    purchaseDate: formatDateToApi(frontendLicense.purchaseDate),
    licenseDurationMonths: parseInt(frontendLicense.duration) || 12,
    renewalType: frontendLicense.type || 'Manual',
    executableFile: frontendLicense.file || null,
    searchKeywords: frontendLicense.searchTerm || null,
    description: frontendLicense.description || null
  };
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

const mapStatusFromApi = (apiStatus) => {
  const statusMap = {
    'Active': 'Active',
    'ExpiringSoon': 'Expiring soon',
    'Expired': 'Expired'
  };
  return statusMap[apiStatus] || apiStatus;
};

// Error Handler Helper (optional, bleibt unverändert)
export const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    switch (status) {
      case 400:
        return 'Invalid input. Please check your data.';
      case 404:
        return 'License not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return message || 'An error occurred.';
    }
  } else if (error.request) {
    return 'No connection to server. Please check your internet connection.';
  } else {
    return error.message || 'An unknown error occurred.';
  }
};

const licenseService = {
  getAllLicenses,
  getLicenseById,
  createLicense,
  updateLicense,
  deleteLicense,
  getFilterOptions
};

export default licenseService;