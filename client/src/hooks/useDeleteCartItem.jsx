import { useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const useDeleteCartItem = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteCartItem = useCallback(
    async (itemId) => {
      setIsLoading(true);
      setError(null);

      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/cart-items/${itemId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete the cart item");
        }

        setIsLoading(false);
        return true;
      } catch (error) {
        setError(error.toString());
        setIsLoading(false);
        return false;
      }
    },
    [getAccessTokenSilently]
  );

  return {
    deleteCartItem,
    isLoading,
    error,
    setError,
  };
};

export default useDeleteCartItem;
