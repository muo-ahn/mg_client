// src/components/MyPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from './ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import UserPage from './UserPage';
import '../styles/myPage.css';

const token = sessionStorage.getItem('access_token');

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [finishedProducts, setFinishedProducts] = useState([]);
    const [interestProducts, setInterestProducts] = useState([]);
    const [activeProducts, setActiveProducts] = useState([]);
    const [sortedAuctions, setSortedAuctions] = useState([]);
    const [oauth, setOauth] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false); // Modal state for user profile updates
    const navigate = useNavigate();

    // Fetch finished products
    const fetchFinishedProducts = useCallback(async (userId) => {
        try {
            const response = await axios.get(`https://medakaauction.com/medaka/${userId}/finished`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token} ${sessionStorage.getItem('oauth')}`
                }
            });
            setFinishedProducts(response.data);
        } catch (error) {
            console.error('Error fetching finished products:', error);
        }
    }, []);

    // Fetch active products
    const fetchActiveProducts = useCallback(async () => {
        try {
            const response = await axios.get(`https://medakaauction.com/medaka/`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token} ${sessionStorage.getItem('oauth')}`
                }
            });
            setActiveProducts(response.data);
        } catch (error) {
            console.error('Error fetching active products:', error);
        }
    }, []);

    // Fetch user data and related products
    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get(
                'https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/user/my-page/',
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('access_token')} ${sessionStorage.getItem('oauth')}`
                    }
                }
            );
            setUser(response.data);
            setInterestProducts(response.data.interest_product || []);

            if (response.data.id) {
                fetchFinishedProducts(response.data.id);
                fetchActiveProducts();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [fetchFinishedProducts, fetchActiveProducts]);

    // Sort products by time remaining
    const handleSortByTimeRemain = () => {
        const sorted = [...activeProducts].sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
        setSortedAuctions(sorted);
    };

    useEffect(() => {
        setOauth(sessionStorage.getItem('oauth'));
        fetchUserData();
    }, [fetchUserData]);

    // Save user changes
    const handleSaveChanges = async (event) => {
        event.preventDefault();
        const nickname = event.target.name.value;
        const password = event.target.password.value;
        const icon = event.target.icon.files[0];

        let iconBase64 = null;
        if (icon) {
            const reader = new FileReader();
            reader.readAsDataURL(icon);
            reader.onload = async () => {
                iconBase64 = reader.result;

                try {
                    await axios.put('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/user/update', 
                    {
                        nickname,
                        password,
                        icon: iconBase64
                    }, 
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token} ${sessionStorage.getItem('oauth')}`
                        },
                        withCredentials: true
                    });

                    fetchUserData();
                    alert("회원 정보가 수정되었습니다.");
                    setShowProfileModal(false); // Close the modal after saving changes
                } catch (error) {
                    console.error('Error updating user data:', error);
                }
            };
        } else {
            try {
                await axios.put('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/user/update', {
                    nickname,
                    password
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token} ${sessionStorage.getItem('oauth')}`
                    },
                    withCredentials: true
                });

                fetchUserData();
                alert("회원 정보가 수정되었습니다.");
                setShowProfileModal(false); // Close the modal after saving changes
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="my-page">
            {user.is_superuser && (
                <Link to="/admin">
                    <Button className="admin-button">Go to Admin Dashboard</Button>
                </Link>
            )}
            <div className="my-page-header">
                <div className="user-id">ID: {user.id}</div>
                <Button onClick={() => setShowProfileModal(true)} className="profile-button">
                    내 프로필
                </Button>
            </div>

            {showProfileModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <UserPage
                            user={user}
                            finishedProducts={finishedProducts}
                            interestProducts={interestProducts}
                            oauth={oauth}
                            handleSaveChanges={handleSaveChanges}
                        />
                        <Button onClick={() => setShowProfileModal(false)} className="close-modal-button">Close</Button>
                    </div>
                </div>
            )}

            {/* Active products and auction sorting */}
            <div className="active-auctions-section">
                <h3>진행중인 경매</h3>
                <Button onClick={handleSortByTimeRemain}>Sort by Time Remaining</Button>
                <ul>
                    {sortedAuctions.length > 0 ? (
                        sortedAuctions.map(product => (
                            <li key={product.id} className="auction-item">
                                <span>{product.product_name}</span>
                                <span>현재가: {product.current_price || product.start_price} 원</span>
                                <span>마감일: {new Date(product.end_date).toLocaleDateString()}</span>
                            </li>
                        ))
                    ) : (
                        <p>No active auctions available</p>
                    )}
                </ul>
            </div>

            {/* Finished products section */}
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
                        <p>No finished auctions available</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default MyPage;
