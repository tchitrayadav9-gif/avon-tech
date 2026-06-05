import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure Axios default headers
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Load user session
  const loadUser = async () => {
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${API_URL}/auth/me`);
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      } else {
        logoutUser();
      }
    } catch (err) {
      console.error('Error loading session:', err.message);
      logoutUser();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  // Login User
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errorMsg };
    }
  };

  // Register User
  const registerUser = async (name, email, password, role) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed.';
      return { success: false, error: errorMsg };
    }
  };

  // Logout User
  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        reloadSession: loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
