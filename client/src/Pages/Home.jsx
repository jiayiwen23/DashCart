import { useAuth0 } from "@auth0/auth0-react";
import { useSearchParams } from "react-router-dom";
import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import { fetchAllProduct } from "../Utils/fetchAllProduct";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchAllProduct();
      setProducts(data);
    };
    getProducts();
  }, []);
  return (
    <div className={styles.Home}>
      <h1>Today's trending products</h1>
      <div className={styles.productList}>
        {products.slice(0, 8).map((product) => (
          <div key={product.id} className={styles.productCard}>
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
    </div>
  );
}
