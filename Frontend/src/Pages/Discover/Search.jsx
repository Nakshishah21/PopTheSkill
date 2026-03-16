import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './Search.css';

const Search = ({ onSearch, searchTerm }) => {
  const [isActive, setIsActive] = useState(false);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const handleChange = (e) => {
    const term = e.target.value;
    onSearch(term);
  };

  return (
    <div className={`search-bar ${isActive ? 'active' : ''}`}>
      <input
        type="text"
        placeholder="Search skills..."
        value={searchTerm}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <FiSearch className="search-icon" />
    </div>
  );
};

export default Search;
