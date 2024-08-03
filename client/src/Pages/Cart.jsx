import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import RequireAuth from "../Utils/RequireAuth";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  //   useEffect(() => {
  //     const fetchCartItems = async () =>
  //   })

  return (
    <RequireAuth>
      <div>
        <h1>Your cart</h1>
      </div>
    </RequireAuth>
  );
};

export default Cart;
