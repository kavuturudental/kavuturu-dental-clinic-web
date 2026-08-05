import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../../services/authService";

const ProtectedRoute = ({ children, role }) => {
  const isAuthenticated = authService.isAuthenticated();
  const hasRequiredRole = role ? authService.hasRole(role) : isAuthenticated;

  if (!isAuthenticated || !hasRequiredRole) {
    authService.logout();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
