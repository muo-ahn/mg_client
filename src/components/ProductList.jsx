import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import ProductCard from './ui/ProductCard';
import { formatCurrency } from './context/FormatCurrency';
import '../styles/productList.css'
import { useAuth } from './context/AuthContext';
import { BASE_URL } from '../config';

export const calculateRemainingTime = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff <= 0) {
    return "00일 - 00시 00분 00초";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${days}일 - ${hours}시 ${minutes}분 ${seconds}초`;
};

const ProductList = ({ searchQuery }) => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [sortOption, setSortOption] = useState('latest');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch(`https://medakaauction.com/medaka/`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setAuctions(data);
          setFilteredAuctions(data);
          setError(null);
          const initialTimeRemaining = {};
          data.forEach(auction => {
            initialTimeRemaining[auction.product_id] = calculateRemainingTime(auction.end_date);
          });
          setTimeRemaining(initialTimeRemaining);
        } else {
          throw new Error('Invalid products data');
        }
      } catch (error) {
        console.error('Error fetching product list:', error);
        setError(`Error fetching product list. Please try again later.`);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTimes) => {
        const updatedTimes = { ...prevTimes };
        filteredAuctions.forEach(auction => {
          updatedTimes[auction.product_id] = calculateRemainingTime(auction.end_date);
        });
        return updatedTimes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [filteredAuctions]);

  useEffect(() => {
    const filtered = auctions.filter(auction => 
      auction.product_name.includes(searchQuery) || 
      auction.original_source.includes(searchQuery) ||
      auction.product_id.includes(searchQuery)
    );
    setFilteredAuctions(filtered);
  }, [searchQuery, auctions]);

  useEffect(() => {
    if (searchQuery) {
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(`https://0nusqdjumd.execute-api.ap-northeast-2.amazonaws.com/default/search?query=${searchQuery}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: searchQuery, user_id: user ? user.id : 0 }),
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          const data = await response.json();
          setSearchResult(data.items);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setError(`Error fetching search results. Please try again later.`);
        }
      };

      fetchSearchResults();
    } else {
      setSearchResult([]);
    }
  }, [searchQuery]);

  const handleSortChange = (sortKey) => {
    setSortOption(sortKey);
    let sortedAuctions = [...filteredAuctions];

    switch (sortKey) {
      case 'interest':
        sortedAuctions.sort((a, b) => b.interest - a.interest);
        break;
      case 'current_price_high':
        sortedAuctions.sort((a, b) => {
          const priceA = a.bids.length > 0 ? a.bids[a.bids.length - 1].amount : a.start_price;
          const priceB = b.bids.length > 0 ? b.bids[b.bids.length - 1].amount : b.start_price;
          return priceB - priceA;
        });
        break;
      case 'current_price_low':
        sortedAuctions.sort((a, b) => {
          const priceA = a.bids.length > 0 ? a.bids[a.bids.length - 1].amount : a.start_price;
          const priceB = b.bids.length > 0 ? b.bids[b.bids.length - 1].amount : b.start_price;
          return priceA - priceB;
        });
        break;
      case 'time_remain':
        sortedAuctions.sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
        break;
      case 'hot_product':
        sortedAuctions.sort((a, b) => (b.interest + b.bids.length) - (a.interest + a.bids.length));
        break;
      case 'latest':
        sortedAuctions = [...auctions];
        break;
      default:
        break;
    }

    setFilteredAuctions(sortedAuctions);
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="second-header mb-4">
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic" className='sortby-dropdown'>
            Sort By {sortOption}
          </Dropdown.Toggle>
          <Dropdown.Menu className='sortby-menu'>
            <Dropdown.Item onClick={() => handleSortChange('latest')}>최신 등록순</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('interest')}>인기도순</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('current_price_high')}>높은가격순</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('current_price_low')}>낮은가격순</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('time_remain')}>마감임박순</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('hot_product')}>핫 제품</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className='product-count'>
          진행 중인 경매 : {filteredAuctions.length}건
        </div>
      </div>
      <div className="product-grid">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          filteredAuctions.length > 0 ? (
            filteredAuctions.map(auction => (
              <Link to={`/product/${auction.product_id}`} key={auction.product_id}>
                <ProductCard
                  image={auction.media || auction.thumbnails[0] || auction.media_extra[0] || '/placeholder.svg'}
                  interestCount={auction.interest || 0}
                  originalSource={auction.original_source}
                  startPrice={formatCurrency(auction.start_price)}
                  currentPrice={formatCurrency(auction.bids.length > 0 ? auction.bids[auction.bids.length - 1].amount : auction.start_price)}
                  productName={auction.product_name}
                  timeRemaining={timeRemaining[auction.product_id] || "00일 - 00시 00분 00초"}
                  bids={auction.bids.length}
                  endDate={new Date(auction.end_date).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                />
              </Link>
            ))
          ) : (
            <div className="no-results">
              <p>No active products found</p>
            </div>
          )
        )}
      </div>
      <div className='search-result'>
        {searchResult.length > 0 ? (
          <div className="blog-search-results">
            <h2 className='blog-search-results-header'>Blog Search Results</h2>
            {searchResult.map((result, index) => (
              <div key={index} className="search-result-item">
                <div className="text-container">
                  <a href={result.link} target="_blank" rel="noopener noreferrer">
                    <h3 dangerouslySetInnerHTML={{ __html: result.title }} />
                  </a>
                  <p dangerouslySetInnerHTML={{ __html: result.description }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          searchQuery && (
            <div className="no-results">
              <p>No blog search results</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductList;
