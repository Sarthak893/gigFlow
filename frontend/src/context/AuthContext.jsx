
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);


  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.ok) {
      const data = await res.json();
      setUser({ id: data.userId, name: data.name });
      return { success: true };
    }
    const error = await res.json();
    return { success: false, message: error.message };
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    if (res.ok) {
      const data = await res.json();
      setUser({ id: data.userId, name: data.name });
      return { success: true };
    }
    const error = await res.json();
    return { success: false, message: error.message };
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};