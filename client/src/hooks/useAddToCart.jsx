// import { useCallback } from "react";
// import { useAuthToken } from "../AuthTokenContext";

// const useAddToCart = () => {
//   const { accessToken } = useAuthToken();

//   const addToCart = useCallback(
//     async (productId, quantity = 1) => {
//       if (!accessToken) {
//         console.error("No access token available.");
//         return;
//       }

//       if (!productId) {
//         console.error("Product ID is required to add to cart.");
//         return;
//       }

//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_API_URL}/add-item`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//             },
//             body: JSON.stringify({ productId, quantity }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Failed to add item to cart: ${response.status} ${response.statusText}`
//           );
//         }

//         const cartItem = await response.json();
//         console.log("Item added to cart:", cartItem);
//         return cartItem;
//       } catch (error) {
//         console.error("Error in adding item to cart:", error);
//       }
//     },
//     [accessToken]
//   );

//   return addToCart;
// };

// export default useAddToCart;

import { useCallback } from "react";
import { useAuthToken } from "../AuthTokenContext";

const useAddToCart = () => {
  const { accessToken } = useAuthToken();

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!accessToken) {
        console.error("No access token available.");
        return null;
      }

      if (!productId) {
        console.error("Product ID is required to add to cart.");
        return null;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/add-item`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ productId, quantity }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to add item to cart: ${response.status} ${response.statusText}`
          );
        }

        const { item, product } = await response.json();
        console.log("Item added to cart:", { item, product });
        return { item, product }; // Return both cart item and product details to the caller
      } catch (error) {
        console.error("Error in adding item to cart:", error);
        return null;
      }
    },
    [accessToken]
  );

  return addToCart;
};

export default useAddToCart;
