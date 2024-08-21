// src/components/ui/ProductCard.jsx

import React from 'react';
import '../../styles/productCard.css'; 
import { GavelIcon, HeartIcon } from '../Icons/Icons'; 

const ProductCard = ({ image, interestCount, originalSource, startPrice, currentPrice, productName, timeRemaining, bids, endDate }) => {
  return (
    <div className="product-card">
      <div className="image-container">
        <img src={image} alt={productName} className="product-image" />
        <div className="time-remaining">{timeRemaining}</div>
      </div>
      <div className="product-details">
        <div className="original-source">{originalSource}</div>
        <div className="product-info">
          <div className="product-name">{productName}</div>
        </div>
        <div className="product-prices">
          <span className="start-price">시작가: {startPrice}원</span>
          <span className="current-price">현재가: {currentPrice}원</span>
        </div>
        <div className="icon-section">
            <div className="icon-container">
              <button className='button-interest' ><HeartIcon className="heart-icon" /></button>
              <span className="icon-count">{interestCount}</span>
            </div>
            <div className="icon-container">
              <GavelIcon className="gavel-icon" />
              <span className="icon-count">{bids}</span>
            </div>
          </div>
      </div>
      <div className="product-footer">
        <div className="end-date">마감일: {endDate}</div>
      </div>
    </div>
  );
};

export default ProductCard;
