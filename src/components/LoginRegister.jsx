// src/components/LoginRegister.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from './context/AuthContext';
import Modal from './Modal';
import ForgotPassword from './ForgotPassword';
import '../styles/loginRegister.css'

const LoginRegisterPage = () => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', phone_number: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({ ...registerForm, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/login',
        new URLSearchParams({
          username: loginForm.username,
          password: loginForm.password,
        }),
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      if (response.data.access_token) {
        sessionStorage.setItem('access_token', response.data.access_token);
        sessionStorage.setItem('oauth', 'local');
        sessionStorage.setItem('id', response.data.id);
        sessionStorage.setItem('username', response.data.username);
        setIsAuthenticated(true);
        navigate('/');
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const requestVerificationCode = async () => {
    try {
      const response = await axios.post('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/request-verification-code/', {
        phone_number: registerForm.phone_number,
      });
      alert(response.data.message);
      setCodeSent(true);
    } catch (error) {
      console.error('Failed to request verification code:', error);
      alert('Failed to request verification code');
    }
  };

  const verifyPhoneNumber = async () => {
    try {
      const response = await axios.post('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/verify-phone-number/', {
        phone_number: registerForm.phone_number,
        code: verificationCode,
      });
      alert(response.data.message);
      setIsVerified(true);
    } catch (error) {
      console.error('Failed to verify phone number:', error);
      alert('Failed to verify phone number');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please verify your phone number first.');
      return;
    }
    try {
      await axios.post('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/register/', {
        username: registerForm.username,
        phone_number: registerForm.phone_number,
        password: registerForm.password,
        is_active: true,
        is_superuser: false,
        is_seller: false,
      });
      alert('회원가입 성공\n최초 가입 후, MyPage에 접속하셔서 기본적인 정보 수정 부탁드립니다.');
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed');
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const response = await axios.get(
        'https://medakaauction.com/auth/login/kakao/',
        { withCredentials: true }
      );
      if (response.status === 200) {
        window.location.href = response.data.auth_url;
      } else {
        alert('Kakao login failed');
      }
    } catch (error) {
      console.error('Kakao login failed', error);
      alert(`Kakao login failed: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background text-foreground">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-12 px-6">
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Login</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="login-username">Username</Label>
                <Input 
                  id="login-username" 
                  name="username" 
                  type="text" 
                  placeholder="Enter your username" 
                  onChange={handleLoginChange} 
                />
              </div>
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input 
                  id="login-password" 
                  name="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  onChange={handleLoginChange} 
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
              <Button onClick={handleKakaoLogin}>Login with Kakao</Button>
              <div className="text-center">
                <Link onClick={() => setShowForgotPassword(true)} className="text-sm text-muted-foreground hover:underline">Forgot password?</Link>
              </div>
            </form>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Register</h2>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <Label htmlFor="register-username">Username</Label>
                <Input 
                  id="register-username" 
                  name="username" 
                  type="text" 
                  placeholder="Enter your username" 
                  onChange={handleRegisterChange} 
                />
              </div>
              <div>
                <Label htmlFor="register-password">Password</Label>
                <Input 
                  id="register-password" 
                  name="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={registerForm.password} 
                  onChange={handleRegisterChange} 
                />
              </div>
              <div>
                <Label htmlFor="register-phone_number">Phone Number</Label>
                <Input 
                  id="register-phone_number" 
                  name="phone_number" 
                  type="text" 
                  placeholder="Enter your phone number" 
                  onChange={handleRegisterChange} 
                />
                <Button onClick={requestVerificationCode} type="button" className="send-verification">Send Verification Code</Button>
              </div>
              {codeSent && (
                <div>
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input 
                    id="verification-code" 
                    name="verification_code" 
                    type="text" 
                    placeholder="Enter the verification code" 
                    value={verificationCode} 
                    onChange={(e) => setVerificationCode(e.target.value)} 
                  />
                  <Button onClick={verifyPhoneNumber} type="button" className="confirm-verification">Verify Code</Button>
                </div>
              )}
              <Button type="submit" className="w-full">Register</Button>
            </form>
          </div>
        </div>
      </main>
      <Modal show={showForgotPassword} onClose={() => setShowForgotPassword(false)}>
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      </Modal>
    </div>
  );
};

export default LoginRegisterPage;
