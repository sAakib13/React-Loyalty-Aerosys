import axios from "axios";

export const registerUser = async ({ phone_number, name, email, dob, age }) => {
  try {
    const response = await axios.post("http://localhost:5000/register-user", {
      phone_number,
      name,
      email,
      dob,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
