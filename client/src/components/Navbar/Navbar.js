import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./Navbar.module.css";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft} onClick={() => navigate("/")}>
        <img src="/target.webp" alt="TargetLogo" className={styles.navImage} />
        <h1 className={styles.navbarTitle}>Online Retail Shop</h1>
      </div>
      <div className={styles.navButtons}>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/cart")}>
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
        {isAuthenticated ? (
          <button onClick={() => navigate("/profile")}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        ) : (
          <button onClick={loginWithRedirect}>Log in</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
