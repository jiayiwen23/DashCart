import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./ProductDetails.module.css";
import { fetchProductById } from "../Utils/fetchProductById";
import RequireAuth from "../Utils/RequireAuth";
import useAddToCart from "../Utils/useAddToCart";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { isAuthenticated } = useAuth0();
  const addToCart = useAddToCart();

  useEffect(() => {
    const getProductDetails = async () => {
      const data = await fetchProductById(productId);
      setProduct(data);
    };
    getProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      console.log("User must be authenticated to add items to the cart.");
      return;
    }

    if (!product) {
      console.log("No product details available.");
      return;
    }

    const quantity = 1;

    addToCart(product.id, quantity)
      .then((cartItem) => {
        if (cartItem) {
          console.log("Product added to cart successfully:", cartItem);
        } else {
          console.log("Failed to add product to cart.");
        }
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  if (!product) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.productDetails}>
      <h1 className={styles.productTitle}>{product.title}</h1>
      <img
        src={product.image}
        alt={product.title}
        className={styles.productImage}
      />
      <p className={styles.productPrice}>${product.price}</p>
      <p className={styles.productDescription}> {product.description}</p>
      <RequireAuth>
        <button className={styles.addToCartButton} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </RequireAuth>
    </div>
  );
};

export default ProductDetails;
