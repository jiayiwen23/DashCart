import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import useFetchProducts from "../hooks/useFetchProducts";
import { useNavigate } from "react-router-dom";
import styles from "../components/ProductList/ProductList.module.css";

const SearchResult = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchItem = searchParams.get("q").toLocaleLowerCase() || "";

  const { products, loading, error } = useFetchProducts();
  const navigate = useNavigate();

  const filterProducts = useMemo(() => {
    if (!searchItem) return products;
    return products.filter((product) =>
      product.title.toLocaleLowerCase().includes(searchItem)
    );
  }, [products, searchItem]);

  if (loading) return <div>Loading ... </div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className={styles.section}>
      <h1>Search Results for: {searchItem}</h1>
      {filterProducts.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className={styles.productList}>
          {filterProducts.map((product) => (
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
      )}
    </div>
  );
};

export default SearchResult;