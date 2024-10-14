// src/components/BidForm.js

import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { formatCurrency } from './context/FormatCurrency';
import '../styles/bidHistory.css';

const BidForm = ({ productId, bids: initialBids, latestBid, startPrice }) => {
    const [bid, setBid] = useState({ bidder: sessionStorage.getItem('username'), product_id: productId, amount: 0 });
    const [bids, setBids] = useState(initialBids.slice(-3));
    const [prevBid, setPrevBid] = useState(latestBid || { amount: 0, place_time: '', bidder_name: '' });

    useEffect(() => {
        if (
            latestBid &&
            (prevBid.amount !== latestBid.amount ||
                prevBid.place_time !== latestBid.place_time ||
                prevBid.bidder_name !== latestBid.bidder_name)
        ) {
            setBids((prevBids) => [...prevBids.slice(-2), latestBid]);
            setPrevBid(latestBid);
        }
    }, [latestBid, prevBid.amount, prevBid.place_time, prevBid.bidder_name]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBid({ ...bid, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const minBidIncrement = 1000;
            if (!latestBid || bid.amount - latestBid.amount < minBidIncrement) {
                alert(`최소 입찰 단위 : ${minBidIncrement}원`);
                return;
            }
            if (bid.amount < startPrice) {
                alert(`경매 시작가 : ${startPrice}`)
                return
            }

            const response = await fetch(`https://medakaauction.com/medaka/${productId}/bids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('access_token')} ${sessionStorage.getItem('oauth')}`
                },
                body: JSON.stringify(bid)
            });
            const data = await response.json();
            if (response.ok) {
                alert('입찰 성공');
            } else {
                alert('입찰 실패');
            }
        } catch (error) {
            alert('잠시 후 다시 시도해주세요.');
            console.log(error.message);
        }
    };

    return (
        <div className="modal-container mx-auto py-12 px-6">
            <h1 className="text-2xl font-bold mb-4">호가 등록</h1>
            <div className="bid-history mb-4">
                <h2 className="text-lg font-bold mb-2">경매 히스토리</h2>
                <div className="history-list">
                    {bids && bids.length > 0 ? (
                        bids.map((bid, index) => (
                        bid && (
                            <div key={index} className="history-item">
                                <div className="bidder-info">
                                    <span className="bidder-name">{bid.bidder_name}</span>
                                    <span>{formatCurrency(bid.amount)}원</span>
                                    <span className="bid-time">{new Date(bid.place_time).toLocaleString()}</span>
                                </div>
                            </div>
                        )
                        ))
                    ) : (
                        <div>No bids yet</div>
                    )}
                    </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">호가</label>
                    <input
                        name="amount"
                        type="number"
                        placeholder="호가"
                        value={bid.amount}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <Button type="submit" className="btn-primary">Place Bid</Button>
            </form>
        </div>
    );
};

export default BidForm;
