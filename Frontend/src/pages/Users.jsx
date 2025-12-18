import React, { useState, useMemo, useEffect } from 'react';
import userService from '../services/userService';
import '../stylesheets/Users.css';

// Icons als SVG-Komponenten
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M17 11c.34 0 .67.04 1 .09V6.27L10.5 3 3 6.27v4.91c0 4.54 3.2 8.79 7.5 9.82.55-.13 1.08-.32 1.6-.55-.69-.98-1.1-2.17-1.1-3.45 0-3.31 2.69-6 6-6z"/>
    <path d="M17 13c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 1.38c.62 0 1.12.51 1.12 1.12s-.51 1.12-1.12 1.12-1.12-.51-1.12-1.12.5-1.12 1.12-1.12zm0 5.37c-.93 0-1.74-.46-2.24-1.17.05-.72 1.51-1.08 2.24-1.08s2.19.36 2.24 1.08c-.5.71-1.31 1.17-2.24 1.17z"/>
  </svg>
);

const EditorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const ViewerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Alle Rollen');
  const [filterDepartment, setFilterDepartment] = useState('Alle Abteilungen');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // State für Daten vom Service
  const [users, setUsers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    roles: [],
    departments: [],
    roleFilters: ['Alle Rollen'],
    departmentFilters: ['Alle Abteilungen']
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lade Benutzer beim Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [usersData, filterOptionsData] = await Promise.all([
          userService.getAllUsers(),
          userService.getFilterOptions()
        ]);
        
        setUsers(usersData);
        setFilterOptions(filterOptionsData);
      } catch (err) {
        console.error('Fehler beim Laden der Benutzer:', err);
        setError('Fehler beim Laden der Benutzer. Bitte versuchen Sie es erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Viewer',
    department: ''
  });

  const [editUser, setEditUser] = useState({
    id: '',
    name: '',
    email: '',
    role: 'Viewer',
    department: '',
    lastActive: ''
  });

  const handleAddUser = async () => {
    try {
      const createdUser = await userService.createUser(newUser);
      setUsers(prev => [...prev, createdUser]);
      setNewUser({
        name: '',
        email: '',
        role: 'Viewer',
        department: ''
      });
      setAddDialogOpen(false);
    } catch (err) {
      console.error('Fehler beim Erstellen des Benutzers:', err);
      alert('Fehler beim Erstellen des Benutzers');
    }
  };

  const handleEditClick = (user) => {
    setEditUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      lastActive: user.lastActive
    });
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const updatedUser = await userService.updateUser(editUser.id, editUser);
      if (updatedUser) {
        setUsers(prev => prev.map(u => u.id === editUser.id ? updatedUser : u));
        setEditDialogOpen(false);
      }
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Benutzers:', err);
      alert('Fehler beim Aktualisieren des Benutzers');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
      return;
    }
    
    try {
      const success = await userService.deleteUser(id);
      if (success) {
        setUsers(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      console.error('Fehler beim Löschen des Benutzers:', err);
      alert('Fehler beim Löschen des Benutzers');
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'chip-error';
      case 'Editor':
        return 'chip-primary';
      case 'Viewer':
        return 'chip-default';
      case 'Lizenzuser':
        return 'chip-success';
      default:
        return 'chip-default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <AdminIcon />;
      case 'Editor':
        return <EditorIcon />;
      case 'Viewer':
        return <ViewerIcon />;
      case 'Lizenzuser':
        return <PersonIcon />;
      default:
        return null;
    }
  };

  const getRoleCardClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'role-card-error';
      case 'Editor':
        return 'role-card-primary';
      case 'Viewer':
        return 'role-card-default';
      case 'Lizenzuser':
        return 'role-card-success';
      default:
        return 'role-card-default';
    }
  };

  // Filtering and Search Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.department.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower);

      const matchesRole = filterRole === 'Alle Rollen' || 
        user.role === filterRole;

      const matchesDepartment = filterDepartment === 'Alle Abteilungen' || 
        user.department === filterDepartment;

      return matchesSearch && matchesRole && matchesDepartment;
    });
  }, [users, searchTerm, filterRole, filterDepartment]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterRole('Alle Rollen');
    setFilterDepartment('Alle Abteilungen');
  };

  const hasActiveFilters = searchTerm !== '' || 
    filterRole !== 'Alle Rollen' || 
    filterDepartment !== 'Alle Abteilungen';

  const getUserCountByRole = (roleValue) => {
    return users.filter(user => user.role === roleValue).length;
  };

  // Loading State
  if (loading) {
    return (
      <div className="users">
        <div className="users-header">
          <h1 className="users-title">Benutzerverwaltung</h1>
        </div>
        <div className="paper" style={{ padding: '40px', textAlign: 'center' }}>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="users">
        <div className="users-header">
          <h1 className="users-title">Benutzerverwaltung</h1>
        </div>
        <div className="paper" style={{ padding: '40px', textAlign: 'center', color: '#d32f2f' }}>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users">
      {/* Header */}
      <div className="users-header">
        <div>
          <h1 className="users-title">Benutzerverwaltung</h1>
          <p className="users-subtitle">Verwalten Sie Benutzer und deren Berechtigungen</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAddDialogOpen(true)}>
          <AddIcon />
          Neuer Benutzer
        </button>
      </div>

      {/* Such- und Filter-Leiste */}
      <div className="paper filter-bar">
        <div className="filter-grid-users">
          <div className="search-field">
            <span className="search-icon"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Suche nach Name, E-Mail, Abteilung oder Rolle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Rolle</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              {filterOptions.roleFilters.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label>Abteilung</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              {filterOptions.departmentFilters.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-footer">
          <p className="filter-info">
            {filteredUsers.length} von {users.length} Benutzer angezeigt
            {hasActiveFilters && (
              <button className="btn-reset" onClick={resetFilters}>
                Filter zurücksetzen
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Rollen-Übersicht Karten */}
      <div className="roles-grid">
        {filterOptions.roles.map((role) => (
          <div 
            key={role.value} 
            className={`role-card ${getRoleCardClass(role.value)} ${filterRole === role.value ? 'active' : ''}`}
            onClick={() => setFilterRole(filterRole === role.value ? 'Alle Rollen' : role.value)}
          >
            <div className="role-card-header">
              <div className={`role-icon-wrapper ${getRoleCardClass(role.value)}`}>
                {getRoleIcon(role.value)}
              </div>
              <h3 className="role-card-title">{role.value}</h3>
              <span className="role-card-count">{getUserCountByRole(role.value)}</span>
            </div>
            <p className="role-card-description">
              {role.label.split(' - ')[1]}
            </p>
          </div>
        ))}
      </div>

      {/* Benutzer Tabelle */}
      <div className="paper table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Rolle</th>
              <th>Abteilung</th>
              <th>Zuletzt aktiv</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <span className="user-name">{user.name}</span>
                  </td>
                  <td>
                    <span className="user-email">{user.email}</span>
                  </td>
                  <td>
                    <span className={`chip chip-with-icon ${getRoleClass(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className="chip chip-outlined">{user.department}</span>
                  </td>
                  <td>{user.lastActive}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-btn icon-btn-primary"
                        onClick={() => handleEditClick(user)}
                        title="Bearbeiten"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        className="icon-btn icon-btn-error"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Löschen"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">
                  <div className="empty-state-content">
                    <SearchIcon />
                    <p>Keine Benutzer gefunden</p>
                    <span>Versuchen Sie andere Suchbegriffe oder Filter</span>
                    {hasActiveFilters && (
                      <button className="btn btn-outlined" onClick={resetFilters}>
                        Filter zurücksetzen
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Neuer Benutzer Dialog */}
      {addDialogOpen && (
        <div className="dialog-overlay" onClick={() => setAddDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Neuer Benutzer hinzufügen</h2>
              <button className="icon-btn" onClick={() => setAddDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="z.B. Max Mustermann"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>E-Mail *</label>
                <input
                  type="email"
                  placeholder="z.B. max.mustermann@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Rolle *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  {filterOptions.roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <span className="form-hint">
                  {filterOptions.roles.find(r => r.value === newUser.role)?.label.split(' - ')[1] || ''}
                </span>
              </div>
              <div className="form-group">
                <label>Abteilung *</label>
                <select
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                >
                  <option value="">Auswählen...</option>
                  {filterOptions.departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-text" onClick={() => setAddDialogOpen(false)}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={handleAddUser}>
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Benutzer bearbeiten Dialog */}
      {editDialogOpen && (
        <div className="dialog-overlay" onClick={() => setEditDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Benutzer bearbeiten</h2>
              <button className="icon-btn" onClick={() => setEditDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>ID</label>
                <input
                  type="text"
                  value={editUser.id}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="z.B. Max Mustermann"
                  value={editUser.name}
                  onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>E-Mail *</label>
                <input
                  type="email"
                  placeholder="z.B. max.mustermann@example.com"
                  value={editUser.email}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Rolle *</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                >
                  {filterOptions.roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <span className="form-hint">
                  {filterOptions.roles.find(r => r.value === editUser.role)?.label.split(' - ')[1] || ''}
                </span>
              </div>
              <div className="form-group">
                <label>Abteilung *</label>
                <select
                  value={editUser.department}
                  onChange={(e) => setEditUser({...editUser, department: e.target.value})}
                >
                  <option value="">Auswählen...</option>
                  {filterOptions.departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Zuletzt aktiv</label>
                <input
                  type="text"
                  value={editUser.lastActive}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-text" onClick={() => setEditDialogOpen(false)}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={handleUpdateUser}>
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;