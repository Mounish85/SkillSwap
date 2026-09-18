import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Route Guards
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

// User Pages (Protected)
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Skills from '../pages/Skills';
import MySkills from '../pages/MySkills';
import Matches from '../pages/Matches';
import Swaps from '../pages/Swaps';
import Sessions from '../pages/Sessions';
import Ratings from '../pages/Ratings';
import Files from '../pages/Files';

// Admin Pages (Admin-only Protected)
import AdminDashboard from '../pages/AdminDashboard';
import AdminSkills from '../pages/AdminSkills';

// Fallback
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <Skills />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-skills"
        element={
          <ProtectedRoute>
            <MySkills />
          </ProtectedRoute>
        }
      />
      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <Matches />
          </ProtectedRoute>
        }
      />
      <Route
        path="/swaps"
        element={
          <ProtectedRoute>
            <Swaps />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ratings"
        element={
          <ProtectedRoute>
            <Ratings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <Files />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <AdminRoute>
            <AdminSkills />
          </AdminRoute>
        }
      />

      {/* 404 Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

