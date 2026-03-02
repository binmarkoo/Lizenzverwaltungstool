import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import licenseService from '../services/licenseService';
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

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

// StatCard Component
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
  const [stats, setStats] = useState({ totalLicenses: 0, expiringSoon: 0, expired: 0 });
  const [expiringLicenses, setExpiringLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const licenses = await licenseService.getAllLicenses();

        // Calculate statistics
        const total = licenses.length;
        const expiringSoonCount = licenses.filter(l => l.status === 'Expiring soon').length;
        const expiredCount = licenses.filter(l => l.status === 'Expired').length;
        setStats({ totalLicenses: total, expiringSoon: expiringSoonCount, expired: expiredCount });

        // Get up to 4 expiring licenses, sorted by expiration date
        const expiring = licenses
          .filter(l => l.status === 'Expiring soon')
          .sort((a, b) => {
            const parseDate = (dateStr) => {
              const [d, m, y] = dateStr.split('.').map(Number);
              return new Date(y, m - 1, d);
            };
            return parseDate(a.expirationDate) - parseDate(b.expirationDate);
          })
          .slice(0, 4);
        setExpiringLicenses(expiring);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getDaysUntil = (expirationDate) => {
    const [d, m, y] = expirationDate.split('.').map(Number);
    const expDate = new Date(y, m - 1, d);
    const today = new Date();
    const diffTime = expDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="paper" style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
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
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Licenses"
          value={stats.totalLicenses}
          icon={<LicenseIcon />}
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          icon={<WarningIcon />}
          colorClass="warning"
        />
        <StatCard
          title="Expired"
          value={stats.expired}
          icon={<ErrorIcon />}
          colorClass="error"
        />
        {/* Removed "Active Users" card */}
      </div>

      {/* Expiring Licenses List */}
      <div className="paper expiring-licenses">
        <h2 className="section-title">
          <span className="icon warning"><WarningIcon /></span>
          Licenses Expiring Soon
        </h2>
        <ul className="license-list">
          {expiringLicenses.length > 0 ? (
            expiringLicenses.map((license, index) => {
              const daysLeft = getDaysUntil(license.expirationDate);
              return (
                <li 
                  key={index} 
                  className={`license-item ${index < expiringLicenses.length - 1 ? 'divider' : ''}`}
                >
                  <span className={`icon ${daysLeft <= 7 ? 'error' : 'warning'}`}>
                    {daysLeft <= 7 ? <ErrorIcon /> : <WarningIcon />}
                  </span>
                  <div className="license-info">
                    <span className="license-name">{license.name}</span>
                    <span className="license-details">
                      {daysLeft} days left - {license.department}
                    </span>
                  </div>
                  <span className={`license-status ${daysLeft <= 7 ? 'error' : 'warning'}`}>
                    {daysLeft <= 7 ? 'Urgent!' : 'Renew soon'}
                  </span>
                </li>
              );
            })
          ) : (
            <li className="license-item">
              <span className="license-name">No licenses expiring soon</span>
            </li>
          )}
        </ul>
      </div>

      {/* Removed "Quick Actions" section */}
    </div>
  );
};

export default Dashboard;