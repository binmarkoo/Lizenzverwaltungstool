// src/pages/Dashboard.js
import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Receipt as LicenseIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Group as GroupIcon
} from '@mui/icons-material';

const Dashboard = () => {
  // Mock-Daten für die Statistik-Karten
  const stats = {
    totalLicenses: 145,
    expiringSoon: 12,
    expired: 5,
    activeLicenses: 128,
    totalUsers: 23
  };

  // Mock-Daten für ablaufende Lizenzen
  const expiringLicenses = [
    { name: 'Adobe Creative Cloud', daysLeft: 5, department: 'Marketing' },
    { name: 'Microsoft Office 365', daysLeft: 12, department: 'IT' },
    { name: 'AutoCAD 2024', daysLeft: 18, department: 'Engineering' },
    { name: 'SolidWorks Premium', daysLeft: 25, department: 'Engineering' },
  ];

  const StatCard = ({ title, value, icon, color = '#2c3e50' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ color, fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#2c3e50', mb: 4 }}>
        Dashboard
      </Typography>
      
      {/* Statistik Karten */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Gesamtlizenzen"
            value={stats.totalLicenses}
            icon={<LicenseIcon fontSize="large" />}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Läuft bald ab"
            value={stats.expiringSoon}
            icon={<WarningIcon fontSize="large" />}
            color="#FFA000"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Abgelaufen"
            value={stats.expired}
            icon={<ErrorIcon fontSize="large" />}
            color="#D32F2F"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aktive Benutzer"
            value={stats.totalUsers}
            icon={<GroupIcon fontSize="large" />}
            color="#388E3C"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Linke Spalte: Aktuelle Warnungen */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1, color: '#FFA000' }} />
              Lizenzen die bald ablaufen
            </Typography>
            <List>
              {expiringLicenses.map((license, index) => (
                <ListItem key={index} divider={index < expiringLicenses.length - 1}>
                  <ListItemIcon>
                    {license.daysLeft <= 7 ? (
                      <ErrorIcon sx={{ color: '#D32F2F' }} />
                    ) : (
                      <WarningIcon sx={{ color: '#FFA000' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={license.name}
                    secondary={`Noch ${license.daysLeft} Tage - ${license.department}`}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: license.daysLeft <= 7 ? '#D32F2F' : '#FFA000',
                      fontWeight: 'bold'
                    }}
                  >
                    {license.daysLeft <= 7 ? 'Dringend!' : 'Bald erneuern'}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Rechte Spalte: Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50' }}>
              Schnellzugriff
            </Typography>
            <List>
              <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                <ListItemIcon>
                  <LicenseIcon sx={{ color: '#FFD700' }} />
                </ListItemIcon>
                <ListItemText primary="Neue Lizenz hinzufügen" />
              </ListItem>
              <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                <ListItemIcon>
                  <GroupIcon sx={{ color: '#FFD700' }} />
                </ListItemIcon>
                <ListItemText primary="Benutzer verwalten" />
              </ListItem>
              <ListItem button sx={{ borderRadius: 1 }}>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#FFD700' }} />
                </ListItemIcon>
                <ListItemText primary="Lizenzbericht erstellen" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;