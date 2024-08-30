// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';

const AuthContext = createContext();
const cookies = new Cookies();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const id = cookies.get('id');
      const accessToken = cookies.get('access_token');
      if (id && accessToken) {
        try {
          const response = await axios.get(
            'https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/user/my-page/', 
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            }
          );
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAuthenticated(false);
          cookies.remove('access_token', { domain: 'medakaauction.com' });
          cookies.remove('id', { domain: 'medakaauction.com' });
          cookies.remove('username', { domain: 'medakaauction.com' });
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
