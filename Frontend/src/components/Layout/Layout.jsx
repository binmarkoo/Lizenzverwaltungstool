// src/components/Layout/Layout.jsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import '../../stylesheets/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;