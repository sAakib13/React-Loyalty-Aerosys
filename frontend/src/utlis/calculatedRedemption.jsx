import axios from "axios";

export const calculatedRedemption = async ({
  phone_number,
  currentPoints,
  selectedItems,
}) => {
  try {
    const response = await axios.post("http://localhost:5000/calculatedRedemption", {
      phone_number,
      currentPoints,
      selectedItems,
    });
    return response.data;
  } catch (error) {
    console.error("Error during redemption:", error);
    throw error;
  }
};
