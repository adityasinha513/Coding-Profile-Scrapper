import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && storedToken !== 'demo-guest-token') {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const loginAsGuestDemo = () => {
    const demoGuest = {
      id: 0,
      name: 'Guest Reviewer',
      email: 'demo@portfolio.com',
      is_guest: true,
      leetcode_handle: 'tourist',
      github_handle: 'torvalds',
      codeforces_handle: 'tourist',
      codechef_handle: 'chandravo',
      gfg_handle: 'geeksforgeeks',
    };
    setUser(demoGuest);
    setToken('demo-guest-token');
    localStorage.setItem('user', JSON.stringify(demoGuest));
    localStorage.setItem('token', 'demo-guest-token');
    return demoGuest;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, loginAsGuestDemo, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
