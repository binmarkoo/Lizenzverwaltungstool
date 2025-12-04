// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/Dashboard.css';

// Icons als SVG-Komponenten
const LicenseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/>
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const GroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const StatCard = ({ title, value, icon, colorClass = '' }) => (
  <div className="stat-card">
    <div className="stat-card-content">
      <div className="stat-card-text">
        <h6 className="stat-card-title">{title}</h6>
        <div className={`stat-card-value ${colorClass}`}>{value}</div>
      </div>
      <div className={`stat-card-icon ${colorClass}`}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock-Daten für die Statistik-Karten
  const stats = {
    totalLicenses: 145,
    expiringSoon: 12,
    expired: 5,
    activeLicenses: 128,
    totalUsers: 23
  };

  // Mock-Daten für ablaufende Lizenzen
  const expiringLicenses = [
    { name: 'Adobe Creative Cloud', daysLeft: 5, department: 'Marketing' },
    { name: 'Microsoft Office 365', daysLeft: 12, department: 'IT' },
    { name: 'AutoCAD 2024', daysLeft: 18, department: 'Engineering' },
    { name: 'SolidWorks Premium', daysLeft: 25, department: 'Engineering' },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      {/* Statistik Karten */}
      <div className="stats-grid">
        <StatCard
          title="Gesamtlizenzen"
          value={stats.totalLicenses}
          icon={<LicenseIcon />}
        />
        <StatCard
          title="Läuft bald ab"
          value={stats.expiringSoon}
          icon={<WarningIcon />}
          colorClass="warning"
        />
        <StatCard
          title="Abgelaufen"
          value={stats.expired}
          icon={<ErrorIcon />}
          colorClass="error"
        />
        <StatCard
          title="Aktive Benutzer"
          value={stats.totalUsers}
          icon={<GroupIcon />}
          colorClass="success"
        />
      </div>

      <div className="content-grid">
        {/* Linke Spalte: Aktuelle Warnungen */}
        <div className="paper expiring-licenses">
          <h2 className="section-title">
            <span className="icon warning"><WarningIcon /></span>
            Lizenzen die bald ablaufen
          </h2>
          <ul className="license-list">
            {expiringLicenses.map((license, index) => (
              <li 
                key={index} 
                className={`license-item ${index < expiringLicenses.length - 1 ? 'divider' : ''}`}
              >
                <span className={`icon ${license.daysLeft <= 7 ? 'error' : 'warning'}`}>
                  {license.daysLeft <= 7 ? <ErrorIcon /> : <WarningIcon />}
                </span>
                <div className="license-info">
                  <span className="license-name">{license.name}</span>
                  <span className="license-details">
                    Noch {license.daysLeft} Tage - {license.department}
                  </span>
                </div>
                <span className={`license-status ${license.daysLeft <= 7 ? 'error' : 'warning'}`}>
                  {license.daysLeft <= 7 ? 'Dringend!' : 'Bald erneuern'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rechte Spalte: Quick Actions */}
        <div className="paper quick-actions">
          <h2 className="section-title">Schnellzugriff</h2>
          <ul className="action-list">
            <li className="action-item" onClick={() => navigate('/licenses?action=new')}>
              <span className="icon gold"><LicenseIcon /></span>
              <span>Neue Lizenz hinzufügen</span>
            </li>
            <li className="action-item" onClick={() => navigate('/users')}>
              <span className="icon gold"><GroupIcon /></span>
              <span>Benutzer verwalten</span>
            </li>
            <li className="action-item" onClick={() => navigate('/licenses')}>
              <span className="icon gold"><CheckCircleIcon /></span>
              <span>Lizenzbericht erstellen</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;