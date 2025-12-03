import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px', // Höhe des Headers
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#f5f5f5'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;