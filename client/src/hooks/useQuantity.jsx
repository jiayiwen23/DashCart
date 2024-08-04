import { useState } from "react";

const useQuantity = (initialQuantity = 1) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return {
    quantity,
    increment,
    decrement,
  };
};

export default useQuantity;
