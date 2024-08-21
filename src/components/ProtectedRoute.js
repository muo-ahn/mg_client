// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        await axios.get('http://127.0.0.1:8000/auth/users/me', { withCredentials: true });
        if (isMounted) {
          setIsAuthenticated(true);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
          setLoading(false);
          navigate('/login');
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate, setIsAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
