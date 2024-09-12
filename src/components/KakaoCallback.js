// src/components/KakaoCallback.js

import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';

const cookies = new Cookies
const KakaoCallback = () => {
  const { setIsAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const oauth = decodeURIComponent(queryParams.get('oauth'));
        const id = decodeURIComponent(queryParams.get('id'));
        const username = decodeURIComponent(queryParams.get('username'));
        const refresh_token = decodeURIComponent(queryParams.get('refresh_token'));
      
        if (token) {
          sessionStorage.setItem('access_token', token);
          sessionStorage.setItem('oauth', oauth);
          sessionStorage.setItem('id', id);
          sessionStorage.setItem('username', username);
          cookies.set('rf', refresh_token)
          setIsAuthenticated(true);
          navigate('/');
        } else {
          console.error('No token received');
          setIsAuthenticated(false);
          navigate('/');
        }
      }, [location, navigate, setIsAuthenticated]);

    return <div>Loading...</div>;
};

export default KakaoCallback;