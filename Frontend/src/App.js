import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Licenses from './pages/Licenses';
import Users from './pages/Users';
import Settings from './pages/Settings';
import authService from './services/authService';

import './App.css';

function App() {
  //Check if user is authenticated on app load
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authService.isAuthenticated();
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return authService.getCurrentUser();
  });

  // On reload, check if user is authenticated and get user info
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

  // If not authenticated → only show login page
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

  // If authenticated → show app
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout onLogout={handleLogout} currentUser={currentUser}>
            <Dashboard />
          </Layout>
        } />
        <Route path="/licenses" element={
          <Layout onLogout={handleLogout} currentUser={currentUser}>
            <Licenses />
          </Layout>
        } />
        <Route path="/users" element={
          <Layout onLogout={handleLogout} currentUser={currentUser}>
            <Users />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout onLogout={handleLogout} currentUser={currentUser}>
            <Settings />
          </Layout>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;