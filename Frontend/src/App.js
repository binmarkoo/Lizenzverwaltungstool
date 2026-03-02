import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Licenses from './pages/Licenses';
import Users from './pages/Users';
import Settings from './pages/Settings';
import authService from './services/authService';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { FilterProvider } from './context/FilterContext'; // NEU

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authService.isAuthenticated();
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return authService.getCurrentUser();
  });

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      
      setIsAuthenticated(isAuth);
      setCurrentUser(user);
      
      if (isAuth) {
        console.log('✅ User is authenticated:', user);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (user) => {
    console.log('🔐 User logged in:', user);
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    console.log('🚪 User logged out');
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

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

  return (
    <Router>
      <FilterProvider> {/* NEU */}
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Layout onLogout={handleLogout} currentUser={currentUser}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/licenses" element={
            <ProtectedRoute>
              <Layout onLogout={handleLogout} currentUser={currentUser}>
                <Licenses />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute requiredRole={['Admin', 'Editor']}>
              <Layout onLogout={handleLogout} currentUser={currentUser}>
                <Users />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute requiredRole="Admin">
              <Layout onLogout={handleLogout} currentUser={currentUser}>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </FilterProvider>
    </Router>
  );
}

export default App;