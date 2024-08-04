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
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      console.log("User must be authenticated to add items to the cart.");
      return;
    }
    addToCart(product.id, quantity)
      .then((response) => {
        console.log("Product added to cart successfully:", response);
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className={styles.productDetails}>
      <h1 className={styles.productTitle}>{product.title}</h1>
      <img
        src={product.image}
        alt={product.title}
        className={styles.productImage}
      />
      <p className={styles.productPrice}>${product.price}</p>
      <p className={styles.productDescription}>{product.description}</p>
      <div className={styles.productQuantity}>
        <button onClick={decrement} disabled={quantity === 1}>
          -
        </button>
        <span>{quantity}</span>
        <button onClick={increment}>+</button>
      </div>
      <RequireAuth>
        <button className={styles.addToCartButton} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </RequireAuth>
    </div>
  );
};

export default ProductDetails;
