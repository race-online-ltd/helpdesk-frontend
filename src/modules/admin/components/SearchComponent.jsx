import React from "react";

export const SearchComponent = ({ onFilterChange, searchQuery }) => {
  return (
    <div className='input-group search-input mb-3 mb-sm-0'>
      <span className='input-group-text' id='searchText1'>
        <i className='bi bi-search'></i>
      </span>
      <input
        type='text'
        id='searchText'
        className='form-control'
        placeholder='Search'
        style={{ background: "var(--secondary-bg-color)" }}
        value={searchQuery}
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </div>
  );
};
