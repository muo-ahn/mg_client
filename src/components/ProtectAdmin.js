// src/components/ProtectAdmin.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectAdmin = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        await axios.get('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/admin/me', { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
          navigate('/');
        }
      }
    };
    checkAuth();
    return () => {
      isMounted = false; // Clean up on unmount
    };
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

export default ProtectAdmin;
