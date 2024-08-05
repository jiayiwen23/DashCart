import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./ProductDetails.module.css";
import useProductDetails from "../hooks/useProductDetails";
import RequireAuth from "../Utils/RequireAuth";
import useAddToCart from "../hooks/useAddToCart";
import useQuantity from "../hooks/useQuantity";

const ProductDetails = () => {
  const { productId } = useParams();
  const { product, loading, error } = useProductDetails(productId);
  const { isAuthenticated } = useAuth0();
  const { quantity, increment, decrement } = useQuantity();
  const [notification, setNotification] = useState('');
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      console.log("User must be authenticated to add items to the cart.");
      setNotification("Please log in!");
      return;
    }
    addToCart(product.id, quantity)
      .then((response) => {
        console.log("Product added to cart successfully:", response);
        setNotification("Product added to cart successfully!");
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  useEffect(() => {
    if (notification) {
      // Set a timer to clear the notification after 2 seconds
      const timer = setTimeout(() => {
        setNotification('');
      }, 2000);
      // Cleanup function to clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className={styles.productDetails}>
      <div className={styles.productImageColumn}> 
        <img
          src={product.image}
          alt={product.title}
          className={styles.productImage}
        />
      </div>
      <div className={styles.productInfoColumn}>
        <h1 className={styles.category}>{product.category}</h1>
        <h1 className={styles.productTitle}>{product.title}</h1>
        <p className={styles.productDescription}>{product.description}</p>
        <p className={styles.productPrice}>${product.price}</p>
        <div className={styles.quantitySelector}>
          <span>Quantity</span>
          <div className={styles.productQuantity}>
            <button onClick={decrement} disabled={quantity === 1}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={increment}>+</button>
          </div>
        </div>
        <RequireAuth>
          <button className={styles.addToCartButton} onClick={handleAddToCart}>
            Add to Cart
          </button>
        </RequireAuth>
        {notification && <div className={styles.notification}>{notification}</div>}
      </div>
    </div>
  );
};

export default ProductDetails;
