// src/components/UserPage.jsx

import React from 'react';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

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

export default UserPage;
