import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen message="Verifying permissions..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;

