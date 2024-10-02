import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  });


  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('token', auth.token);
      localStorage.setItem('role', auth.role);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }, [auth]);


  const login = async (username, password) => {
    const response = await axios.post('/api/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    setAuth({ token: response.data.token,  user: response.data.user, });
    console.log('Logged in user role:', auth.user.role);

  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuth({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
