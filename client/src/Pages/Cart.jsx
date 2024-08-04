import React from "react";
import RequireAuth from "../Utils/RequireAuth";
import useFetchCartItems from "../hooks/useFetchCartItems";
import { updateCartItemQuantity } from "../hooks/useCartItemQuantity";
import styles from "./Cart.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import { formatCurrency } from "../Utils/formatCurrency";

const Cart = () => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();
  const { cartItems, isLoading, error, setCartItems } =
    useFetchCartItems(isAuthenticated);

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const accessToken = await getAccessTokenSilently();
      await updateCartItemQuantity(itemId, newQuantity, accessToken);

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

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

  return (
    <RequireAuth>
      <div className={styles.cartContainer}>
        <h1 className={styles.cartTitle}>Your Cart</h1>
        {cartItems.length > 0 ? (
          <>
            <ul className={styles.cartList}>
              {cartItems.map((item) => (
                <li key={item.itemId} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h2 className={styles.itemTitle}>{item.title}</h2>
                    <p className={styles.itemPrice}>
                      {formatCurrency(item.price)}
                    </p>
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.itemId, item.quantity - 1)
                        }
                        className={styles.quantityButton}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.itemId, item.quantity + 1)
                        }
                        className={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.cartSummary}>
              <div className={styles.subtotal}>
                <span>Subtotal:</span>
                <span>
                  {formatCurrency(
                    cartItems.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
              <button className={styles.checkoutButton}>
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <p className={styles.emptyCart}>Your cart is empty.</p>
        )}
      </div>
    </RequireAuth>
  );
};

export default Cart;
