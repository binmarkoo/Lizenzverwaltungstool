import { authenticatedApi } from './authService';

// Verwende die authenticated API instance aus authService
const api = authenticatedApi;

/**
 * Holt alle Abteilungen
 * @returns {Promise<Array>} Array mit allen Abteilungen
 */
export const getAllDepartments = async () => {
  try {
    const response = await api.get('/departments');
    return response.data;
  } catch (error) {
    console.error('Fehler beim Laden der Abteilungen:', error);
    throw error;
  }
};

/**
 * Holt eine einzelne Abteilung anhand der ID
 * @param {number} id - Die Abteilungs-ID
 * @returns {Promise<Object|null>} Die Abteilung oder null
 */
export const getDepartmentById = async (id) => {
  try {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Fehler beim Laden der Abteilung:', error);
    throw error;
  }
};

/**
 * Erstellt eine neue Abteilung
 * @param {string} name - Der Abteilungsname
 * @returns {Promise<Object>} Die erstellte Abteilung
 */
export const createDepartment = async (name) => {
  try {
    const response = await api.post('/departments', { name });
    return response.data;
  } catch (error) {
    console.error('Fehler beim Erstellen der Abteilung:', error);
    throw error;
  }
};

/**
 * Aktualisiert eine bestehende Abteilung
 * @param {number} id - Die Abteilungs-ID
 * @param {string} name - Der neue Abteilungsname
 * @returns {Promise<Object|null>} Die aktualisierte Abteilung oder null
 */
export const updateDepartment = async (id, name) => {
  try {
    const response = await api.put(`/departments/${id}`, { name });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Fehler beim Aktualisieren der Abteilung:', error);
    throw error;
  }
};

/**
 * Löscht eine Abteilung
 * @param {number} id - Die Abteilungs-ID
 * @returns {Promise<boolean>} true wenn erfolgreich gelöscht
 */
export const deleteDepartment = async (id) => {
  try {
    await api.delete(`/departments/${id}`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    console.error('Fehler beim Löschen der Abteilung:', error);
    throw error;
  }
};

/**
 * Holt die Abteilungsnamen als einfaches Array (für Dropdowns)
 * @returns {Promise<Array<string>>} Array mit Abteilungsnamen
 */
export const getDepartmentNames = async () => {
  try {
    const departments = await getAllDepartments();
    return departments.map(d => d.name);
  } catch (error) {
    console.error('Fehler beim Laden der Abteilungsnamen:', error);
    throw error;
  }
};

// Default export für einfachen Import
const departmentService = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentNames
};

export default departmentService;