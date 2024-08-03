export const fetchProductById = async (productId) => {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/${productId}`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
