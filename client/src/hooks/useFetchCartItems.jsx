import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const useFetchCartItems = (isAuthenticated) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/cart-items`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCartItems(
          data.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            productId: item.product.productId,
            title: item.product.title,
            price: item.product.price,
            image: item.product.image,
            category: item.product.category,
          }))
        );
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [isAuthenticated, getAccessTokenSilently]);

  return { cartItems, isLoading, error };
};

export default useFetchCartItems;
