import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import licenseService from '../services/licenseService';
import '../stylesheets/Licenses.css';

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

const FileUploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const Licenses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('Alle Abteilungen');
  const [filterType, setFilterType] = useState('Alle Typen');
  const [filterStatus, setFilterStatus] = useState('Alle Status');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  
  // State für Daten vom Service
  const [licenses, setLicenses] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    departments: ['Alle Abteilungen'],
    types: ['Alle Typen'],
    statuses: ['Alle Status'],
    renewalTypes: ['Normal']
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lade Lizenzen beim Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Lade Lizenzen und Filter-Optionen parallel
        const [licensesData, filterOptionsData] = await Promise.all([
          licenseService.getAllLicenses(),
          licenseService.getFilterOptions()
        ]);
        
        setLicenses(licensesData);
        setFilterOptions(filterOptionsData);
      } catch (err) {
        console.error('Fehler beim Laden der Lizenzen:', err);
        setError('Fehler beim Laden der Lizenzen. Bitte versuchen Sie es erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Öffne Dialog wenn ?action=new in URL
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setAddDialogOpen(true);
      // Entferne den Parameter aus der URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const [newLicense, setNewLicense] = useState({
    name: '',
    count: '',
    department: '',
    purchaseDate: '',
    duration: '',
    renewalType: 'Normal',
    file: '',
    searchTerm: '',
    description: ''
  });

  const [reportOptions, setReportOptions] = useState({
    reportType: 'Alle Lizenzen',
    includeDescriptions: true,
    includeProofs: false
  });

  const handleAddLicense = async () => {
    try {
      const createdLicense = await licenseService.createLicense({
        ...newLicense,
        type: newLicense.renewalType,
        status: 'Aktiv'
      });
      
      // Aktualisiere die lokale Liste
      setLicenses(prev => [...prev, createdLicense]);
      
      // Reset Form und schließe Dialog
      setNewLicense({
        name: '',
        count: '',
        department: '',
        purchaseDate: '',
        duration: '',
        renewalType: 'Normal',
        file: '',
        searchTerm: '',
        description: ''
      });
      setAddDialogOpen(false);
    } catch (err) {
      console.error('Fehler beim Erstellen der Lizenz:', err);
      alert('Fehler beim Erstellen der Lizenz');
    }
  };

  const handleDeleteLicense = async (id) => {
    if (!window.confirm('Möchten Sie diese Lizenz wirklich löschen?')) {
      return;
    }
    
    try {
      const success = await licenseService.deleteLicense(id);
      if (success) {
        setLicenses(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error('Fehler beim Löschen der Lizenz:', err);
      alert('Fehler beim Löschen der Lizenz');
    }
  };

  const handleGenerateReport = () => {
    console.log('Bericht generieren:', reportOptions);
    setReportDialogOpen(false);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Abgelaufen':
        return 'chip-error';
      case 'Aktiv':
        return 'chip-success';
      case 'Bald erneuern':
        return 'chip-warning';
      default:
        return 'chip-default';
    }
  };

  // Filtering and Search Logic
  const filteredLicenses = useMemo(() => {
    return licenses.filter(license => {
      // Search filter - check multiple fields
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = searchTerm === '' || 
        license.name.toLowerCase().includes(searchLower) ||
        license.department.toLowerCase().includes(searchLower) ||
        license.file.toLowerCase().includes(searchLower) ||
        license.searchTerm.toLowerCase().includes(searchLower) ||
        license.id.toLowerCase().includes(searchLower) ||
        license.description.toLowerCase().includes(searchLower);

      // Department filter
      const matchesDepartment = filterDepartment === 'Alle Abteilungen' || 
        license.department === filterDepartment;

      // Type filter
      const matchesType = filterType === 'Alle Typen' || 
        license.type === filterType;

      // Status filter
      const matchesStatus = filterStatus === 'Alle Status' || 
        license.status === filterStatus;

      return matchesSearch && matchesDepartment && matchesType && matchesStatus;
    });
  }, [licenses, searchTerm, filterDepartment, filterType, filterStatus]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterDepartment('Alle Abteilungen');
    setFilterType('Alle Typen');
    setFilterStatus('Alle Status');
  };

  // Check if any filter is active
  const hasActiveFilters = searchTerm !== '' || 
    filterDepartment !== 'Alle Abteilungen' || 
    filterType !== 'Alle Typen' || 
    filterStatus !== 'Alle Status';

  // Loading State
  if (loading) {
    return (
      <div className="licenses">
        <div className="licenses-header">
          <h1 className="licenses-title">Lizenzen</h1>
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
      <div className="licenses">
        <div className="licenses-header">
          <h1 className="licenses-title">Lizenzen</h1>
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
    <div className="licenses">
      {/* Header */}
      <div className="licenses-header">
        <h1 className="licenses-title">Lizenzen</h1>
        <button className="btn btn-primary" onClick={() => setAddDialogOpen(true)}>
          <AddIcon />
          Neue Lizenz
        </button>
      </div>

      {/* Such- und Filter-Leiste */}
      <div className="paper filter-bar">
        <div className="filter-grid">
          <div className="search-field">
            <span className="search-icon"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Suche nach Name, Abteilung, Datei oder Suchbegriff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Abteilung</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              {filterOptions.departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label>Typ</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {filterOptions.types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-footer">
          <p className="filter-info">
            {filteredLicenses.length} von {licenses.length} Lizenzen angezeigt
            {hasActiveFilters && (
              <button className="btn-reset" onClick={resetFilters}>
                Filter zurücksetzen
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Tabelle */}
      <div className="paper table-container">
        <table className="licenses-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Anzahl</th>
              <th>Abteilung</th>
              <th>Kaufdatum</th>
              <th>Dauer (Tage)</th>
              <th>Typ</th>
              <th>Status</th>
              <th>Datei</th>
              <th>Suchbegriff</th>
              <th>Nachweis</th>
              <th>Beschreibung</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredLicenses.length > 0 ? (
              filteredLicenses.map((license) => (
                <tr key={license.id}>
                  <td>{license.id}</td>
                  <td>
                    <span className="license-name">{license.name}</span>
                  </td>
                  <td>{license.count}</td>
                  <td>
                    <span className="chip chip-outlined">{license.department}</span>
                  </td>
                  <td>{license.purchaseDate}</td>
                  <td>{license.duration}</td>
                  <td>
                    <span className={`chip ${license.type === 'Subscription' ? 'chip-primary' : 'chip-default'}`}>
                      {license.type}
                    </span>
                  </td>
                  <td>
                    <span className={`chip ${getStatusClass(license.status)}`}>
                      {license.status}
                    </span>
                  </td>
                  <td>
                    <code className="file-name">{license.file}</code>
                  </td>
                  <td>{license.searchTerm}</td>
                  <td>
                    <button className="btn btn-text btn-small">
                      <FileUploadIcon />
                      Hochladen
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-text btn-small">Anzeigen</button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn icon-btn-primary">
                        <EditIcon />
                      </button>
                      <button 
                        className="icon-btn icon-btn-error"
                        onClick={() => handleDeleteLicense(license.id)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="empty-state">
                  <div className="empty-state-content">
                    <SearchIcon />
                    <p>Keine Lizenzen gefunden</p>
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

      {/* Neue Lizenz Dialog */}
      {addDialogOpen && (
        <div className="dialog-overlay" onClick={() => setAddDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Neue Lizenz hinzufügen</h2>
              <button className="icon-btn" onClick={() => setAddDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="z.B. Adobe Creative Cloud"
                  value={newLicense.name}
                  onChange={(e) => setNewLicense({...newLicense, name: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Anzahl *</label>
                  <input
                    type="number"
                    value={newLicense.count}
                    onChange={(e) => setNewLicense({...newLicense, count: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Abteilung *</label>
                  <select
                    value={newLicense.department}
                    onChange={(e) => setNewLicense({...newLicense, department: e.target.value})}
                  >
                    <option value="">Auswählen...</option>
                    {filterOptions.departments
                      .filter(d => d !== 'Alle Abteilungen')
                      .map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Kaufdatum *</label>
                  <input
                    type="date"
                    value={newLicense.purchaseDate}
                    onChange={(e) => setNewLicense({...newLicense, purchaseDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Dauer (Tage) *</label>
                  <input
                    type="number"
                    placeholder="365"
                    value={newLicense.duration}
                    onChange={(e) => setNewLicense({...newLicense, duration: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Verlängerungstyp *</label>
                <select
                  value={newLicense.renewalType}
                  onChange={(e) => setNewLicense({...newLicense, renewalType: e.target.value})}
                >
                  {filterOptions.renewalTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Datei *</label>
                  <input
                    type="text"
                    placeholder="z.B. photoshop.exe"
                    value={newLicense.file}
                    onChange={(e) => setNewLicense({...newLicense, file: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Suchbegriff *</label>
                  <input
                    type="text"
                    placeholder="z.B. Photoshop"
                    value={newLicense.searchTerm}
                    onChange={(e) => setNewLicense({...newLicense, searchTerm: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Beschreibung *</label>
                <textarea
                  placeholder="Kurze Beschreibung der Lizenz..."
                  rows={2}
                  value={newLicense.description}
                  onChange={(e) => setNewLicense({...newLicense, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Nachweis der Lizenz</label>
                <label className="file-upload-btn">
                  <FileUploadIcon />
                  Nachweis hochladen
                  <input type="file" hidden />
                </label>
                <span className="file-hint">Unterstützte Formate: PDF, JPG, PNG (max. 5MB)</span>
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-text" onClick={() => setAddDialogOpen(false)}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={handleAddLicense}>
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lizenzbericht Dialog */}
      {reportDialogOpen && (
        <div className="dialog-overlay" onClick={() => setReportDialogOpen(false)}>
          <div className="dialog dialog-small" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Lizenzbericht erstellen</h2>
              <button className="icon-btn" onClick={() => setReportDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>Berichtstyp *</label>
                <select
                  value={reportOptions.reportType}
                  onChange={(e) => setReportOptions({...reportOptions, reportType: e.target.value})}
                >
                  <option value="Alle Lizenzen">Alle Lizenzen</option>
                  <option value="Ablaufende Lizenzen">Ablaufende Lizenzen</option>
                  <option value="Abgelaufene Lizenzen">Abgelaufene Lizenzen</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label-bold">Berichtsoptionen</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={reportOptions.includeDescriptions}
                      onChange={(e) => setReportOptions({...reportOptions, includeDescriptions: e.target.checked})}
                    />
                    Beschreibungen einbeziehen
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={reportOptions.includeProofs}
                      onChange={(e) => setReportOptions({...reportOptions, includeProofs: e.target.checked})}
                    />
                    Nachweisinformationen einbeziehen
                  </label>
                </div>
              </div>
              <p className="info-text">{licenses.length} Lizenzen werden in den Bericht aufgenommen</p>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-text" onClick={() => setReportDialogOpen(false)}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={handleGenerateReport}>
                <FileUploadIcon />
                Bericht generieren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Licenses;