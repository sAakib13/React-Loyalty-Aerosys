import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import logo from "../../assets/telerivetlogo.webp";
import { registerUser } from "../../utlis/registerUser";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Call the registerUser function with the form data
      const response = await registerUser({
        phone_number: formData.phone,
        name: formData.name,
        email: formData.email,
        dob: formData.dob,
      });

      // Check the response from the backend
      if (response.success && response.data.return_value === true) {
        setMessage({
          text: "User registered successfully!",
          type: "success",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else if (response.success && response.data.return_value === false) {
        setMessage({
          text: "You are already registered in the program.",
          type: "error",
        });
      } else {
        setMessage({
          text: "An unknown error occurred. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "Failed to register user. Please try again.",
        type: "error",
      });
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
      <div className="flex flex-col items-center justify-center sm:w-[100%] sm:bg-primary md:w-[100%] md:bg-primary lg:w-1/2 lg:bg-white">
        <div className="text-center">
          <div className="mb-1 sm:w-[100%] md:w-[100%] lg:w-0">
            <img src={logo} alt="Logo" className="mx-auto w-36" />
          </div>
        </div>
        <form
          className="flex w-full max-w-sm flex-col sm:px-7 md:gap-2 md:px-4 lg:gap-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center font-bold sm:mt-7 sm:text-2xl sm:text-white md:mt-7 md:text-2xl md:text-white lg:mt-0 lg:text-3xl lg:text-primary">
            Registration Form
          </h2>
          <div>
            <Label
              htmlFor="name"
              value="Name"
              className="sm:text-white md:text-white lg:text-black"
            />
            <TextInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              value="Email"
              className="sm:text-white md:text-white lg:text-black"
            ></Label>
            <TextInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="phone"
              value="Phone Number"
              className="sm:text-white md:text-white lg:text-black"
            ></Label>
            <TextInput
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="dob"
              value="Birth Date"
              className="sm:text-white md:text-white lg:text-black"
            ></Label>
            <TextInput
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div>
            <Label
              htmlFor="age"
              value="Age"
              className="sm:text-white md:text-white lg:text-black"
            />
            <TextInput
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div> */}
          <Button
            type="submit"
            className="bg-primary hover:bg-teal-600 sm:mt-4"
          >
            Register
          </Button>
          <div className="mt-2 text-center text-sm">
            <a
              href="/login"
              className="hover:underline sm:text-white sm:hover:text-black md:text-white md:hover:text-black lg:text-gray-500 lg:hover:text-teal-500"
            >
              Already have an account? Login Here
            </a>
          </div>
          {message.text && (
            <div
              className={`mt-4 rounded-lg p-2 text-center text-white ${
                message.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
