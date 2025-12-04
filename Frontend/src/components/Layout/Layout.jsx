// src/components/Layout/Layout.jsx
import React from 'react';
import '../../stylesheets/Layout.css';

// Importiere Header und Sidebar
// WICHTIG: Stelle sicher, dass diese Dateien NICHT Layout importieren!
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children, onLogout }) {
  return (
    <div className="app-layout">
      <Header onLogout={onLogout} />
      <Sidebar />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}

export default Layout;