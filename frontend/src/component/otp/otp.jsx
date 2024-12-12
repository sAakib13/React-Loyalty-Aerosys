import React from "react";
import { Button, Label, TextInput } from "flowbite-react";
import logo from "../../assets/telerivetlogo.webp";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { validateOTP } from "../../utlis/validateOTP";

const OTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const { phone, otpData } = state || {};
  const {
    return_value: otpCode,
    // log_entries: logEntries,
    // sent_messages: sentMessages,
  } = otpData || {};

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Call the validateOTP function with the phone number and entered OTP
      const otpResponse = await validateOTP({ phone_number: phone, otp });

      if (otpResponse.success) {
        console.log("OTP verified successfully!");
        navigate("/menu", { state: { phone } }); // Navigate to the welcome page
      } else {
        console.error("Invalid OTP:", otpResponse.message);
      }
    } catch (error) {
      console.error("Failed to validate OTP:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Section */}
      <div className="flex flex-col items-center justify-center bg-primary text-white sm:w-0 md:w-0 lg:w-1/2">
        <div className="text-center">
          <div className="mb-4">
            <img src={logo} alt="Logo" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center sm:w-[100%] sm:bg-primary md:w-[100%] md:bg-primary lg:w-1/2 lg:bg-white">
        <div className="text-center">
          <div className="mb-4 sm:w-[100%] md:w-[100%] lg:w-0">
            <img src={logo} alt="Logo" className="mx-auto w-36" />
          </div>
        </div>
        <p className="text-lg font-medium text-gray-700">
          Phone Number: {phone}
        </p>

        {otpCode ? (
          <div className="m-4 mt-5 rounded-md bg-green-100 p-4">
            <h2 className="text-xl font-bold text-green-700">
              Your OTP Code: {otpCode}
            </h2>
          </div>
        ) : (
          <div className="mt-5 text-red-700">
            <p className="font-medium">
              OTP Data is not available. Please try again.
            </p>
          </div>
        )}

        <form
          className="flex w-full max-w-sm flex-col gap-6 sm:px-7 md:px-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center font-bold sm:mt-8 sm:text-2xl sm:text-white md:mt-8 md:text-2xl md:text-white lg:mt-0 lg:text-3xl lg:text-primary">
            Enter Your OTP{" "}
          </h2>
          <div>
            <Label
              htmlFor="otp"
              value="Enter the OTP sent to you"
              className="sm:text-white md:text-white lg:text-black"
            />
            <TextInput
              id="otp"
              type="otp"
              required
              style={{ backgroundColor: "white", color: "black" }}
              onChange={(e) => setOtp(e.target.value)} // Capture phonenumber input
            />
          </div>

          <Button type="submit" className="bg-primary hover:bg-teal-600">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OTP;
