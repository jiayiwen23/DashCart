import React from "react";
import styles from "./ProductList.module.css";
import { useState, useEffect } from "react";
import { fetchAllProduct } from "../../Utils/fetchAllProduct";
import { useNavigate } from "react-router-dom";

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchAllProduct();
      setProducts(data);
    };
    getProducts();
  }, []);
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
          <p className={styles.productPrice}>{product.price}</p>
        </div>
      ))}
    </div>
  );
};
