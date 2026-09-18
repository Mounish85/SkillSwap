import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch full user profile using userId
  const fetchUserProfile = async (userId, baseUser = {}) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      const profile = response.data?.profile || response.data?.user || {};
      return {
        ...baseUser,
        ...profile,
      };
    } catch (err) {
      // If profile endpoint fails, return at least the base user info
      return baseUser;
    }
  };

  // Re-check authentication state and refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      const authUser = response.data?.user;
      
      if (authUser && authUser.userId) {
        const fullProfile = await fetchUserProfile(authUser.userId, authUser);
        setUser(fullProfile);
        return fullProfile;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      setUser(null);
      return null;
    }
  }, []);

  // Check authentication on initial application startup
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        const authUser = response.data?.user;

        if (authUser && authUser.userId) {
          const fullProfile = await fetchUserProfile(authUser.userId, authUser);
          if (isMounted) {
            setUser(fullProfile);
          }
        } else {
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const loginUser = response.data?.user;

    if (loginUser && loginUser.userId) {
      // Attempt to load full profile for richest user data
      const fullProfile = await fetchUserProfile(loginUser.userId, loginUser);
      setUser(fullProfile);
      return fullProfile;
    } else {
      // Fallback to refreshUser
      return await refreshUser();
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

