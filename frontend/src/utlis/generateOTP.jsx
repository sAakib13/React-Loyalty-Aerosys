import axios from "axios";

export const generateOTP = async ({ phone_number }) => {
  try {
    const response = await axios.post("http://localhost:5000/generate-otp", { phone_number });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
