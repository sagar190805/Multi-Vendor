import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.sub, role: decoded.roles || decoded.role });
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    const userData = { email: decoded.sub, role: decoded.roles || decoded.role };
    setUser(userData);
    return userData;
  };

  const register = async (email, password, phone, role) => {
    const res = await api.post('/auth/register', { email, password, phone, role });
    const token = res.data.token;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    const userData = { email: decoded.sub, role: decoded.roles || decoded.role };
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
