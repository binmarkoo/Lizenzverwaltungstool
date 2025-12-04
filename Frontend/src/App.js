// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Licenses from './pages/Licenses';
import Users from './pages/Users';
import Settings from './pages/Settings';

// Globale Styles importieren
import './App.css';

function App() {
  // Temporär: Immer eingeloggt für Entwicklung
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Geschützte Routen mit Layout */}
        {isAuthenticated ? (
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}
        
        <Route path="/licenses" element={<Layout><Licenses /></Layout>} />
        <Route path="/users" element={<Layout><Users /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;