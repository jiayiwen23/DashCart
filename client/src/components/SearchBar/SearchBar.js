import React from "react";
import styles from "./SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ searchItem, setSearchItem, onSearch }) => {
  const handleInputChange = (e) => {
    setSearchItem(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(searchItem);
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        className={styles.searchInput}
        value={searchItem}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Search products..."
      />
      <button
        className={styles.searchButton}
        onClick={() => onSearch(searchItem)}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
};

export default SearchBar;