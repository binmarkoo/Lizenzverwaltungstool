// src/App.js - AKTUALISIEREN
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Licenses from './pages/Licenses';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#FFD700', // Liebherr Gelb als Akzentfarbe
    },
  },
});

// Temporäre Komponenten für nicht-implementierte Seiten
const TemporaryPage = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <h2>{title}</h2>
    <p>Diese Seite wird noch implementiert.</p>
  </div>
);

function App() {
  // Temporär: Immer eingeloggt für Entwicklung
  const isAuthenticated = true;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Geschützte Routen mit Layout */}
          {isAuthenticated ? (
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}
          
          <Route path="/licenses" element={<Layout><TemporaryPage title="Lizenzen" /></Layout>} />
          <Route path="/users" element={<Layout><TemporaryPage title="Benutzer" /></Layout>} />
          <Route path="/settings" element={<Layout><TemporaryPage title="Einstellungen" /></Layout>} />
          <Route path="/licenses" element={<Layout><Licenses /></Layout>} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;