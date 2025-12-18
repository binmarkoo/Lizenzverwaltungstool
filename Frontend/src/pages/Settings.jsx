import React, { useState, useEffect } from 'react';
import departmentService from '../services/departmentService';
import '../stylesheets/Settings.css';

// Icons als SVG-Komponenten
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

const Settings = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [editDepartment, setEditDepartment] = useState({ id: null, name: '' });

  // State für Daten vom Service
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lade Abteilungen beim Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await departmentService.getAllDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Fehler beim Laden der Abteilungen:', err);
        setError('Fehler beim Laden der Abteilungen.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) {
      alert('Bitte geben Sie einen Abteilungsnamen ein.');
      return;
    }

    try {
      const created = await departmentService.createDepartment(newDepartment);
      setDepartments(prev => [...prev, created]);
      setAddDialogOpen(false);
      setNewDepartment('');
    } catch (err) {
      console.error('Fehler beim Erstellen der Abteilung:', err);
      alert('Fehler beim Erstellen der Abteilung');
    }
  };

  const handleEditClick = (dept) => {
    setEditDepartment({ id: dept.id, name: dept.name });
    setEditDialogOpen(true);
  };

  const handleUpdateDepartment = async () => {
    if (!editDepartment.name.trim()) {
      alert('Bitte geben Sie einen Abteilungsnamen ein.');
      return;
    }

    try {
      const updated = await departmentService.updateDepartment(editDepartment.id, editDepartment.name);
      if (updated) {
        setDepartments(prev => prev.map(d => d.id === editDepartment.id ? updated : d));
        setEditDialogOpen(false);
        setEditDepartment({ id: null, name: '' });
      }
    } catch (err) {
      console.error('Fehler beim Aktualisieren der Abteilung:', err);
      alert('Fehler beim Aktualisieren der Abteilung');
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Möchten Sie diese Abteilung wirklich löschen?')) {
      return;
    }

    try {
      const success = await departmentService.deleteDepartment(id);
      if (success) {
        setDepartments(prev => prev.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error('Fehler beim Löschen der Abteilung:', err);
      alert('Fehler beim Löschen der Abteilung');
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="settings">
        <h1 className="settings-title">Einstellungen</h1>
        <div className="paper" style={{ padding: '40px', textAlign: 'center' }}>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="settings">
        <h1 className="settings-title">Einstellungen</h1>
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
    <div className="settings">
      {/* Header */}
      <h1 className="settings-title">Einstellungen</h1>

      {/* Abteilungsverwaltung */}
      <div className="paper">
        <div className="section-header">
          <h2 className="section-title">Abteilungsverwaltung</h2>
          <button className="btn btn-primary" onClick={() => setAddDialogOpen(true)}>
            <AddIcon />
            Neue Abteilung
          </button>
        </div>

        <p className="section-description">
          Verwalten Sie die Abteilungen, die bei der Lizenzverwaltung zur Auswahl stehen.
        </p>

        <ul className="department-list">
          {departments.map((dept, index) => (
            <li 
              key={dept.id} 
              className={`department-item ${index < departments.length - 1 ? 'divider' : ''}`}
            >
              <span className="department-name">{dept.name}</span>
              <div className="department-actions">
                <button 
                  className="icon-btn icon-btn-primary"
                  onClick={() => handleEditClick(dept)}
                  title="Bearbeiten"
                >
                  <EditIcon />
                </button>
                <button 
                  className="icon-btn icon-btn-error"
                  onClick={() => handleDeleteDepartment(dept.id)}
                  title="Löschen"
                >
                  <DeleteIcon />
                </button>
              </div>
            </li>
          ))}
          {departments.length === 0 && (
            <li className="department-item">
              <span className="department-name" style={{ color: '#999' }}>
                Keine Abteilungen vorhanden
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* Neue Abteilung Dialog */}
      {addDialogOpen && (
        <div className="dialog-overlay" onClick={() => setAddDialogOpen(false)}>
          <div className="dialog dialog-small" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Neue Abteilung hinzufügen</h2>
              <button className="icon-btn" onClick={() => setAddDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>Abteilungsname *</label>
                <input
                  type="text"
                  placeholder="z.B. Marketing"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-text" onClick={() => setAddDialogOpen(false)}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={handleAddDepartment}>
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Abteilung bearbeiten Dialog */}
      {editDialogOpen && (
        <div className="dialog-overlay" onClick={() => setEditDialogOpen(false)}>
          <div className="dialog dialog-small" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Abteilung bearbeiten</h2>
              <button className="icon-btn" onClick={() => setEditDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>Abteilungsname *</label>
                <input
                  type="text"
                  placeholder="z.B. Marketing"
                  value={editDepartment.name}
                  onChange={(e) => setEditDepartment({...editDepartment, name: e.target.value})}
                  autoFocus
                />
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-text" onClick={() => setEditDialogOpen(false)}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={handleUpdateDepartment}>
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;