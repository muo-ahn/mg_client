// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/context/AuthContext';

const token = localStorage.getItem('access_token');
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        await axios.get('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/users/me', {
           withCredentials: true,
           headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
          }
        );
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
