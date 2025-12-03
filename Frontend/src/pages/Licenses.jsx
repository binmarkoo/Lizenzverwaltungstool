// src/pages/Licenses.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const Licenses = () => {
  // Mock-Daten für Lizenzen
  const [licenses, setLicenses] = useState([
    {
      id: 1,
      name: 'Adobe Creative Cloud',
      licenseId: 'ADB-CC-2024-001',
      purchasedCount: 50,
      department: 'Marketing',
      purchaseDate: '2024-01-15',
      expiryDate: '2025-01-15',
      renewalType: 'Jährlich',
      status: 'active',
      description: 'Creative Suite für Design Team'
    },
    {
      id: 2,
      name: 'Microsoft Office 365',
      licenseId: 'MS-O365-2024-002',
      purchasedCount: 200,
      department: 'IT',
      purchaseDate: '2024-02-01',
      expiryDate: '2024-08-01',
      renewalType: 'Manuell',
      status: 'expiring',
      description: 'Office Suite für alle Mitarbeiter'
    },
    {
      id: 3,
      name: 'AutoCAD 2024',
      licenseId: 'AUTOCAD-2024-003',
      purchasedCount: 25,
      department: 'Engineering',
      purchaseDate: '2023-12-10',
      expiryDate: '2023-12-10',
      renewalType: 'Jährlich',
      status: 'expired',
      description: 'CAD Software für Engineering'
    },
    {
      id: 4,
      name: 'SolidWorks Premium',
      licenseId: 'SW-PREM-2024-004',
      purchasedCount: 30,
      department: 'Engineering',
      purchaseDate: '2024-03-01',
      expiryDate: '2025-03-01',
      renewalType: 'Automatisch',
      status: 'active',
      description: '3D CAD Software'
    }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const departments = ['Alle', 'IT', 'Marketing', 'Engineering', 'HR', 'Finance'];

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { color: 'success', label: 'Aktiv' },
      expiring: { color: 'warning', label: 'Läuft ab' },
      expired: { color: 'error', label: 'Abgelaufen' }
    };
    
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.licenseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || filterDepartment === 'Alle' || 
                             license.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* Header mit Suchfunktion */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#2c3e50' }}>
          Lizenzverwaltung
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#2c3e50' }}>
          Neue Lizenz
        </Button>
      </Box>

      {/* Such- und Filter-Optionen */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Lizenzen suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Abteilung filtern"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              {departments.map(dept => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="textSecondary">
              {filteredLicenses.length} Lizenzen
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Lizenzen Tabelle */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lizenzname</TableCell>
                <TableCell>Lizenz ID</TableCell>
                <TableCell>Anzahl</TableCell>
                <TableCell>Abteilung</TableCell>
                <TableCell>Ablaufdatum</TableCell>
                <TableCell>Verlängerung</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLicenses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((license) => (
                <TableRow key={license.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {license.status === 'expiring' && (
                        <WarningIcon sx={{ color: '#FFA000', mr: 1 }} />
                      )}
                      <Typography fontWeight="500">
                        {license.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {license.description}
                    </Typography>
                  </TableCell>
                  <TableCell>{license.licenseId}</TableCell>
                  <TableCell>{license.purchasedCount}</TableCell>
                  <TableCell>
                    <Chip 
                      label={license.department} 
                      variant="outlined" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(license.expiryDate).toLocaleDateString('de-DE')}
                    </Typography>
                  </TableCell>
                  <TableCell>{license.renewalType}</TableCell>
                  <TableCell>{getStatusChip(license.status)}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLicenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Zeilen pro Seite:"
        />
      </Paper>

      {/* Statistik Karten */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Aktive Lizenzen
              </Typography>
              <Typography variant="h4" color="success.main">
                {licenses.filter(l => l.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Läuft bald ab
              </Typography>
              <Typography variant="h4" color="warning.main">
                {licenses.filter(l => l.status === 'expiring').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Abgelaufen
              </Typography>
              <Typography variant="h4" color="error.main">
                {licenses.filter(l => l.status === 'expired').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Gesamt Lizenzen
              </Typography>
              <Typography variant="h4" color="primary.main">
                {licenses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Licenses;