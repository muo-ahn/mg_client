// src/components/UserPage.jsx

import React from 'react';
import { Button } from './ui/Button';

const UserPage = ({ user, finishedProducts, interestProducts, oauth, handleSaveChanges }) => {
    return (
        <div className="user-page-container">
            {/* User Info Section */}
            <div className="user-info">
                <h2>{user.nickname}님의 정보</h2>
                <p>전화번호: {user.phone_number}</p>
                <p>OAuth 정보: {oauth ? '연결됨' : '연결되지 않음'}</p>
            </div>

            {/* Interested Products Section */}
            <div className="interest-section">
                <h3>관심 상품</h3>
                <ul>
                    {interestProducts.length > 0 ? (
                        interestProducts.map(product => (
                            <li key={product.id} className="product-item">
                                <span>{product.product_name}</span>
                                <span>{product.start_price} 원</span>
                            </li>
                        ))
                    ) : (
                        <p>No interested products</p>
                    )}
                </ul>
            </div>

            {/* Finished Auctions Section */}
            <div className="finished-auctions-section">
                <h3>종료된 경매</h3>
                <ul>
                    {finishedProducts.length > 0 ? (
                        finishedProducts.map(product => (
                            <li key={product.id} className="auction-item">
                                <span>{product.product_name}</span>
                                <span>최종가: {product.final_price} 원</span>
                                <span>마감일: {new Date(product.end_date).toLocaleDateString()}</span>
                            </li>
                        ))
                    ) : (
                        <p>No finished auctions</p>
                    )}
                </ul>
            </div>

            {/* Profile Update Section */}
            <div className="profile-update-section">
                <h3>회원 정보 수정</h3>
                <form onSubmit={handleSaveChanges}>
                    <div className="form-group">
                        <label htmlFor="name">닉네임</label>
                        <input type="text" id="name" name="name" defaultValue={user.nickname} placeholder="닉네임" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">새 비밀번호</label>
                        <input type="password" id="password" name="password" placeholder="새 비밀번호" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="icon">프로필 사진</label>
                        <input type="file" id="icon" name="icon" />
                    </div>
                    <Button type="submit" className="save-button">저장</Button>
                </form>
            </div>
        </div>
    );
};

export default UserPage;
