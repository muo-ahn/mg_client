// src/components/MyPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from './ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import UserPage from './UserPage';
import SellerPage from './SellerPage';
import '../styles/myPage.css';

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
        // Handle saving user changes logic here
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

export default MyPage;
