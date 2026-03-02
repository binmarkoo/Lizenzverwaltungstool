import React, { useState, useEffect } from 'react';
import documentService from '../services/documentService';
import authService from '../services/authService';
import '../stylesheets/LicenseDocumentsDialog.css';

// Icons
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const LicenseDocumentsDialog = ({ licenseId, licenseName, onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const userRole = authService.getCurrentUser()?.roleName;

  const canEdit = userRole === 'Admin' || userRole === 'Editor';

  useEffect(() => {
    loadDocuments();
  }, [licenseId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocumentsByLicenseId(licenseId);
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validierung
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      alert('File too large (max 5 MB)');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, PNG allowed');
      return;
    }

    try {
      setUploading(true);
      const newDoc = await documentService.uploadDocument(licenseId, file);
      setDocuments(prev => [newDoc, ...prev]);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await documentService.downloadDocument(licenseId, doc.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed');
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const success = await documentService.deleteDocument(licenseId, docId);
      if (success) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog dialog-medium" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Documents for "{licenseName}"</h2>
          <button className="icon-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="dialog-content">
          {canEdit && (
            <div className="upload-area">
              <label className={`upload-btn ${uploading ? 'disabled' : ''}`}>
                <UploadIcon />
                {uploading ? 'Uploading...' : 'Upload Document'}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  hidden
                />
              </label>
              <span className="file-hint">PDF, JPG, PNG (max. 5 MB)</span>
            </div>
          )}

          {loading && <p className="loading-text">Loading documents...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && (
            <div className="documents-list">
              {documents.length === 0 ? (
                <p className="empty-text">No documents uploaded yet.</p>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-info">
                      <span className="document-name">{doc.fileName}</span>
                      <span className="document-meta">
                        {formatFileSize(doc.fileSize)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="document-actions">
                      <button className="icon-btn" onClick={() => handleDownload(doc)} title="Download">
                        <DownloadIcon />
                      </button>
                      {canEdit && (
                        <button className="icon-btn icon-btn-error" onClick={() => handleDelete(doc.id)} title="Delete">
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseDocumentsDialog;