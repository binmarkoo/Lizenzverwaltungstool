// src/components/Layout/Header.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import {
  AccountCircle,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const Header = () => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#2c3e50'
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          LIEBHERR - Lizenzverwaltung
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;