// src/components/MyPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import '../styles/myPage.css';

const token = sessionStorage.getItem('access_token');
const MyPage = () => {
    const [user, setUser] = useState(null);
    const [finishedProducts, setFinishedProducts] = useState([]);
    const [interestProducts, setInterestProducts] = useState([]);
    const [oauth, setOauth] = useState(null);
    const navigate = useNavigate();

    // Fetch Finished Auctions
    const fetchFinishedProducts = useCallback(async (userId) => {
        try {
            const response = await axios.get(`https://medakaauction.com/medaka/${userId}/finished`, 
                {
                  withCredentials: true,
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token} ${sessionStorage.getItem('oauth')}`
                  }
                }
            );
            setFinishedProducts(response.data);
        } catch (error) {
            console.error('Error fetching finished products:', error);
        }
    }, []);

    // Fetch User Data
    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/user/my-page/', 
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
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [fetchFinishedProducts]);

    useEffect(() => {
        setOauth(sessionStorage.getItem('oauth'));
        fetchUserData();
    }, [fetchUserData]);

    // Handle Save Changes in User Data
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
                    navigate('/');
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
                navigate('/');
                window.location.reload();
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
            {/* Top Tab Section */}
            <div className="header-section">
                <div className="tab-item active">프로필</div>
                <div className="tab-item">나의 쇼핑</div>
            </div>

            {/* Account Settings */}
            <div className="account-settings">
                <h2>Account Settings</h2>
                <form onSubmit={handleSaveChanges}>
                    <Label htmlFor="name">Nickname</Label>
                    <Input id="name" defaultValue={user.nickname} />
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                    <Label htmlFor="icon">Icon</Label>
                    <Input id="icon" type="file" accept="image/jpeg, image/png" />
                    <Button type="submit">Save Changes</Button>
                </form>
            </div>

            {/* Interested Auctions */}
            <div className="auctions-container">
                <div className="interested-auctions">
                    <h2>Interested Auctions</h2>
                    <div className="auction-list">
                        {interestProducts.map(product => (
                            <div key={product.product_id} className="auction-item">
                                <h3>{product.product_name}</h3>
                                <img src={product.first_thumbnail} alt={product.product_name} />
                                <p>Start Price: {product.start_price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Finished Auctions */}
                <div className="finished-products">
                    <h2>Finished Auctions</h2>
                    <div className="auction-list">
                        {finishedProducts.map(product => (
                            <div key={product.product_id} className="auction-item">
                                <h3>{product.name}</h3>
                                <img src={product.media || product.thumbnails[0]} alt={product.product_name} />
                                <p>Final Price: {product.final_price}</p>
                                <Button>View Details</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
