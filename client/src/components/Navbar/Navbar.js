import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHouse } from "@fortawesome/free-solid-svg-icons";
import styles from "./Navbar.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import { BsCart4 } from "react-icons/bs";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [searchItem, setSearchItem] = useState("");

  const handleSearch = (searchItem) => {
    navigate(`/search?q=${encodeURIComponent(searchItem)}`);
    setSearchItem("");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft} onClick={() => navigate("/")}>
        <BsCart4 className={styles.navImage} aria-label="Home"/>
        <h1 className={styles.navbarTitle}>Dash Cart</h1>
      </div>
      <div className={styles.navButtons}>
        <button onClick={() => navigate("/")} aria-label="Home">
          <FontAwesomeIcon icon={faHouse} />
        </button>
        {isAuthenticated ? (
          <button onClick={() => navigate("/cart")} aria-label="Cart">
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
        ) : (
          <button onClick={loginWithRedirect} aria-label="Log in">Log in</button>
        )}
      </div>
      <div className={styles.searchBarContainer}>
        <SearchBar
          searchItem={searchItem}
          setSearchItem={setSearchItem}
          onSearch={handleSearch}
        />
      </div>
    </nav>
  );
};

export default Navbar;
