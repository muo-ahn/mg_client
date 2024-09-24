// src/components/SellerPage.jsx

import React from 'react';
import AddProduct from './AddProduct';
import AuctionItem from './AuctionItem';
import '../styles/sellerPage.css';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useState } from 'react';
import Modal from './Modal';

const SellerPage = ({ user, finishedProducts, activeProducts, sortedAuctions, graphData, onSortByTimeRemain }) => {
    const [isModalOpen, setModalOpen] = useState(false); // Manage modal state

    return (
        <div className="seller-page">
            {/* Sidebar */}
            <div className="sidebar">
                <h3>매장 관리</h3>
                <div className="sidebar-item">
                    <Button onClick={() => setModalOpen(true)}>Update Seller Information</Button>
                    {isModalOpen && <Modal onClose={() => setModalOpen(false)}> {/* Modal logic */} 
                        <p>Update seller info here</p>
                    </Modal>}
                </div>

                <h3>상품</h3>
                <div className="sidebar-item">
                    <AddProduct />
                    <Button>View Selling Products</Button>
                </div>

                <h3>배송</h3>
                <div className="sidebar-item">
                    <Button>Shipment 1</Button>
                    <Button>Shipment 2</Button>
                    <Input placeholder="Shipment Details" />
                </div>

                <h3>정산</h3>
                <div className="sidebar-item">
                    <Button>Pricing</Button>
                    <Button>Calculate Commission Fee</Button>
                    <Button>Request Payment</Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Sort by Time Remain */}
                <h3>Active Products (Sorted by Time Remain)</h3>
                <Button onClick={onSortByTimeRemain}>Sort by Time Remaining</Button>
                <div className="auction-list">
                    {sortedAuctions.length > 0 ? (
                        sortedAuctions.map((product) => (
                            <AuctionItem key={product.id} product={product} />
                        ))
                    ) : (
                        <p>No active products available.</p>
                    )}
                </div>

                {/* Graph for Orders and Profits */}
                <h3>Orders and Profits</h3>
                <div className="graph-container">
                    {graphData ? (
                        <canvas id="ordersProfitGraph" />
                    ) : (
                        <p>Graph data is not available yet.</p>
                    )}
                </div>

                {/* To-do List */}
                <h3>To-Do List</h3>
                <div className="todo-list">
                    <h4>Before Getting Money</h4>
                    <p>{/* Fetch dynamically or simulate data */}</p>

                    <h4>Preparing to Send Product</h4>
                    <p>{/* Fetch dynamically or simulate data */}</p>

                    <h4>Holding to Send Product</h4>
                    <p>{/* Fetch dynamically or simulate data */}</p>

                    <h4>Waiting to Send Product</h4>
                    <p>{/* Fetch dynamically or simulate data */}</p>

                    <h4>Sending Product</h4>
                    <p>{/* Fetch dynamically or simulate data */}</p>
                </div>

                {/* Finished Auctions Section */}
                <h3>Finished Auctions</h3>
                <div className="auction-list">
                    {finishedProducts.length > 0 ? (
                        finishedProducts.map((product) => (
                            <AuctionItem key={product.id} product={product} />
                        ))
                    ) : (
                        <p>No finished products available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerPage;
