import React from "react";
import RequireAuth from "../Utils/RequireAuth";
import useFetchCartItems from "../hooks/useFetchCartItems";

const Cart = () => {
  const { cartItems, isLoading, error } = useFetchCartItems();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching cart items.</div>;

  console.log(cartItems);

  return (
    <RequireAuth>
      <div>
        <h1>Your Cart</h1>
        <ul>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <li key={item.id}>
                Product ID: {item.productId}, Quantity: {item.quantity}
              </li>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </ul>
      </div>
    </RequireAuth>
  );
};

export default Cart;
