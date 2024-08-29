// src/components/shared/Header.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo_header from "../../images/logo_header.png";
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import SearchBar from './SearchBar';
import '../../styles/header.css';
import { BASE_URL } from '../../config';

export function Header({ onSearch }) {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios.get(`https://3ac4dojx07.execute-api.ap-northeast-2.amazonaws.com/v1/api/time`);
        setCurrentTime(new Date(response.data.current_time));
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    fetchTime();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prevTime => new Date(prevTime.getTime() + 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('https://3ac4dojx07.execute-api.ap-northeast-2.amazonaws.com/v1/user/my-page', { withCredentials: true });
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await axios.post('https://3ac4dojx07.execute-api.ap-northeast-2.amazonaws.com/v1/auth/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <header className="header-container">
      <div className="container mx-auto">
        <div className="top-header flex items-center justify-between py-2 border-b">
          <Link to="/" className="hover:underline flex items-center">
            <img src={logo_header} alt="Logo" className="logo h-8" />
          </Link>
          <SearchBar onSearch={onSearch} />
          <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic" className="user-dropdown">
              {isAuthenticated && user ? (
                <>
                  {user.icon ? <img src={user.icon} className='user-icon' alt="User Icon" /> : <></>}
                  {user.nickname}님
                  <span className="dropdown-triangle"></span>
                </>
              ) : "ID"}
            </Dropdown.Toggle>


            <Dropdown.Menu align="end">
              {isAuthenticated ? (
                <>
                  <Dropdown.Item as={Link} to="/mypage">MyPage</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/register">Register</Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="bottom-header flex items-center justify-between mt-2 border-b">
          <div className="timezone">
            <span className="text-gray-500">{formatTime(currentTime)}</span>
          </div>
          <nav className="bottom-nav flex gap-4 text-sm">
            <Link to="/" className="hover:underline">메다카경매</Link>
            <Link to="https://blog.naver.com/blog109" className="hover:underline">갤러리</Link>
            <Link to="https://open.kakao.com/o/goWSy6se" className="hover:underline">카카오채널</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
