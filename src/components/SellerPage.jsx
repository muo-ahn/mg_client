// src/components/SellerPage.jsx

import React from 'react';
import AddProduct from './AddProduct';
import '../styles/sellerPage.css';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const SellerPage = ({ user, finishedProducts, activeProducts, sortedAuctions, graphData, onSortByTimeRemain }) => {
    return (
        <div className="seller-page">
            {/* Sidebar */}
            <div className="sidebar">
                <h3>매장 관리</h3>
                <div className="sidebar-item">
                    <Button>Update Seller Information</Button>
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
                            <div key={product.id} className="auction-item">
                                <h4>{product.name}</h4>
                                <p>Time Remaining: {product.end_date}</p>
                                <img
                                    src={product.media || product.thumbnail}
                                    alt={product.name}
                                    width={200}
                                    height={200}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No active products available.</p>
                    )}
                </div>

                {/* Graph for Orders and Profits */}
                <h3>Orders and Profits</h3>
                <div className="graph-container">
                    {/* Implement graph rendering here based on graphData */}
                </div>

                {/* To-do List */}
                <h3>To-Do List</h3>
                <div className="todo-list">
                    <h4>Before Getting Money</h4>
                    <p>{/* Items before getting money */}</p>

                    <h4>Preparing for Send Product</h4>
                    <p>{/* Preparing items */}</p>

                    <h4>Holding to Send Product</h4>
                    <p>{/* Holding items */}</p>

                    <h4>Waiting to Send Product</h4>
                    <p>{/* Waiting items */}</p>

                    <h4>Sending Product</h4>
                    <p>{/* Sending items */}</p>
                </div>

                {/* Finished Auctions Section */}
                <h3>Finished Auctions</h3>
                <div className="auction-list">
                    {finishedProducts.length > 0 ? (
                        finishedProducts.map((product) => (
                            <div key={product.id} className="auction-item">
                                <h4>{product.name}</h4>
                                <p>Final Price: {product.final_price}</p>
                                <img
                                    src={product.media || product.thumbnail}
                                    alt={product.name}
                                    width={200}
                                    height={200}
                                />
                            </div>
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
