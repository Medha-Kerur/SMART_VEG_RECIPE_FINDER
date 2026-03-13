import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        try {
          const res = await axios.get('http://localhost:5005/api/auth/me', {
            headers: { Authorization: `Bearer ${parsed.token}` },
          });
          setUser({ ...res.data, token: parsed.token });
        } catch {
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5005/api/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message || 'Login failed' }; }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5005/api/auth/register', { name, email, password });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (e) { return { success: false, message: e.response?.data?.message || 'Registration failed' }; }
  };

  const logout = () => { localStorage.removeItem('user'); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
