export const fetchAllProduct = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

fetchAllProduct().then((data) => console.log(data));
