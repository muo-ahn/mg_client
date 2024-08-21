// scr/components/ProductDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from './ui/Button';
import axios from 'axios';
import Modal from './Modal';
import BidForm from './BidForm';
import InstantPurchase from './InstantPurchase';
import { formatCurrency } from './context/FormatCurrency';
import ProtectedRoute from './ProtectedRoute';
import '../styles/productDetail.css';
import { calculateRemainingTime } from './ProductList';
import { GavelIcon, HeartIcon } from './Icons/Icons';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInstantModal, setShowInstantModal] = useState(false);
  const [bids, setBids] = useState([]);
  const [latestBid, setLatestBid] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/medaka/${id}/`)
      .then(response => {
        setProduct(response.data);
        setMainImage(response.data.media || response.data.thumbnails[0]);
        setBids(response.data.bids || []);
        setError(null);
        return response.data.seller_id;
      })
      .then(sellerId => {
        return axios.get(`http://127.0.0.1:8000/seller/${sellerId}`);
      })
      .then(response => {
        setSeller(response.data);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        setError('Error fetching product details. Please try again later.');
      });

    const socket = new WebSocket(`ws://127.0.0.1:8000/medaka/update_bid/${id}`);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data) {
        setLatestBid(data)
        if (data.end_date) {
          setProduct(prevProduct => ({ ...prevProduct, end_date: data.end_date }));
        }
      }
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [id]);

  useEffect(() => {
    if (product) {
      const interval = setInterval(() => {
        setTimeRemaining(calculateRemainingTime(product.end_date));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [product]);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const handleIncreaseInterest = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/medaka/${id}/interest`);
      window.location.reload();
    } catch (error) {
      console.error('Error increasing interest:', error);
      alert('Failed to increase interest');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload();
  };

  const getCurrentPrice = () => {
    if (latestBid && latestBid.amount) {
      return latestBid.amount;
    } else if (bids.length > 0) {
      return bids[bids.length - 1].amount;
    } else {
      return product.start_price;
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <div className="product-header">
          <span className="product-id">경매번호 : {product.product_id}</span>
        </div>
        <div className="product-image-container">
          <img src={mainImage} alt="Product Image" className="product-image" />
          <div className="time-remaining-detail">{timeRemaining}</div>
        </div>
        <div className="product-thumbnails">
          {product.thumbnails && product.thumbnails.map((thumbnail, index) => (
            <div key={index} className="product-thumbnail" onClick={() => handleThumbnailClick(thumbnail)}>
              <img src={thumbnail} alt={`Product Image ${index + 1}`} className="product-thumbnail-image" />
            </div>
          ))}
        </div>
        <div className="product-details">
          <p className="product-subtitle">{product.original_source}</p>
          <div className='product-detail-info'>
            <h2 className="product-detail-name">{product.product_name}</h2>
            <div className='icon-section'>
              <div className="icon-container">
                <button className='button-interest' onClick={handleIncreaseInterest} ><HeartIcon className="heart-icon" /></button>
                <span className="icon-count">{product.interest}</span>
              </div>
              <div className="icon-container">
                <GavelIcon className="gavel-icon" />
                <span className="icon-count">{bids.length}</span>
              </div>
            </div>
          </div>
          <div className="auction-details">
            <div className="auction-price">
              <span className="start-price">시작가 : {formatCurrency(product.start_price)}원</span>
              <span className="current-price">현재가 : {formatCurrency(getCurrentPrice())}원</span>
            </div>
            <div className="shipping-info">배송비 : 4,000원 (도서지역 추가금 3,000원)</div>
            <div className="end-date-detail">마감일 : {new Date(product.end_date).toLocaleString()}</div>
          </div>
          <div className="button-group">
            <Button className="bid-button" color='bg-red-500' onClick={() => setShowModal(true)}>경매 입찰하기</Button>
            <Button className="instant-purchase-button" onClick={() => setShowInstantModal(true)}>즉시 낙찰</Button>
          </div>
          <div className='product-description'>
            <p className='product-description-name'>개체명 : {product.product_name}</p>
            <p className='product-description-originalsource'>출처 : {product.original_source}</p>
            <p className='product-description-detail'>개체 정보 : {product.description}</p>
            {product.media_extra && product.media_extra.map((media, index) => (
              <img key={index} src={media} alt={`Product Image Extra ${index + 1}`} className="product-image-extra" />
            ))}
          </div>
          <div className='product-seller-info'>
            <p className='seller-info'>판매자 정보 : {product.seller_id}</p>
            {seller && (
              <>
                <p>이름: {seller.name}</p>
                <p>주소: {seller.address}</p>
                <p>전화번호: {seller.phone_number}</p>
                <p>사업자 번호: {seller.business_number}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal show={showModal} onClose={handleCloseModal}>
        <ProtectedRoute><BidForm productId={product.product_id} bids={bids} latestBid={latestBid} startPrice={product.start_price} /></ProtectedRoute>
      </Modal>
      <Modal show={showInstantModal} onClose={() => setShowInstantModal(false)}>
        <ProtectedRoute><InstantPurchase productId={product.product_id} /></ProtectedRoute>
      </Modal>
    </div>
  );
};

export default ProductDetail;
