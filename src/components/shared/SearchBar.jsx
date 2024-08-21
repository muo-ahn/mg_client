import React, { useState } from 'react';
import { ReactComponent as SearchIcon } from '../Icons/search-icon.svg'; // Update the path to your search icon

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="검색"
        className="search-bar"
        value={query}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
      />
      <button className="search-button" onClick={handleSearchClick}>
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchBar;
