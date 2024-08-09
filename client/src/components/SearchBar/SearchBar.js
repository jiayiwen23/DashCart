import React from "react";

const SearchBar = ({ searchItem, setSearchItem, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchItem);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search"
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;
