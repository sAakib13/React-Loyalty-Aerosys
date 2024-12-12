import axios from "axios";

export const redemption = async ({
  phone_number,
  currentPoints,
  selectedItems,
}) => {
  try {
    const response = await axios.post("http://localhost:5000/redemption", {
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
