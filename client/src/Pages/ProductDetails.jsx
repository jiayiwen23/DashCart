import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import { fetchProductById } from "../Utils/fetchProductById";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProductDetails = async () => {
      const data = await fetchProductById(productId);
      setProduct(data);
    };
    getProductDetails();
  }, [productId]);

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
      <button className={styles.addToCartButton}>Add to Cart</button>
    </div>
  );
};

export default ProductDetails;
