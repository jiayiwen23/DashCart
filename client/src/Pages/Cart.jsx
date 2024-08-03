import React from "react";
import RequireAuth from "../Utils/RequireAuth";
import useFetchCartItems from "../hooks/useFetchCartItems";
import styles from "./Cart.module.css";

const Cart = () => {
  const { cartItems, isLoading, error } = useFetchCartItems();

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
