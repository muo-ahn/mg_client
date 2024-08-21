// src/components/KakaoCallback.js

import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';

const KakaoCallback = () => {
  const { setIsAuthenticated } = useAuth();
    const [cookies, setCookie] = useCookies([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const oauth = decodeURIComponent(queryParams.get('oauth'));
        const id = decodeURIComponent(queryParams.get('id'));
        const username = decodeURIComponent(queryParams.get('username'));
      
        if (token) {
          setCookie('access_token', token, { path: '/', maxAge:  30 * 60, sameSite: 'lax', secure: true});
          setCookie('oauth', oauth, { path: '/', maxAge:  30 * 60 });
          setCookie('id', id, { path: '/', maxAge:  30 * 60 });
          setCookie('username', username, { path: '/', maxAge:  30 * 60 });
          setIsAuthenticated(true);
          navigate('/');
        } else {
          console.error('No token received');
          setIsAuthenticated(false);
          navigate('/');
        }
      }, [location, navigate, cookies, setCookie]);

    return <div>Loading...</div>;
};

export default KakaoCallback;