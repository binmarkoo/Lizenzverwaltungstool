// Test-Daten - Diese werden später durch echte API-Aufrufe ersetzt
const mockUsers = [
  {
    id: 'USER-001',
    name: 'Max Mustermann',
    email: 'max.mustermann@liebherr.com',
    role: 'Admin',
    department: 'IT',
    lastActive: '3.12.2024'
  },
  {
    id: 'USER-002',
    name: 'Anna Schmidt',
    email: 'anna.schmidt@liebherr.com',
    role: 'Editor',
    department: 'LIS',
    lastActive: '2.12.2024'
  },
  {
    id: 'USER-003',
    name: 'Thomas Weber',
    email: 'thomas.weber@liebherr.com',
    role: 'Viewer',
    department: 'ITM',
    lastActive: '1.12.2024'
  },
  {
    id: 'USER-004',
    name: 'Maria Müller',
    email: 'maria.mueller@liebherr.com',
    role: 'Lizenzuser',
    department: 'IT',
    lastActive: '30.11.2024'
  }
];

/**
 * Holt alle Benutzer
 * @returns {Promise<Array>} Array mit allen Benutzern
 */
export const getAllUsers = async () => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.get('/api/users').then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockUsers]);
    }, 100);
  });
};

/**
 * Holt einen einzelnen Benutzer anhand der ID
 * @param {string} id - Die Benutzer-ID
 * @returns {Promise<Object|null>} Der Benutzer oder null
 */
export const getUserById = async (id) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.get(`/api/users/${id}`).then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.id === id);
      resolve(user || null);
    }, 100);
  });
};

/**
 * Erstellt einen neuen Benutzer
 * @param {Object} userData - Die Benutzerdaten
 * @returns {Promise<Object>} Der erstellte Benutzer
 */
export const createUser = async (userData) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.post('/api/users', userData).then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date();
      const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
      
      const newUser = {
        ...userData,
        id: `USER-${String(mockUsers.length + 1).padStart(3, '0')}`,
        lastActive: formattedDate
      };
      mockUsers.push(newUser);
      resolve(newUser);
    }, 100);
  });
};

/**
 * Aktualisiert einen bestehenden Benutzer
 * @param {string} id - Die Benutzer-ID
 * @param {Object} userData - Die aktualisierten Benutzerdaten
 * @returns {Promise<Object|null>} Der aktualisierte Benutzer oder null
 */
export const updateUser = async (id, userData) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.put(`/api/users/${id}`, userData).then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...userData };
        resolve(mockUsers[index]);
      } else {
        resolve(null);
      }
    }, 100);
  });
};

/**
 * Löscht einen Benutzer
 * @param {string} id - Die Benutzer-ID
 * @returns {Promise<boolean>} true wenn erfolgreich gelöscht
 */
export const deleteUser = async (id) => {
  // TODO: Ersetze dies durch den echten API-Aufruf
  // Beispiel: return await axios.delete(`/api/users/${id}`).then(() => true);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Holt die verfügbaren Filter-Optionen
 * @returns {Promise<Object>} Objekt mit roles, departments, etc.
 */
export const getFilterOptions = async () => {
  // TODO: Ersetze dies durch den echten API-Aufruf falls dynamisch
  // Beispiel: return await axios.get('/api/users/filter-options').then(res => res.data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        roles: [
          { value: 'Admin', label: 'Admin - Volle Verwaltung aller Bereiche', color: 'error' },
          { value: 'Editor', label: 'Editor - Kann Lizenzen bearbeiten', color: 'primary' },
          { value: 'Viewer', label: 'Viewer - Nur Anzeige und Suche', color: 'default' },
          { value: 'Lizenzuser', label: 'Lizenzuser - Lizenznutzer', color: 'success' }
        ],
        departments: ['IT', 'LIS', 'ITM'],
        roleFilters: ['Alle Rollen', 'Admin', 'Editor', 'Viewer', 'Lizenzuser'],
        departmentFilters: ['Alle Abteilungen', 'IT', 'LIS', 'ITM']
      });
    }, 50);
  });
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