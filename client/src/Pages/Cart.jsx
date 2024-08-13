import React from "react";
import RequireAuth from "../Utils/RequireAuth";
import useFetchCartItems from "../hooks/useFetchCartItems";
import { updateCartItemQuantity } from "../hooks/useCartItemQuantity";
import useDeleteCartItem from "../hooks/useDeleteCartItem";
import styles from "./Cart.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import { formatCurrency } from "../Utils/formatCurrency";
import { RiDeleteBin5Fill } from "react-icons/ri";

const Cart = () => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently, logout, user } = useAuth0();
  const { cartItems, isLoading, error, setCartItems } = useFetchCartItems(isAuthenticated);
  
  const { deleteCartItem, error: deleteError} = useDeleteCartItem();

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

  const handleDeleteItem = async (itemId) => {
    const success = await deleteCartItem(itemId);
    if (success) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.itemId !== itemId)
      );
    } else {
      console.error("Failed to delete item:", deleteError);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.cartContainer}>
        <h1>Start your journey now</h1>
        <button
          onClick={() => loginWithRedirect()}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
      >
        Log in
        </button>
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching cart items.</div>;

  return (
    <RequireAuth>
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
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.itemId, parseInt(e.target.value) || 1)}
                        className={styles.quantityInput}
                        min="1"
                      />
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
                  <button
                    onClick={() => handleDeleteItem(item.itemId)}
                    className={styles.deleteButton}
                     aria-label="Delete item"
                  >
                    <RiDeleteBin5Fill />
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.cartSummary}>
            <div className={styles.subtotal}>
              <span className={styles.subtotalLabel}>Subtotal</span>
              <span className={styles.subtotalAmount}>
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
