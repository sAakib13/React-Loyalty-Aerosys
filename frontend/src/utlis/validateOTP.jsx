import axios from "axios";

export const validateOTP = async ({ phone_number, otp }) => {
  try {
    const response = await axios.post("http://localhost:5000/validate-otp", {
      phone_number,
      otp,
    });
    return response.data;
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw error;
  }
};
