// src/App.js

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/shared/Header';
import { Footer } from './components/shared/Footer';
import { AuthProvider } from './components/context/AuthContext';
import AddProduct from './components/AddProduct';
import AdminDashboard from './components/AdminDashboard';
import BidForm from './components/BidForm';
import ProtectAdmin from './components/ProtectAdmin';
import ProtectSeller from './components/ProtectSeller'
import ProductDetail from './components/ProductDetail';
import ProtectedRoute from './components/ProtectedRoute';
import LoginRegisterPage from './components/LoginRegister';
import MyPage from './components/MyPage';
import ProductList from './components/ProductList';
import KakaoCallback from './components/KakaoCallback';
import SellerPage from './components/SellerPage';
import SellerLayout from './components/layouts/SellerLayout';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  // This hook gives access to the current route location
  const location = useLocation();

  const isSellerPage = location.pathname === '/seller';

  return (
    <AuthProvider>
      <Router>
        {/* Conditionally render Header and Footer */}
        {!isSellerPage && <Header onSearch={setSearchQuery} />}
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
            
            {/* Route for SellerPage with SellerLayout (without Header/Footer) */}
            <Route path="/seller" element={<ProtectSeller><SellerLayout><SellerPage /></SellerLayout></ProtectSeller>} />
          </Routes>
        </div>
        {!isSellerPage && <Footer />}
      </Router>
    </AuthProvider>
  );
}

export default App;
