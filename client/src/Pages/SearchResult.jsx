import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import useFetchProducts from "../hooks/useFetchProducts";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Search Result for: {searchItem}</h1>
      {filterProducts.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {filterProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product-details/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={product.image} alt={product.title} />
              <div>{product.title}</div>
              <div>{product.price}</div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResult;
