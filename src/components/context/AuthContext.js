// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const token = sessionStorage.getItem('access_token');
const id = sessionStorage.getItem('id');
const oauth = sessionStorage.getItem('oauth');

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (id && token) {
        try {
          const response = await axios.get(
            'https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/user/my-page/', 
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token} ${oauth}`,
              }
            }
          );
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAuthenticated(false);      
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('id');
          sessionStorage.removeItem('oauth');
          sessionStorage.removeItem('username');
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
