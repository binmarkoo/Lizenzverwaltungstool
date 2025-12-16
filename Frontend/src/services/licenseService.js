// Mock-Daten - Diese werden später durch echte API-Aufrufe ersetzt
const mockLicenses = [
  {
    id: 'LIC-001',
    name: 'Adobe Creative Cloud',
    count: 25,
    department: 'IT',
    purchaseDate: '1.11.2024',
    duration: '365',
    type: 'Subscription',
    status: 'Abgelaufen',
    file: 'photoshop.exe',
    searchTerm: 'Photoshop',
    description: 'Adobe Creative Cloud Vollversion für Marketing...'
  },
  {
    id: 'LIC-002',
    name: 'Microsoft Office 365',
    count: 100,
    department: 'IT',
    purchaseDate: '1.2.2024',
    duration: '365',
    type: 'Subscription',
    status: 'Abgelaufen',
    file: 'excel.exe',
    searchTerm: 'Excel',
    description: 'Office 365 Enterprise Lizenz für alle Mitarbeiter'
  },
  {
    id: 'LIC-003',
    name: 'AutoCAD 2024',
    count: 15,
    department: 'LIS',
    purchaseDate: '10.3.2024',
    duration: '365',
    type: 'Normal',
    status: 'Abgelaufen',
    file: 'acad.exe',
    searchTerm: 'AutoCAD',
    description: 'AutoCAD 2024 für Engineering-Abteilung'
  },
  {
    id: 'LIC-004',
    name: 'SolidWorks Premium',
    count: 10,
    department: 'LIS',
    purchaseDate: '5.4.2024',
    duration: '365',
    type: 'Subscription',
    status: 'Abgelaufen',
    file: 'sldworks.exe',
    searchTerm: 'SolidWorks',
    description: 'SolidWorks Premium für 3D-Modellierung'
  },
  {
    id: 'LIC-005',
    name: 'Slack Enterprise',
    count: 50,
    department: 'IT',
    purchaseDate: '24.12.2024',
    duration: '365',
    type: 'Subscription',
    status: 'Bald erneuern',
    file: 'slack.exe',
    searchTerm: 'Slack',
    description: 'Slack Enterprise für interne Kommunikation'
  },
  {
    id: 'LIC-006',
    name: 'Figma Professional',
    count: 20,
    department: 'ITM',
    purchaseDate: '20.11.2025',
    duration: '365',
    type: 'Subscription',
    status: 'Aktiv',
    file: 'figma.exe',
    searchTerm: 'Figma',
    description: 'Figma Professional für Design-Team'
  }
];

/**
 * Holt alle Lizenzen
 * @returns {Promise<Array>} Array mit allen Lizenzen
 */
export const getAllLicenses = async () => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.get('/api/licenses').then(res => res.data);
  
  // Simuliere Netzwerk-Latenz
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLicenses);
    }, 100);
  });
};

/**
 * Holt eine einzelne Lizenz anhand der ID
 * @param {string} id - Die Lizenz-ID
 * @returns {Promise<Object|null>} Die Lizenz oder null
 */
export const getLicenseById = async (id) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.get(`/api/licenses/${id}`).then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const license = mockLicenses.find(l => l.id === id);
      resolve(license || null);
    }, 100);
  });
};

/**
 * Erstellt eine neue Lizenz
 * @param {Object} licenseData - Die Lizenzdaten
 * @returns {Promise<Object>} Die erstellte Lizenz
 */
export const createLicense = async (licenseData) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.post('/api/licenses', licenseData).then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLicense = {
        ...licenseData,
        id: `LIC-${String(mockLicenses.length + 1).padStart(3, '0')}`
      };
      mockLicenses.push(newLicense);
      resolve(newLicense);
    }, 100);
  });
};

/**
 * Aktualisiert eine bestehende Lizenz
 * @param {string} id - Die Lizenz-ID
 * @param {Object} licenseData - Die aktualisierten Lizenzdaten
 * @returns {Promise<Object|null>} Die aktualisierte Lizenz oder null
 */
export const updateLicense = async (id, licenseData) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.put(`/api/licenses/${id}`, licenseData).then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockLicenses.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLicenses[index] = { ...mockLicenses[index], ...licenseData };
        resolve(mockLicenses[index]);
      } else {
        resolve(null);
      }
    }, 100);
  });
};

/**
 * Löscht eine Lizenz
 * @param {string} id - Die Lizenz-ID
 * @returns {Promise<boolean>} true wenn erfolgreich gelöscht
 */
export const deleteLicense = async (id) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.delete(`/api/licenses/${id}`).then(() => true);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockLicenses.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLicenses.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Holt die verfügbaren Filter-Optionen
 * @returns {Promise<Object>} Objekt mit departments, types und statuses
 */
export const getFilterOptions = async () => {
  // TODO: Ersetze dies durch den echten API-Aufruf falls dynamisch
  // Beispiel: return await axios.get('/api/licenses/filter-options').then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        departments: ['Alle Abteilungen', 'IT', 'LIS', 'ITM'],
        types: ['Alle Typen', 'Subscription', 'Normal'],
        statuses: ['Alle Status', 'Abgelaufen', 'Aktiv', 'Bald erneuern'],
        renewalTypes: ['Normal', 'Subscription', 'Automatisch', 'Manuell']
      });
    }, 50);
  });
};

// Default export für einfachen Import
const licenseService = {
  getAllLicenses,
  getLicenseById,
  createLicense,
  updateLicense,
  deleteLicense,
  getFilterOptions
};

export default licenseService;