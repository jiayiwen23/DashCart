import React from "react";
import RequireAuth from "../Utils/RequireAuth";
import useFetchCartItems from "../hooks/useFetchCartItems";
import styles from "./Cart.module.css";
import { useAuth0 } from "@auth0/auth0-react";

const Cart = () => {
  const { cartItems, isLoading, error } = useFetchCartItems();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    return (
      <div className={styles.cartContainer}>
        <h1>Start your journey now</h1>
        <button onClick={loginWithRedirect}>Log In</button>
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching cart items.</div>;

  console.log(cartItems);

  return (
    <RequireAuth>
      <div className={styles.cartContainer}>
        <h1>Your Cart</h1>
        <ul className={styles.cartList}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <li key={item.itemId} className={styles.cartItem}>
                <img src={item.image} alt={item.title} />
                <div className={styles.cartItemDetails}>
                  <h2 className={styles.cartItemTitle}>{item.title}</h2>
                  <p className={styles.cartItemPrice}>Price: ${item.price}</p>
                  <p className={styles.cartItemQuantity}>
                    Quantity: {item.quantity}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </ul>
      </div>
    </RequireAuth>
  );
};

export default Cart;
