// Test-Daten - Diese werden später durch echte API-Aufrufe ersetzt
const mockDepartments = [
  { id: 1, name: 'LIS' },
  { id: 2, name: 'IT' },
  { id: 3, name: 'ITM' }
];

let nextId = 4;

/**
 * Holt alle Abteilungen
 * @returns {Promise<Array>} Array mit allen Abteilungen
 */
export const getAllDepartments = async () => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.get('/api/departments').then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockDepartments]);
    }, 100);
  });
};

/**
 * Holt eine einzelne Abteilung anhand der ID
 * @param {number} id - Die Abteilungs-ID
 * @returns {Promise<Object|null>} Die Abteilung oder null
 */
export const getDepartmentById = async (id) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.get(`/api/departments/${id}`).then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const department = mockDepartments.find(d => d.id === id);
      resolve(department || null);
    }, 100);
  });
};

/**
 * Erstellt eine neue Abteilung
 * @param {string} name - Der Abteilungsname
 * @returns {Promise<Object>} Die erstellte Abteilung
 */
export const createDepartment = async (name) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.post('/api/departments', { name }).then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDepartment = {
        id: nextId++,
        name: name.trim()
      };
      mockDepartments.push(newDepartment);
      resolve(newDepartment);
    }, 100);
  });
};

/**
 * Aktualisiert eine bestehende Abteilung
 * @param {number} id - Die Abteilungs-ID
 * @param {string} name - Der neue Abteilungsname
 * @returns {Promise<Object|null>} Die aktualisierte Abteilung oder null
 */
export const updateDepartment = async (id, name) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.put(`/api/departments/${id}`, { name }).then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockDepartments.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDepartments[index] = { ...mockDepartments[index], name: name.trim() };
        resolve(mockDepartments[index]);
      } else {
        resolve(null);
      }
    }, 100);
  });
};

/**
 * Löscht eine Abteilung
 * @param {number} id - Die Abteilungs-ID
 * @returns {Promise<boolean>} true wenn erfolgreich gelöscht
 */
export const deleteDepartment = async (id) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.delete(`/api/departments/${id}`).then(() => true);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockDepartments.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDepartments.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Holt die Abteilungsnamen als einfaches Array (für Dropdowns)
 * @returns {Promise<Array<string>>} Array mit Abteilungsnamen
 */
export const getDepartmentNames = async () => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.get('/api/departments/names').then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDepartments.map(d => d.name));
    }, 50);
  });
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