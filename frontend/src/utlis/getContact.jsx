import axios from "axios";

export const getContact = async ({ phone_number }) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/get-contactID",
      {
        params: { phone_number }, // Pass phone_number as a query parameter
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error getting contact:",
      error.response?.data || error.message,
    );
    throw error; // Re-throw the error to let the caller handle it
  }
};
