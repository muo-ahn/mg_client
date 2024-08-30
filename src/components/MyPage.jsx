// src/components/MyPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';
import AddProduct from './AddProduct';
import { useNavigate } from 'react-router-dom';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [finishedProducts, setFinishedProducts] = useState([]);
    const [oauth, setOauth] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setOauth(getCookie('oauth'));
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/user/my-page', {
                withCredentials: true
            });
            setUser(response.data);

            if (response.data.id) {
                fetchFinishedProducts(response.data.id);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchFinishedProducts = async (userId) => {
        try {
            const response = await axios.get(`http://medakaauction.com/medaka/${userId}/finished`, {
                withCredentials: true
            });
            setFinishedProducts(response.data);
        } catch (error) {
            console.error('Error fetching finished products:', error);
        }
    };

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
                    await axios.put('https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/auth/user/update', {
                        nickname,
                        password,
                        icon: iconBase64
                    }, {
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
                    password,
                }, {
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
                    <Button className="mb-4">Go to Admin Dashboard</Button>
                </Link>
            )}
            {user.is_seller ? (
                <SellerPage user={user} finishedProducts={finishedProducts} />
            ) : (
                <UserPage user={user} finishedProducts={finishedProducts} oauth={oauth} handleSaveChanges={handleSaveChanges} />
            )}
        </div>
    );
};

const UserPage = ({ user, finishedProducts, oauth, handleSaveChanges }) => {
    const accountSettingsClass = oauth === 'local' ? "md:grid-cols-[300px_1fr]" : "md:grid-cols-1";

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 bg-background text-foreground">
                <div className={`container mx-auto py-12 px-6 grid grid-cols-1 ${accountSettingsClass} gap-8`}>
                    {oauth === 'local' && (
                        <div className="bg-muted rounded-lg p-6">
                            <h2 className="text-lg font-bold mb-4">Account Settings</h2>
                            <form onSubmit={handleSaveChanges} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nickname</Label>
                                    <Input id="name" defaultValue={user.nickname} />
                                </div>
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" />
                                </div>
                                <div>
                                    <Label htmlFor="icon">Icon</Label>
                                    <Input id="icon" type="file" accept='image/jpeg, image/png'/>
                                </div>
                                <Button type="submit" className="w-full">Save Changes</Button>
                            </form>
                        </div>
                    )}
                    <div className="bg-muted rounded-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div>
                                <h2 className="text-lg font-bold">{user.username}</h2>
                            </div>
                        </div>
                        <div className="grid gap-6">
                            <div>
                                <h3 className="text-lg font-bold mb-2">Finished Auctions</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {finishedProducts.map((product) => (
                                        <div key={product.id} className="bg-card text-card-foreground rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-base font-bold">{product.name}</h4>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <span>product ID: {product.product_id}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <img
                                                        src={product.media || product.thumbnails[0]}
                                                        alt={product.product_name}
                                                        width={200}
                                                        height={200}
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-between">
                                                    <p className="text-muted-foreground">
                                                        Status: {product.status}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        낙찰가 : {product.final_price}
                                                    </p>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const SellerPage = ({ user, finishedProducts }) => (
    <div className="seller-page">
        <div className="bg-muted rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Auction Management</h2>
            <AddProduct />
        </div>
        <div className="bg-muted rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
                <div>
                    <h2 className="text-lg font-bold">{user.username}</h2>
                 </div>
            </div>
            <div className="grid gap-6">
                <div>
                    <h3 className="text-lg font-bold mb-2">Finished Auctions</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {finishedProducts.map((product) => (
                            <div key={product.id} className="bg-card text-card-foreground rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-base font-bold">{product.name}</h4>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <span>product ID: {product.product_id}</span>
                                     </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <img
                                             src={product.media || product.thumbnails}
                                             alt={product.product_name}
                                             width={200}
                                             height={200}
                                         />
                                     </div>
                                    <div className="flex flex-col justify-between">
                                        <p className="text-muted-foreground">
                                             Status: {product.status}
                                         </p>
                                        <p className="text-muted-foreground">
                                             낙찰가 : {product.final_price}
                                         </p>
                                        <Button variant="outline" size="sm">
                                             View Details
                                         </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default MyPage;
