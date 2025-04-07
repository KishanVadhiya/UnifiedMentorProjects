import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create axios instance with direct backend URL
  const api = axios.create({
    baseURL: 'http://localhost:4000/api/v1',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const verifyAuth = async (token) => {
    if (!token) {
      setLoading(false);
      return false;
    }

    try {
      const { data } = await api.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Token verification failed:', err);
      localStorage.removeItem('token');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Make registration request
      const response = await api.post('/auth/register', userData);
      
      // If registration is successful but doesn't automatically login
      // you might want to redirect to login page or automatically login
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Make login request
      const { data } = await api.post('/auth/login', credentials);
      
      // 2. Check if token exists in response
      if (!data.user) {
        throw new Error('No token received in response');
      }
      
      // 3. Store the token in localStorage
      localStorage.setItem('token', data.user);
      console.log('Token stored successfully:', data.user);
      
      // 4. Immediately verify with the new token
      const verified = await verifyAuth(data.user);
      if (!verified) {
        throw new Error('Token verification failed');
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('token');
      setError(error.response?.data?.message || error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Initial verification on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      await verifyAuth(token);
      setLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      error,
      register,
      login, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);