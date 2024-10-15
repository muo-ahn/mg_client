// src/components/UserPage.jsx

import React from 'react';
import '../styles/userPage.css';

const UserPage = ({ user, finishedProducts, interestProducts, oauth, handleSaveChanges }) => {

    return (
        <div className="user-page-container">
            {/* Profile Section */}
            <div className="profile-header">
                <div className="profile-id-section">
                    <div className="profile-icon"></div>
                    <div className="profile-id">{user.username}</div>
                </div>
            </div>

            {/* Auction Summary Section */}
            <div className="auction-summary">
                <div className="auction-summary-item">
                    <h3>{finishedProducts.length}</h3>
                    <p>낙찰</p>
                </div>
                <div className="auction-summary-item">
                    <h3>0</h3>
                    <p>배송준비중</p>
                </div>
                <div className="auction-summary-item">
                    <h3>0</h3>
                    <p>배송중</p>
                </div>
                <div className="auction-summary-item">
                    <h3>0</h3>
                    <p>배송완료</p>
                </div>
            </div>

            {/* Ongoing Auctions Section */}
            <div className="auction-list-header">
                <h2>진행중인 내 경매</h2>
                <button className="more-button">더보기</button>
            </div>

            <div className="auction-list">
                {interestProducts.map((product, index) => (
                    <div className="auction-item" key={index}>
                        <div className="auction-info">
                            <span className="auction-status">경매중</span>
                            <span className="auction-date">{new Date(product.end_date).toLocaleDateString()}</span>
                            <span className="auction-title">{product.product_name}</span>
                        </div>
                        <div className="auction-price">
                            <span className="current-price">현재가: {product.current_price}원</span>
                            <span className="days-remaining">D-{Math.floor((new Date(product.end_date) - new Date()) / (1000 * 60 * 60 * 24))}</span>
                        </div>
                        <button className="delete-button">삭제</button>
                    </div>
                ))}
            </div>

            {/* Points and Orders Section */}
            {/* <div className="footer-summary">
                <div className="summary-item">
                    <p>가용적립금</p>
                    <p>1,000원</p>
                    <button>조회</button>
                </div>
                <div className="summary-item">
                    <p>총적립금</p>
                    <p>1,000원</p>
                    <button>조회</button>
                </div>
                <div className="summary-item">
                    <p>사용적립금</p>
                    <p>0원</p>
                </div>
                <div className="summary-item">
                    <p>총주문</p>
                    <p>0원 (0회)</p>
                </div>
                <div className="summary-item coupon-item">
                    <p>쿠폰</p>
                    <p>0개</p>
                    <button>조회</button>
                </div>
            </div> */}
        </div>
    );
};

export default UserPage;
