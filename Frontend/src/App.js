// src/App.js
import React, { useState } from 'react';
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
  // Prüfe ob Benutzer eingeloggt ist (aus localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).isAuthenticated : false;
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Wenn nicht eingeloggt, zeige nur Login
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // Wenn eingeloggt, zeige alle Seiten
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout onLogout={handleLogout}><Dashboard /></Layout>} />
        <Route path="/licenses" element={<Layout onLogout={handleLogout}><Licenses /></Layout>} />
        <Route path="/users" element={<Layout onLogout={handleLogout}><Users /></Layout>} />
        <Route path="/settings" element={<Layout onLogout={handleLogout}><Settings /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;