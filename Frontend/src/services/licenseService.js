import axios from 'axios';
import { authenticatedApi } from './authService'; // Import der Auth-API

// Verwende die authenticated API statt neue axios instance
const api = authenticatedApi;


export const getAllLicenses = async () => {
  try {
    const response = await api.get('/licenses');
    return mapLicensesFromApi(response.data);
  } catch (error) {
    console.error('Fehler beim Laden der Lizenzen:', error);
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
    console.error('Fehler beim Laden der Lizenz:', error);
    throw error;
  }
};

export const createLicense = async (licenseData) => {
  try {
    const apiData = mapLicenseToApi(licenseData);
    const response = await api.post('/licenses', apiData);
    return mapLicenseFromApi(response.data);
  } catch (error) {
    console.error('Fehler beim Erstellen der Lizenz:', error);
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
    console.error('Fehler beim Aktualisieren der Lizenz:', error);
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
    console.error('Fehler beim Löschen der Lizenz:', error);
    throw error;
  }
};

export const searchLicenses = async (filterParams) => {
  try {
    const response = await api.post('/licenses/search', filterParams);
    return mapLicensesFromApi(response.data);
  } catch (error) {
    console.error('Fehler beim Suchen der Lizenzen:', error);
    throw error;
  }
};

export const getFilterOptions = async () => {
  return {
    departments: ['Alle Abteilungen', 'IT', 'LIS', 'ITM'],
    types: ['Alle Typen', 'Manual', 'Automatic', 'Subscription'],
    statuses: ['Alle Status', 'Active', 'ExpiringSoon', 'Expired'],
    renewalTypes: ['Normal', 'Subscription', 'Automatisch','Manuell']
  };
};

//Mapping

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
  
  // Format: DD.MM.YYYY oder YYYY-MM-DD
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
    'Active': 'Aktiv',
    'ExpiringSoon': 'Bald erneuern',
    'Expired': 'Abgelaufen'
  };
  
  return statusMap[apiStatus] || apiStatus;
};

/**
 * Mapped Frontend Status zu API Status
 */
const mapStatusToApi = (frontendStatus) => {
  const statusMap = {
    'Aktiv': 'Active',
    'Bald erneuern': 'ExpiringSoon',
    'Abgelaufen': 'Expired'
  };
  
  return statusMap[frontendStatus] || frontendStatus;
};

// Error Handler Helper
export const handleApiError = (error) => {
  if (error.response) {
    // Server hat mit Status Code geantwortet (4xx, 5xx)
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    switch (status) {
      case 400:
        return 'Ungültige Eingabe. Bitte überprüfen Sie Ihre Daten.';
      case 404:
        return 'Lizenz nicht gefunden.';
      case 500:
        return 'Serverfehler. Bitte versuchen Sie es später erneut.';
      default:
        return message || 'Ein Fehler ist aufgetreten.';
    }
  } else if (error.request) {
    // Request wurde gesendet, aber keine Antwort erhalten
    return 'Keine Verbindung zum Server. Bitte überprüfen Sie Ihre Internetverbindung.';
  } else {
    // Fehler beim Erstellen des Requests
    return error.message || 'Ein unbekannter Fehler ist aufgetreten.';
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