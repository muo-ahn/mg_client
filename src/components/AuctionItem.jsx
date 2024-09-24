// src/components/AuctionItem.jsx

import React from 'react';

const AuctionItem = ({ product }) => {
    return (
        <div key={product.id} className="auction-item">
            <h4>{product.name}</h4>
            <p>{product.final_price ? `Final Price: ${product.final_price}` : `Time Remaining: ${product.end_date}`}</p>
            <img
                src={product.media || product.thumbnail}
                alt={product.name}
                width={200}
                height={200}
            />
        </div>
    );
};

export default AuctionItem;
