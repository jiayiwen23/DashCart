import React, { useEffect, useState } from "react";
import styles from "./ProductList.module.css";
import { useNavigate } from "react-router-dom";
import useFetchProducts from "../../hooks/useFetchProducts";
import useFetchCartItems from "../../hooks/useFetchCartItems";
import { useAuth0 } from "@auth0/auth0-react";

const ProductList = () => {
  const { isAuthenticated } = useAuth0();
  const { products, loading, error } = useFetchProducts();
  const { cartItems } = useFetchCartItems(isAuthenticated);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getTrendingProducts = () => {
      const categoryMap = new Map();

      products.forEach((product) => {
        if (!categoryMap.has(product.category)) {
          categoryMap.set(product.category, []);
        }
        categoryMap.get(product.category).push(product);
      });

      let trendingProducts = [];
      for (let [category, items] of categoryMap.entries()) {
        trendingProducts = [...trendingProducts, ...items.slice(0, 2)];
        if (trendingProducts.length >= 8) break;
      }

      return trendingProducts;
    };

    const getRecommendedProducts = () => {
      const cartCategories = cartItems.map((item) => item.category);
      return products.filter((product) =>
        cartCategories.includes(product.category)
      );
    };

    setTrendingProducts(getTrendingProducts());

    if (isAuthenticated && cartItems.length > 0) {
      setRecommendedProducts(getRecommendedProducts());
    }
  }, [isAuthenticated, products, cartItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {isAuthenticated && recommendedProducts.length > 0 && (
        <div className={styles.section}>
          <h2>Recommended for You</h2>
          <div className={styles.productList}>
            {recommendedProducts.map((product) => (
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
        </div>
      )}

    <div className={styles.section}>
        <h2>Today's Trending Products</h2>
        <div className={styles.productList}>
          {trendingProducts.map((product) => (
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
      </div>
    </>
  );
};

export default ProductList;