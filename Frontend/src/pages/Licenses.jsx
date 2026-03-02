import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import licenseService from '../services/licenseService';
import LicenseDocumentsDialog from '../components/LicenseDocumentsDialog';
import { useFilters } from '../context/FilterContext';
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
  const { departments, departmentFilters, types, statuses, renewalTypes } = useFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All Departments');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const [selectedLicenseForDocs, setSelectedLicenseForDocs] = useState(null);
  
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await licenseService.getAllLicenses();
        setLicenses(data);
      } catch (err) {
        console.error('Error loading licenses:', err);
        setError('Failed to load licenses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setAddDialogOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const [newLicense, setNewLicense] = useState({
    name: '',
    key: '',
    count: '',
    departmentId: '',
    purchaseDate: '',
    duration: 12,
    renewalType: 'Normal',
    file: '',
    searchTerm: '',
    description: ''
  });

  const [editLicense, setEditLicense] = useState({
    id: '',
    name: '',
    count: '',
    departmentId: '',
    purchaseDate: '',
    duration: '',
    type: 'Normal',
    status: 'Active',
    file: '',
    searchTerm: '',
    description: ''
  });

  const [reportOptions, setReportOptions] = useState({
    reportType: 'All Licenses',
    includeDescriptions: true,
    includeProofs: false
  });

  const handleAddLicense = async () => {
    try {
      const createdLicense = await licenseService.createLicense({
        ...newLicense,
        type: newLicense.renewalType,
        status: 'Active'
      });
      
      const deptObj = departments.find(d => d.id === createdLicense.departmentId);
      createdLicense.department = deptObj ? deptObj.name : 'Unknown';

      setLicenses(prev => [...prev, createdLicense]);
      setNewLicense({
        name: '',
        key: '',
        count: '',
        departmentId: '',
        purchaseDate: '',
        duration: 12,
        renewalType: 'Normal',
        file: '',
        searchTerm: '',
        description: ''
      });
      setAddDialogOpen(false);
      setSelectedLicenseForDocs(createdLicense);
      setDocumentsDialogOpen(true);
    } catch (err) {
      console.error('Error creating license:', err);
      alert('Error creating license');
    }
  };

  const handleEditClick = (license) => {
    setEditLicense({
      id: license.id,
      name: license.name,
      count: license.count,
      departmentId: license.departmentId,
      purchaseDate: license.purchaseDate,
      duration: license.duration,
      type: license.type,
      status: license.status,
      file: license.file,
      searchTerm: license.searchTerm,
      description: license.description
    });
    setEditDialogOpen(true);
  };

  const handleUpdateLicense = async () => {
    try {
      const updatedLicense = await licenseService.updateLicense(editLicense.id, editLicense);
      
      if (updatedLicense) {
        const deptObj = departments.find(d => d.id === updatedLicense.departmentId);
        updatedLicense.department = deptObj ? deptObj.name : 'Unknown';

        setLicenses(prev => prev.map(l => l.id === editLicense.id ? updatedLicense : l));
        setEditDialogOpen(false);
      }
    } catch (err) {
      console.error('Error updating license:', err);
      alert('Error updating license');
    }
  };

  const handleDeleteLicense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this license?')) {
      return;
    }
    
    try {
      const success = await licenseService.deleteLicense(id);
      if (success) {
        setLicenses(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error('Error deleting license:', err);
      alert('Error deleting license');
    }
  };

  const handleOpenDocuments = (license) => {
    setSelectedLicenseForDocs(license);
    setDocumentsDialogOpen(true);
  };

  const handleGenerateReport = () => {
    console.log('Generate report:', reportOptions);
    setReportDialogOpen(false);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Expired':
        return 'chip-error';
      case 'Active':
        return 'chip-success';
      case 'Expiring soon':
        return 'chip-warning';
      default:
        return 'chip-default';
    }
  };

  const filteredLicenses = useMemo(() => {
    return licenses.filter(license => {
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = searchTerm === '' || 
        license.name.toLowerCase().includes(searchLower) ||
        license.department.toLowerCase().includes(searchLower) ||
        license.file.toLowerCase().includes(searchLower) ||
        license.searchTerm.toLowerCase().includes(searchLower) ||
        license.id.toLowerCase().includes(searchLower) ||
        license.description.toLowerCase().includes(searchLower);

      const matchesDepartment = filterDepartment === 'All Departments' || 
        license.department === filterDepartment;

      const matchesType = filterType === 'All Types' || 
        license.type === filterType;

      const matchesStatus = filterStatus === 'All Statuses' || 
        license.status === filterStatus;

      return matchesSearch && matchesDepartment && matchesType && matchesStatus;
    });
  }, [licenses, searchTerm, filterDepartment, filterType, filterStatus]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterDepartment('All Departments');
    setFilterType('All Types');
    setFilterStatus('All Statuses');
  };

  const hasActiveFilters = searchTerm !== '' || 
    filterDepartment !== 'All Departments' || 
    filterType !== 'All Types' || 
    filterStatus !== 'All Statuses';

  if (loading) {
    return (
      <div className="licenses">
        <div className="licenses-header">
          <h1 className="licenses-title">Licenses</h1>
        </div>
        <div className="paper" style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="licenses">
        <div className="licenses-header">
          <h1 className="licenses-title">Licenses</h1>
        </div>
        <div className="paper" style={{ padding: '40px', textAlign: 'center', color: '#d32f2f' }}>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="licenses">
      {/* Header */}
      <div className="licenses-header">
        <h1 className="licenses-title">Licenses</h1>
        <button className="btn btn-primary" onClick={() => setAddDialogOpen(true)}>
          <AddIcon />
          New License
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="paper filter-bar">
        <div className="filter-grid">
          <div className="search-field">
            <span className="search-icon"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Search by name, department, file or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>Department</label>
            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
              {departmentFilters.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label>Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {types.map(type => (
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
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-footer">
          <p className="filter-info">
            {filteredLicenses.length} of {licenses.length} licenses displayed
            {hasActiveFilters && (
              <button className="btn-reset" onClick={resetFilters}>
                Reset Filters
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="paper table-container">
        <table className="licenses-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>License Key</th>
              <th>Amount</th>
              <th>Department</th>
              <th>Purchase Date</th>
              <th>Duration (Months)</th>
              <th>Type</th>
              <th>Status</th>
              <th>File</th>
              <th>Search Term</th>
              <th>Proof</th>
              <th>Description</th>
              <th>Actions</th>
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
                  <td>
                    <span className="license-key">{license.licenseKey}</span>
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
                    <button 
                      className="btn btn-text btn-small"
                      onClick={() => handleOpenDocuments(license)}
                    >
                      <FileUploadIcon />
                      {license.documentCount > 0 ? `${license.documentCount} file(s)` : 'Upload'}
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-text btn-small">Show</button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-btn icon-btn-primary"
                        onClick={() => handleEditClick(license)}
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        className="icon-btn icon-btn-error"
                        onClick={() => handleDeleteLicense(license.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="empty-state">
                  <div className="empty-state-content">
                    <SearchIcon />
                    <p>No licenses found</p>
                    <span>Try different search terms or filters</span>
                    {hasActiveFilters && (
                      <button className="btn btn-outlined" onClick={resetFilters}>
                        Reset Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New License Dialog */}
      {addDialogOpen && (
        <div className="dialog-overlay" onClick={() => setAddDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>New License</h2>
              <button className="icon-btn" onClick={() => setAddDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Adobe Creative Cloud"
                  value={newLicense.name}
                  onChange={(e) => setNewLicense({...newLicense, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>License Key</label>
                <input
                  type="text"
                  name="licenseKey"
                  value={newLicense.key}
                  onChange={(e) => setNewLicense({...newLicense, key: e.target.value})}
                  placeholder="e.g. XXXX-XXXX-XXXX-XXXX"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    value={newLicense.count}
                    onChange={(e) => setNewLicense({...newLicense, count: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={newLicense.departmentId}
                    onChange={(e) => setNewLicense({...newLicense, departmentId: e.target.value})}
                  >
                    <option value="">Select...</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Purchase Date *</label>
                  <input
                    type="date"
                    value={newLicense.purchaseDate}
                    onChange={(e) => setNewLicense({...newLicense, purchaseDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Duration (Months) *</label>
                  <input
                    type="number"
                    placeholder="12"
                    value={newLicense.duration}
                    onChange={(e) => setNewLicense({...newLicense, duration: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Renewal Type *</label>
                <select
                  value={newLicense.renewalType}
                  onChange={(e) => setNewLicense({...newLicense, renewalType: e.target.value})}
                >
                  {renewalTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>File *</label>
                  <input
                    type="text"
                    placeholder="e.g. photoshop.exe"
                    value={newLicense.file}
                    onChange={(e) => setNewLicense({...newLicense, file: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Search Term *</label>
                  <input
                    type="text"
                    placeholder="e.g. Photoshop"
                    value={newLicense.searchTerm}
                    onChange={(e) => setNewLicense({...newLicense, searchTerm: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  placeholder="Short description of the license..."
                  rows={2}
                  value={newLicense.description}
                  onChange={(e) => setNewLicense({...newLicense, description: e.target.value})}
                />
              </div>
              {/* Proof-Upload Bereich entfernt */}
            </div>
            <div className="dialog-actions">
              <button className="btn btn-text" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddLicense}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit License Dialog */}
      {editDialogOpen && (
        <div className="dialog-overlay" onClick={() => setEditDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Edit License</h2>
              <button className="icon-btn" onClick={() => setEditDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>ID</label>
                <input
                  type="text"
                  value={editLicense.id}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Adobe Creative Cloud"
                  value={editLicense.name}
                  onChange={(e) => setEditLicense({...editLicense, name: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    value={editLicense.count}
                    onChange={(e) => setEditLicense({...editLicense, count: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={editLicense.departmentId}
                    onChange={(e) => setEditLicense({...editLicense, departmentId: e.target.value})}
                  >
                    <option value="">Select...</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Purchase Date *</label>
                  <input
                    type="text"
                    value={editLicense.purchaseDate}
                    onChange={(e) => setEditLicense({...editLicense, purchaseDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Duration (Months) *</label>
                  <input
                    type="number"
                    placeholder="12"
                    value={editLicense.duration}
                    onChange={(e) => setEditLicense({...editLicense, duration: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={editLicense.type}
                    onChange={(e) => setEditLicense({...editLicense, type: e.target.value})}
                  >
                    {renewalTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={editLicense.status}
                    onChange={(e) => setEditLicense({...editLicense, status: e.target.value})}
                  >
                    {statuses.filter(s => s !== 'All Statuses').map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>File *</label>
                  <input
                    type="text"
                    placeholder="e.g. photoshop.exe"
                    value={editLicense.file}
                    onChange={(e) => setEditLicense({...editLicense, file: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Search Term *</label>
                  <input
                    type="text"
                    placeholder="e.g. Photoshop"
                    value={editLicense.searchTerm}
                    onChange={(e) => setEditLicense({...editLicense, searchTerm: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  placeholder="Short description of the license..."
                  rows={2}
                  value={editLicense.description}
                  onChange={(e) => setEditLicense({...editLicense, description: e.target.value})}
                />
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-text" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateLicense}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Dialog */}
      {reportDialogOpen && (
        <div className="dialog-overlay" onClick={() => setReportDialogOpen(false)}>
          <div className="dialog dialog-small" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Generate License Report</h2>
              <button className="icon-btn" onClick={() => setReportDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>Report Type *</label>
                <select
                  value={reportOptions.reportType}
                  onChange={(e) => setReportOptions({...reportOptions, reportType: e.target.value})}
                >
                  <option value="All Licenses">All Licenses</option>
                  <option value="Expiring Licenses">Expiring Licenses</option>
                  <option value="Expired Licenses">Expired Licenses</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label-bold">Report Options</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={reportOptions.includeDescriptions}
                      onChange={(e) => setReportOptions({...reportOptions, includeDescriptions: e.target.checked})}
                    />
                    Include Descriptions
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={reportOptions.includeProofs}
                      onChange={(e) => setReportOptions({...reportOptions, includeProofs: e.target.checked})}
                    />
                    Include Proof Information
                  </label>
                </div>
              </div>
              <p className="info-text">{licenses.length} licenses will be included in the report</p>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-text" onClick={() => setReportDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleGenerateReport}>
                <FileUploadIcon />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {documentsDialogOpen && selectedLicenseForDocs && (
        <LicenseDocumentsDialog
          licenseId={selectedLicenseForDocs.id}
          licenseName={selectedLicenseForDocs.name}
          onClose={() => {
            setDocumentsDialogOpen(false);
            setSelectedLicenseForDocs(null);
          }}
        />
      )}
    </div>
  );
};

export default Licenses;