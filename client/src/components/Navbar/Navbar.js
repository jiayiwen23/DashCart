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
        <BsCart4 className={styles.navImage} />
        <h1 className={styles.navbarTitle}>Dash Cart</h1>
      </div>
      <SearchBar
        searchItem={searchItem}
        setSearchItem={setSearchItem}
        onSearch={handleSearch}
      />
      <div className={styles.navButtons}>
        <button onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHouse} />
        </button>
        {isAuthenticated ? (
          <button onClick={() => navigate("/cart")}>
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
        ) : (
          <button onClick={loginWithRedirect}>Log in</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
