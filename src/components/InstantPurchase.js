// src/components/InstantPurchase.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

const InstantPurchase = ({ productId }) => {
    const [bid, setBid] = useState({ bidder: sessionStorage.getItem('username'), product_id: productId, amount: 0 });
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBid({ ...bid, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://medakaauction.com/medaka/${productId}/instant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bid)
            });
            const data = await response.json();
            if (response.ok) {
                alert('즉시구매 성공');
                navigate('/');
            } else {
                alert(data.detail || 'Failed to place bid');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container mx-auto py-12 px-6">
            <h1 className="text-2xl font-bold mb-4">즉시구매</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">즉시구매</label>
                    <input
                        name="amount"
                        type="number"
                        placeholder="입찰가"
                        value={bid.amount}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <Button type="submit" className="btn-primary">즉시구매</Button>
            </form>
        </div>
    );
};

export default InstantPurchase;
