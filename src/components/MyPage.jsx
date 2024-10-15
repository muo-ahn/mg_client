// src/components/MyPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from './ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import UserPage from './UserPage';
import Modal from './Modal';
import '../styles/myPage.css';

const token = sessionStorage.getItem('access_token');

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [finishedProducts, setFinishedProducts] = useState([]);
    const [interestProducts, setInterestProducts] = useState([]);
    const [activeProducts, setActiveProducts] = useState([]);
    const [sortedAuctions, setSortedAuctions] = useState([]);
    const [oauth, setOauth] = useState(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // Modal state

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

    // Save user changes in the modal
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

    // Modal toggle functions
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <div className="my-page">
            <div className="profile-section">
                <span>ID : {user.id}</span>
                <Button className="profile-button" onClick={openModal}>내 프로필</Button>
            </div>
            {user.is_seller ? (
                <div> {/* Seller Page Data */} </div>
            ) : (
                <UserPage
                    user={user}
                    finishedProducts={finishedProducts}
                    interestProducts={interestProducts}
                    oauth={oauth}
                    handleSaveChanges={handleSaveChanges}
                />
            )}

            <Modal show={showModal} onClose={closeModal}>
                <div className="profile-modal-content">
                    {/* Profile form for updating user information */}
                    <form onSubmit={handleSaveChanges}>
                        <label>닉네임</label>
                        <input type="text" name="name" defaultValue={user.nickname} />
                        <label>비밀번호</label>
                        <input type="password" name="password" />
                        <label>아이콘</label>
                        <input type="file" name="icon" accept="image/*" />
                        <Button type="submit">저장</Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default MyPage;
