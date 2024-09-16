// src/components/MyPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';
import AddProduct from './AddProduct';
import { useNavigate } from 'react-router-dom';
import '../styles/MyPage.css';

const token = sessionStorage.getItem('access_token');

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [finishedProducts, setFinishedProducts] = useState([]);
    const [interestProducts, setInterestProducts] = useState([]);
    const [oauth, setOauth] = useState(null);
    const navigate = useNavigate();

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
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [fetchFinishedProducts]);

    useEffect(() => {
        setOauth(sessionStorage.getItem('oauth'));
        fetchUserData();
    }, [fetchUserData]);

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
            {user.is_superuser && (
                <Link to="/admin">
                    <Button className="admin-button">Go to Admin Dashboard</Button>
                </Link>
            )}
            {user.is_seller ? (
                <SellerPage user={user} finishedProducts={finishedProducts} />
            ) : (
                <UserPage
                    user={user}
                    finishedProducts={finishedProducts}
                    interestProducts={interestProducts}
                    oauth={oauth}
                    handleSaveChanges={handleSaveChanges}
                />
            )}
        </div>
    );
};

const UserPage = ({ user, finishedProducts, interestProducts = [], oauth, handleSaveChanges }) => {
    return (
        <div className="user-page">
            <main className="content">
                {/* Account Settings Section */}
                {oauth === 'local' && (
                    <div className="account-settings">
                        <h2>Account Settings</h2>
                        <form onSubmit={handleSaveChanges} className="form">
                            <div className="form-group">
                                <Label htmlFor="name">Nickname</Label>
                                <Input id="name" defaultValue={user.nickname} />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="icon">Icon</Label>
                                <Input id="icon" type="file" accept="image/jpeg, image/png" />
                            </div>
                            <Button type="submit">Save Changes</Button>
                        </form>
                    </div>
                )}

                {/* Interested Auctions Section */}
                <div className="interested-auctions">
                    <h3>Interested Auctions</h3>
                    <div className="auction-list">
                        {interestProducts.length > 0 ? (
                            interestProducts.map((product) => (
                                <div key={product.product_id} className="auction-item">
                                    <h4>{product.product_name}</h4>
                                    <img
                                        src={product.first_thumbnail || 'default_image.jpg'}
                                        alt={product.product_name}
                                        width={200}
                                        height={200}
                                    />
                                    <p>Start Price: {product.start_price}</p>
                                </div>
                            ))
                        ) : (
                            <p>No interested auctions available.</p>
                        )}
                    </div>
                </div>

                {/* Finished Auctions Section */}
                <div className="finished-auctions">
                    <h3>Finished Auctions</h3>
                    <div className="auction-list">
                        {finishedProducts.map((product) => (
                            <div key={product.id} className="auction-item">
                                <h4>{product.name}</h4>
                                <img
                                    src={product.media || product.thumbnails[0]}
                                    alt={product.product_name}
                                    width={200}
                                    height={200}
                                />
                                <p>Status: {product.status}</p>
                                <p>Final Price: {product.final_price}</p>
                                <Button variant="outline" size="sm">
                                    View Details
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

const SellerPage = ({ user, finishedProducts }) => (
    <div className="seller-page">
        <div className="auction-management">
            <h2>Auction Management</h2>
            <AddProduct />
        </div>
        <div className="finished-auctions">
            <h3>Finished Auctions</h3>
            <div className="auction-list">
                {finishedProducts.map((product) => (
                    <div key={product.id} className="auction-item">
                        <h4>{product.name}</h4>
                        <img
                            src={product.media || product.thumbnails}
                            alt={product.product_name}
                            width={200}
                            height={200}
                        />
                        <p>Status: {product.status}</p>
                        <p>Final Price: {product.final_price}</p>
                        <Button variant="outline" size="sm">
                            View Details
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default MyPage;
