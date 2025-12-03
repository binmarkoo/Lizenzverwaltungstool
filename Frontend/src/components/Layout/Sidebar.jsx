// src/components/Layout/Sidebar.js - Icons KORRIGIEREN
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Toolbar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as LicenseIcon,
  People as PeopleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Lizenzen', icon: <LicenseIcon />, path: '/licenses' },
    { text: 'Benutzer', icon: <PeopleIcon />, path: '/users' },
    { text: 'Einstellungen', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: 240, 
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0'
        },
      }}
    >
      <Toolbar />
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#FFF9C4',
                  borderRight: '3px solid #FFD700',
                  '&:hover': {
                    backgroundColor: '#FFF9C4',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#FFD700' : '#666' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiListItemText-primary': {
                    color: location.pathname === item.path ? '#2c3e50' : '#666',
                    fontWeight: location.pathname === item.path ? '600' : '400'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;