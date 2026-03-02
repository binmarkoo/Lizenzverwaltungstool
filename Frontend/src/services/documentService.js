import { authenticatedApi } from './authService';

const api = authenticatedApi;

/**
 * Lädt alle Dokumente einer Lizenz
 */
export const getDocumentsByLicenseId = async (licenseId) => {
  try {
    const response = await api.get(`/licenses/${licenseId}/documents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

/**
 * Lädt ein einzelnes Dokument herunter
 */
export const downloadDocument = async (licenseId, documentId) => {
  try {
    const response = await api.get(`/licenses/${licenseId}/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

/**
 * Lädt ein neues Dokument hoch
 */
export const uploadDocument = async (licenseId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post(`/licenses/${licenseId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Löscht ein Dokument
 */
export const deleteDocument = async (licenseId, documentId) => {
  try {
    await api.delete(`/licenses/${licenseId}/documents/${documentId}`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) return false;
    console.error('Error deleting document:', error);
    throw error;
  }
};

const documentService = {
  getDocumentsByLicenseId,
  downloadDocument,
  uploadDocument,
  deleteDocument
};

export default documentService;