// import React, { useEffect } from "react";
// import { useAuthToken } from "../AuthTokenContext";

// const addToCart = () => {
//   const { accessToken } = useAuthToken();

//   useEffect(() => {
//     async function createOrFetchCart() {
//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_API_URL}/create-cart`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken})`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to create or fetch cart");
//         }

//         const cart = await response.json();

//         console.log("Cart data", cart);
//       } catch (error) {
//         console.error("Error in creating or fetching cart:", error);
//       }
//     }
//     if (accessToken) {
//       createOrFetchCart();
//     }
//   }, [accessToken]);
//   return <div>addToCart</div>;
// };

// export default addToCart;

import { useCallback } from "react";
import { useAuthToken } from "../AuthTokenContext";

const useAddToCart = () => {
  const { accessToken } = useAuthToken();

  // Define the function that handles adding to cart
  const addToCart = useCallback(async () => {
    if (!accessToken) {
      console.error("No access token available.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/create-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create or fetch cart");
      }

      const cart = await response.json();
      console.log("Cart data:", cart);
      return cart;
    } catch (error) {
      console.error("Error in creating or fetching cart:", error);
    }
  }, [accessToken]);

  return addToCart;
};

export default useAddToCart;
