"use client";
import { Button, Label, TextInput } from "flowbite-react";
import "../../index.css";
import logo from "../../assets/telerivetlogo.webp";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { generateOTP } from "../../utlis/generateOTP";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhoneNumber] = useState("");

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // navigate("/welcome")
  //   navigate("/welcome", { state: { phone } }); // Pass email to the welcome page
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Call the generateOTP function with the phone number
      const otpResponse = await generateOTP({
        phone_number: phone, // Pass the phone number dynamically
      });

      console.log("OTP Response:", otpResponse);
      // Navigate to the welcome page with phone state
      navigate("/otp", { state: { phone, otpData: otpResponse } });
    } catch (error) {
      console.error("Failed to generate OTP:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Section */}
      <div className="flex flex-col items-center justify-center bg-primary text-white sm:w-0 md:w-0 lg:w-1/2">
        <div className="text-center">
          <div className="mb-4">
            <a href="/">
              <img src={logo} alt="Logo" />
            </a>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex flex-col items-center justify-center sm:w-[100%] sm:bg-primary md:w-[100%] md:bg-primary lg:w-1/2 lg:bg-white">
        <div className="text-center">
          <div className="mb-4 sm:w-[100%] md:w-[100%] lg:w-0">
            <img src={logo} alt="Logo" className="mx-auto w-36" />
          </div>
        </div>
        <form
          className="flex w-full max-w-sm flex-col gap-6 sm:px-7 md:px-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center font-bold sm:mt-8 sm:text-2xl sm:text-white md:mt-8 md:text-2xl md:text-white lg:mt-0 lg:text-3xl lg:text-primary">
            Log in
          </h2>
          <div>
            <Label
              htmlFor="phonenumber"
              value="Phone Number"
              className="sm:text-white md:text-white lg:text-black"
            />
            <TextInput
              id="phonenumber"
              type="phonenumber"
              placeholder="+9779812345678"
              required
              style={{ backgroundColor: "white", color: "black" }}
              onChange={(e) => setPhoneNumber(e.target.value)} // Capture phonenumber input
            />
          </div>
          {/* <div>
            <Label htmlFor="password1" value="Password" />
            <TextInput
              id="password1"
              type="password"
              placeholder="Enter your Password"
              required
            />
          </div> */}
          <Button type="submit" className="bg-primary hover:bg-teal-600">
            Login
          </Button>
        </form>
        <div className="mt-4 text-sm">
          <a
            href="/register"
            className="hover:underline sm:text-white sm:hover:text-black md:text-white md:hover:text-black lg:text-gray-500 lg:hover:text-teal-500"
          >
            Don't have a account? Register Here
          </a>
        </div>
      </div>
    </div>
  );
}
