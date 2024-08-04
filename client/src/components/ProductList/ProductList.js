import React from "react";
import styles from "./ProductList.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchProducts from "../../hooks/useFetchProducts";

const ProductList = () => {
  const { products, loading, error } = useFetchProducts();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.productList}>
      {products.slice(0, 8).map((product) => (
        <div
          className={styles.productCard}
          key={product.id}
          onClick={() => navigate(`/product-details/${product.id}`)}
        >
          <img
            src={product.image}
            alt={product.title}
            className={styles.productImage}
          />
          <p className={styles.productTitle}>{product.title}</p>
          <p className={styles.productPrice}>${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
