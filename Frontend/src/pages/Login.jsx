// src/pages/Login.js
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  InputAdornment,
  IconButton,
  Fade
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', credentials);
    alert(`Login für: ${credentials.username}`);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Fade in={true} timeout={800}>
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Neutraler Header Bereich */}
            <Paper 
              elevation={0}
              sx={{
                p: 4,
                mb: 2,
                background: 'white',
                borderRadius: 3,
                width: '100%',
                textAlign: 'center',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Box position="relative" zIndex={1}>
                <AdminIcon 
                  sx={{ 
                    fontSize: 48, 
                    color: '#2c3e50',
                    mb: 2 
                  }} 
                />
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    color: '#2c3e50',
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  }}
                >
                  LIEBHERR
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#6c757d',
                    fontWeight: 400,
                  }}
                >
                  Lizenzverwaltungssystem
                </Typography>
              </Box>
            </Paper>

            {/* Login Formular */}
            <Paper 
              elevation={2}
              sx={{
                padding: 4,
                width: '100%',
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'transparent',
                    width: 60,
                    height: 60,
                    mb: 2,
                    border: '3px solid #FFD700',
                    color: '#2c3e50'
                  }}
                >
                  <LockIcon fontSize="large" />
                </Avatar>
                <Typography component="h2" variant="h5" fontWeight="600" color="#2c3e50">
                  Anmeldung
                </Typography>
                <Typography variant="body2" color="#6c757d" sx={{ mt: 1 }}>
                  Bitte melden Sie sich mit Ihren Zugangsdaten an
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Benutzername"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#6c757d' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#FFD700',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FFD700',
                        borderWidth: '2px'
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#FFD700',
                    }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Passwort"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#6c757d' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Passwort anzeigen"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: '#6c757d' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#FFD700',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FFD700',
                        borderWidth: '2px'
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#FFD700',
                    }
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 1,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    background: '#2c3e50',
                    color: 'white',
                    '&:hover': {
                      background: '#1a2530',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 16px rgba(255, 215, 0, 0.2)',
                    },
                    '&:focus': {
                      outline: '2px solid #FFD700',
                      outlineOffset: '2px'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Anmelden
                </Button>
              </Box>

              {/* Footer */}
              <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid #e9ecef' }}>
                <Typography variant="caption" color="#6c757d">
                  © 2024 Liebherr - HTL Saalfelden Diplomarbeit
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Fade>
    </Box>
  );
};

export default Login;