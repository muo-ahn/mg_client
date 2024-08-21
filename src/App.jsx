// src/App.js

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/shared/Header';
import { Footer } from './components/shared/Footer';
import { AuthProvider } from './components/context/AuthContext';
import AddProduct from './components/AddProduct';
import AdminDashboard from './components/AdminDashboard';
import BidForm from './components/BidForm';
import ProtectAdmin from './components/ProtectAdmin';
import ProductDetail from './components/ProductDetail';
import ProtectedRoute from './components/ProtectedRoute';
import LoginRegisterPage from './components/LoginRegister';
import MyPage from './components/MyPage.jsx';
import ProductList from './components/ProductList.jsx';
import KakaoCallback from './components/KakaoCallback.js';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <Router>
        <Header onSearch={setSearchQuery} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<ProductList searchQuery={searchQuery} />} />
            <Route path="/login" element={<LoginRegisterPage />} />
            <Route path="/register" element={<LoginRegisterPage />} />
            <Route path="/AddProduct" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/bid/:productId" element={<ProtectedRoute><BidForm /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectAdmin><AdminDashboard /></ProtectAdmin>} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<div>About Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="/kakao/callback" element={<KakaoCallback />} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
