"use client";

import { Button, Checkbox, Dropdown, Avatar } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import userImage from "../../assets/user.png";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { redemption } from "../../utlis/redemption";
import { calculatedRedemption } from "../../utlis/calculatedRedemption";
import coin from "../../assets/coin.png";
import phoneIcon from "../../assets/phone.png";
import calendar from "../../assets/calendar.png";
import mail from "../../assets/mail.png";
import age from "../../assets/age.png";

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone } = location.state || {};

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [redemptionResults, setRedemptionResults] = useState([]);
  const [redemptionSummary, setRedemptionSummary] = useState(null);
  const [calculatedResults, setCalculatedResults] = useState(null);

  useEffect(() => {
    const fetchContactIdAndUserData = async () => {
      try {
        if (!phone) throw new Error("Phone number is not provided.");

        // Step 1: Fetch the contact ID using the phone number
        const contactResponse = await axios.get(
          "http://localhost:5000/api/get-contactID",
          { params: { phone_number: phone } },
        );

        if (contactResponse.data.data && contactResponse.data.data.length > 0) {
          const contactId = contactResponse.data.data[0].id;

          // Step 2: Use the fetched contact ID to retrieve user data
          const userResponse = await axios.get(
            "http://localhost:5000/api/user-data",
            { params: { contact_id: contactId } },
          );

          if (userResponse.data.data && userResponse.data.data.length > 0) {
            setUserData(userResponse.data.data[0]);
          } else {
            throw new Error("No user data found.");
          }
        } else {
          throw new Error("No contact ID found for this phone number.");
        }
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Error:", err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContactIdAndUserData();
  }, [phone]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/get-items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Failed to fetch items");
      }
    };

    fetchItems();
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    navigate("/");
  };

  const handleCheckboxChange = (id, item, points) => {
    const updatedItems = [...selectedItems];
    const index = updatedItems.findIndex((selected) => selected.id === id);

    if (index > -1) {
      updatedItems.splice(index, 1);
    } else {
      updatedItems.push({ id, item, points });
    }

    setSelectedItems(updatedItems);
  };

  const handleRedemption = async (event) => {
    event.preventDefault();

    const totalPoints = selectedItems.reduce(
      (acc, item) => acc + item.points,
      0,
    );

    if (userData?.vars?.points < totalPoints) {
      alert("Insufficient points to redeem the selected items.");
      return;
    }

    try {
      const redemptionResponse = await redemption({
        phone_number: userData?.from_number,
        currentPoints: userData?.vars?.points,
        selectedItems,
      });

      if (redemptionResponse.success) {
        const { results, finalResult } = redemptionResponse.data.return_value;
        setRedemptionResults(results);
        setRedemptionSummary(finalResult);
        alert("Redemption successful!");
      } else {
        throw new Error("Redemption response indicates failure.");
      }

      const calculatedResponse = await calculatedRedemption({
        phone_number: userData?.from_number,
        currentPoints: userData?.vars?.points,
        selectedItems,
      });

      setCalculatedResults(calculatedResponse);
      alert("Calculation successful!");
    } catch (err) {
      console.error(
        "Error during redemption:",
        err.response ? err.response.data : err.message,
      );
      alert("Failed to complete redemption or calculation.");
    }
  };

  const computeColumns = (numItems) => (numItems < 2 ? 1 : 2);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Main return block
  return (
    <div className="ssm:2 flex min-h-screen flex-col items-center bg-white from-gray-50 to-gray-100 md:p-2 lg:p-4">
      {/* Top Bar: Points and Dropdown */}
      <div className="flex w-full items-center justify-end gap-4 rounded-lg bg-white p-4">
        {/* Points Section */}
        <div className="flex items-center gap-2 rounded-md bg-gray-50 p-2 shadow-sm">
          <img src={coin} className="h-auto w-5" alt="Coin Icon" />
          <p className="text-md text-yellow-500 sm:font-semibold md:font-semibold lg:font-bold">
            {userData?.vars?.points || 0}
          </p>
        </div>

        {/* User Dropdown */}
        <div className="flex items-center gap-3">
          <span className="block text-sm font-medium text-gray-700">
            {userData?.vars?.email || "Username"}
          </span>
          <Dropdown
            inline
            label={
              <Avatar
                img={userImage}
                alt="User Avatar"
                rounded
                className="sm:w-6 md:w-6 lg:w-8"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium">
                <button
                  onClick={handleLogout}
                  className="rounded-md border-black bg-gray-200 px-3 py-1 text-black hover:bg-gray-300"
                >
                  Log Out
                </button>
              </span>
            </Dropdown.Header>
          </Dropdown>
        </div>
      </div>

      {/* Welcome Section */}
      <h1 className="mb-7 mt-8 font-extrabold capitalize text-primary sm:text-2xl md:text-4xl lg:text-5xl">
        Hello {userData?.vars?.email.split("@")[0] || "User"}, Welcome!
      </h1>

      {/* Rest of the Content */}
      <div>
        {/* User Details Section */}
        <div className="mx-auto overflow-hidden rounded-lg bg-gradient-to-br sm:max-w-2xl md:max-w-4xl lg:max-w-7xl">
          {/* Header Section */}
          <div className="bg-primary p-6 text-white">
            <h2 className="md:text-md font-semibold sm:text-sm lg:text-xl">
              Rewards
            </h2>
          </div>

          <div className="flex flex-col gap-6 p-6 md:flex-row">
            {/* My Points Section */}
            <div className="flex flex-1 flex-col">
              <h3 className="md:text-md font-bold text-primary sm:text-sm lg:text-lg">
                My Points
              </h3>
              <div className="mt-4 flex flex-grow flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm">
                <img
                  src={coin}
                  className="h-auto sm:w-6 md:w-8 lg:w-10"
                  alt="Coin Icon"
                />
                <p className="font-bold text-primary sm:text-2xl md:text-3xl lg:text-4xl">
                  {userData?.vars?.points || 0}
                </p>
                <p className="md:text-md mt-2 text-gray-600 sm:text-sm lg:text-lg">
                  Your Balance
                </p>
              </div>
            </div>

            {/* My Details Section */}
            <div className="flex flex-1 flex-col">
              <h3 className="md:text-md font-bold text-primary sm:text-sm lg:text-lg">
                My Details
              </h3>
              <div className="mt-4 flex-grow space-y-2 rounded-lg bg-white p-6 shadow-sm md:min-w-[24rem]">
                {[
                  {
                    label: "Phone Number:",
                    value: userData?.from_number || "N/A",
                    icon: phoneIcon,
                  },
                  {
                    label: "Date of Birth:",
                    value: userData?.vars?.dob || "N/A",
                    icon: calendar,
                  },
                  {
                    label: "Email:",
                    value: userData?.vars?.email || "N/A",
                    icon: mail,
                  },
                  {
                    label: "Age:",
                    value: userData?.vars?.age || "N/A",
                    icon: age,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between sm:gap-3 md:gap-3 lg:gap-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.icon}
                        className="h-auto sm:w-6 md:w-4 lg:w-6"
                        alt={`${item.label} icon`}
                      />
                      <p className="md:text-md font-semibold text-gray-700 sm:text-sm lg:text-lg">
                        {item.label}
                      </p>
                    </div>
                    <div className="rounded border-2 border-primary p-2 sm:min-w-[9rem] md:w-40 lg:w-40">
                      <p className="md:text-md font-semibold text-gray-700 sm:text-sm lg:text-lg">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {redemptionResults.length > 0 && (
            <div className="mt-6 flex flex-grow flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-bold text-primary">
                Redemption Results
              </h2>
              <ul className="space-y-3">
                <div
                  className="grid items-center justify-items-center gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${computeColumns(redemptionResults.length)}, minmax(0, 1fr))`,
                  }}
                >
                  {redemptionResults.map((result, index) => (
                    <li
                      key={index}
                      className="rounded-lg bg-primary p-3 text-white shadow-md"
                    >
                      <p className="text-md font-semibold">{result.item}</p>
                      <p className="text-sm">
                        Points Redeemed:{" "}
                        <span className="font-bold">{result.points}</span>
                      </p>
                      <p className="text-sm">{result.message}</p>
                    </li>
                  ))}
                </div>
              </ul>
              {redemptionSummary && (
                <div className="mt-4 text-center text-gray-700">
                  <p className="font-bold">
                    Total Points Redeemed:{" "}
                    {redemptionSummary.totalPointsRedeemed}
                  </p>
                  <p>Final Balance: {redemptionSummary.finalBalance}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mb-2 mt-4 pl-6 text-2xl font-bold text-primary">Redeem</p>
        <div className="flex items-center justify-center">
          {/* Redemption Form */}
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`relative flex w-72 flex-col items-center rounded-lg p-6 shadow-md ${
                  selectedItems.find((selected) => selected.id === item.id)
                    ? "bg-primary"
                    : "bg-white"
                }`}
              >
                {/* Item Image */}
                {/* <img
                src={reward}
                alt={item.item}
                className="w-full h-32 object-cover rounded-md mb-4"
              /> */}

                {/* Item Details */}
                <h3
                  className={`mb-2 text-xl font-bold text-gray-800 ${selectedItems.find((selected) => selected.id === item.id) ? "text-white" : "text-primary"}`}
                >
                  {item.item}
                </h3>
                <p
                  className={`mb-4 text-sm text-gray-600 ${selectedItems.find((selected) => selected.id === item.id) ? "text-white" : "text-gray-600"}`}
                >
                  <span
                    className={`font-bold text-primary ${selectedItems.find((selected) => selected.id === item.id) ? "text-white" : "text-primary"}`}
                  >
                    {item.points}
                  </span>{" "}
                  points
                </p>

                {/* Button logic changes */}
                <label
                  className={`${selectedItems.find((selected) => selected.id === item.id) ? "bg-white text-primary" : "bg-primary text-white"} flex cursor-pointer items-center gap-2 rounded-lg px-6 py-2 font-semibold`}
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={
                      selectedItems.find((selected) => selected.id === item.id)
                        ? true
                        : false
                    }
                    onChange={() =>
                      handleCheckboxChange(item.id, item.item, item.points)
                    }
                    style={{ display: "none" }}
                  />
                  {selectedItems.find((selected) => selected.id === item.id)
                    ? "Selected"
                    : "Select"}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Single Redeem Button */}
        <div className="item-center mb-6 mt-6 flex justify-center">
          <button
            onClick={handleRedemption}
            className="rounded-md bg-primary px-6 py-2 font-semibold text-white transition hover:bg-primary"
          >
            Redeem Selected Items
          </button>
        </div>
      </div>
    </div>
  );
}
