import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * ProtectedRoute Component
 * Schützt Routen vor unberechtigtem Zugriff
 * 
 * @param {ReactNode} children - Die zu schützende Komponente
 * @param {string|string[]} requiredRole - Erforderliche Rolle(n) (optional)
 * @param {string} redirectTo - Wohin soll umgeleitet werden (default: "/")
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  redirectTo = '/'
}) => {
  const isAuth = authService.isAuthenticated();
  const user = authService.getCurrentUser();
  
  // Wenn nicht eingeloggt → Login-Seite
  if (!isAuth) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Wenn Rolle erforderlich ist
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRequiredRole = allowedRoles.includes(user?.roleName);
    
    if (!hasRequiredRole) {
      console.log(`User role "${user?.roleName}" not authorized. Required: ${allowedRoles.join(' or ')}`);
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Alles OK → Zeige die Komponente
  return children;
};

export default ProtectedRoute;