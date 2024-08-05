import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, logout } = useAuth0();

  return (
    <div className={styles.profileContainer}>
        <p className={styles.welcomeText}>Welcome, {user.name}!</p>
        <button
            className={styles.logoutButton}
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Log out
        </button>
    </div>
  );
};

export default Profile;