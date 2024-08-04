export const updateCartItemQuantity = async (
  itemId,
  newQuantity,
  accessToken
) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/cart-items/${itemId}/update-quantity`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error updating item quantity: ${errorData.error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
