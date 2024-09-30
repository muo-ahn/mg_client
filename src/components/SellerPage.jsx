// src/components/SellerPage.jsx

import React, { useState, useEffect } from 'react';
import AuctionItem from './AuctionItem';
import Modal from './Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import AddProduct from './AddProduct';
import { useLocation } from 'react-router-dom'; // <-- Import useLocation
import '../styles/sellerPage.css';

const SellerPage = () => {
    const [isModalOpen, setModalOpen] = useState(false); // Manage modal state for AddProduct

    // Get passed data from route state
    const location = useLocation();
    const { user, finishedProducts, activeProducts, sortedAuctions } = location.state || {}; // Read the data passed via state

    // Sort by time remaining
    const handleSortByTimeRemain = () => {
        // You can add sorting logic here if needed
    };

    return (
        <div className="desktop-1">
            <div className="sidebar">
                {/* Sidebar - Store Management */}
                <div className="filter">
                    <div className="title">
                        <div className="icon-1"></div>
                        <div className="null-">{user.nickname}님 환영합니다.</div>
                    </div>
                </div>

                <div className="options">
                    {/* Sidebar Options */}
                    <div className="option">
                        <div className="icon"></div>
                        <div className="text-">기본</div>
                    </div>
                    <div className="option-1">
                        <div className="icon-2"></div>
                        <div className="text--">경매 관리</div>
                    </div>
                    <div className="option-2">
                        <div className="icon-3"></div>
                        <div className="text--1">정산</div>
                    </div>
                    <div className="option-3">
                        <div className="icon-4"></div>
                        <div className="text--2">배송</div>
                    </div>
                    <div className="option-4">
                        <div className="icon-5"></div>
                        <div className="text--3">상품</div>
                    </div>
                    <div className="option-5">
                        <div className="icon-6"></div>
                        <div className="text--4">회원관리</div>
                    </div>
                </div>
            </div>

            {/* Main Content - 경매 Section */}
            <div className="group--">
                <div className="rectangle--"></div>
                <div className="text---1">종료임박 경매</div>

                <Button onClick={handleSortByTimeRemain}>Sort by Time Remaining</Button>
                <div className="auction-list">
                    {sortedAuctions && sortedAuctions.length > 0 ? (
                        sortedAuctions.map((product) => (
                            <AuctionItem key={product.id} product={product} />
                        ))
                    ) : (
                        <p>No active products available.</p>
                    )}
                </div>
            </div>

            <div className="group--">
                <div className="rectangle--"></div>
                <div className="text---1">경매</div>

                {/* Active Products */}
                <h3>Active Products</h3>
                <Button onClick={handleSortByTimeRemain}>Sort by Time Remaining</Button>
                <div className="auction-list">
                    {activeProducts && activeProducts.length > 0 ? (
                        activeProducts.map((product) => (
                            <AuctionItem key={product.id} product={product} />
                        ))
                    ) : (
                        <p>No active products available.</p>
                    )}
                </div>

                {/* Finished Products */}
                <h3>Finished Products</h3>
                <div className="auction-list">
                    {finishedProducts && finishedProducts.length > 0 ? (
                        finishedProducts.map((product) => (
                            <AuctionItem key={product.id} product={product} />
                        ))
                    ) : (
                        <p>No finished products available.</p>
                    )}
                </div>
            </div>

            {/* Main Content - AddProduct Section */}
            <div className="group---1">
                <div className="rectangle-2"></div>
                <div className="text---2">상품 관리</div>

                <div className="sidebar-item">
                    <Button onClick={() => setModalOpen(true)}>Add Product</Button>
                    {/* Modal for Add Product */}
                    {isModalOpen && (
                        <Modal onClose={() => setModalOpen(false)}>
                            <AddProduct />
                        </Modal>
                    )}
                </div>
            </div>

            {/* Main Content - 주문 / 배송 Section */}
            <div className="group---2">
                <div className="rectangle-3"></div>
                <div className="text---">주문 / 배송</div>

                <div className="sidebar-item">
                    <Button>Shipment 1</Button>
                    <Button>Shipment 2</Button>
                    <Input placeholder="Shipment Details" />
                </div>
            </div>

            {/* Main Content - Graph Section */}
            <div className="group---3">
                <div className="rectangle-4"></div>
                <div className="text--5">Orders and Profits</div>

                <div className="graph-container">
                    {graphData ? (
                        <canvas id="ordersProfitGraph" />
                    ) : (
                        <p>Graph data is not available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerPage;
