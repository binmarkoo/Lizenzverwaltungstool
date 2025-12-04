// src/components/Layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../stylesheets/Header.css';

// Icons als SVG-Komponenten
const NotificationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
);

const AccountCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
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

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Hole Benutzerdaten aus localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const username = userData.username || 'Benutzer';

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Lizenz läuft bald ab',
      message: 'Adobe Creative Cloud läuft in 5 Tagen ab',
      time: 'vor 2 Stunden'
    },
    {
      id: 2,
      type: 'error',
      title: 'Lizenz abgelaufen',
      message: 'Slack Enterprise ist gestern abgelaufen',
      time: 'vor 1 Tag'
    },
    {
      id: 3,
      type: 'success',
      title: 'Lizenz erfolgreich hinzugefügt',
      message: 'Figma Professional wurde zur Datenbank hinzugefügt',
      time: 'vor 2 Tagen'
    },
    {
      id: 4,
      type: 'info',
      title: 'System-Update verfügbar',
      message: 'Eine neue Version der Lizenzverwaltung ist verfügbar',
      time: 'vor 3 Tagen'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Mehrere Lizenzen ablaufend',
      message: '12 Lizenzen laufen in den nächsten 30 Tagen ab',
      time: 'vor 1 Woche'
    }
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setNotificationDialogOpen(true);
  };

  const handleUserMenuClick = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    
    // Lösche Benutzerdaten aus localStorage
    localStorage.removeItem('user');
    
    // Callback aufrufen falls vorhanden
    if (onLogout) {
      onLogout();
    }
    
    // Zur Login-Seite navigieren
    navigate('/login');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <span className="notification-icon warning"><WarningIcon /></span>;
      case 'error':
        return <span className="notification-icon error"><ErrorIcon /></span>;
      case 'success':
        return <span className="notification-icon success"><CheckCircleIcon /></span>;
      case 'info':
        return <span className="notification-icon info"><InfoIcon /></span>;
      default:
        return <span className="notification-icon"><InfoIcon /></span>;
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="header-toolbar">
          <h1 className="header-title">LIEBHERR - Lizenzverwaltung</h1>
          
          <div className="header-actions">
            <button 
              className="icon-button"
              onClick={handleNotificationClick}
              aria-label="Benachrichtigungen"
            >
              <NotificationsIcon />
              <span className="badge">5</span>
            </button>
            
            <div className="user-menu-container" ref={userMenuRef}>
              <button 
                className="icon-button"
                onClick={handleUserMenuClick}
                aria-label="Benutzerprofil"
              >
                <AccountCircleIcon />
              </button>
              
              {/* Benutzer Dropdown Menü */}
              {userMenuOpen && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <span className="user-name">{username}</span>
                    <span className="user-email">{username.toLowerCase().replace(' ', '.')}@liebherr.com</span>
                  </div>
                  <div className="user-menu-divider"></div>
                  <button className="user-menu-item" onClick={handleLogout}>
                    <LogoutIcon />
                    <span>Abmelden</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Benachrichtigungen Dialog */}
      {notificationDialogOpen && (
        <div className="dialog-overlay" onClick={() => setNotificationDialogOpen(false)}>
          <div className="dialog notification-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="dialog-title-group">
                <NotificationsIcon />
                <h2>Benachrichtigungen</h2>
                <span className="chip chip-warning">5</span>
              </div>
              <button className="icon-btn" onClick={() => setNotificationDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="notification-list">
              {notifications.map((notification, index) => (
                <div 
                  key={notification.id}
                  className={`notification-item ${notification.type} ${index < notifications.length - 1 ? 'divider' : ''}`}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="notification-content">
                    <span className="notification-title">{notification.title}</span>
                    <span className="notification-message">{notification.message}</span>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;