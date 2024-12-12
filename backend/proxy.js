const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
  });
}

const API_URL =
  "https://api.telerivet.com/v1/projects/PJb993879964086d72/services/SVa4c8ef67ab98ee8c/invoke";

const API_KEY = "maDfO_xfsRc3VEH7Dzzi7mll9slFHTgELpMK";

const FETCH_USER_DATA_URL =
  "https://api.telerivet.com/v1/projects/PJb993879964086d72/tables/DT932fc0bd7948618d/rows";

app.get("/api/user-data", async (req, res) => {
  const { contact_id } = req.query; // Expect contact_id to be passed as a query parameter

  console.log("Fetching user data for contact_id:", contact_id);

  try {
    const response = await axios.get(
      `${FETCH_USER_DATA_URL}?contact_id=${contact_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString(
            "base64"
          )}`,
        },
      }
    );

    console.log("Fetched User Data:", response.data); // Log the response data for debugging

    res.json(response.data); // Forward the API response to the client
  } catch (error) {
    console.error(
      "Error fetching user data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

const FETCH_ITEMS_DATA_URL =
  "https://api.telerivet.com/v1/projects/PJb993879964086d72/tables/DT2604fb24df89fbf2/rows";

app.get("/api/get-items", async (req, res) => {
  console.log("Fetching items data...");

  try {
    const response = await axios.get(FETCH_ITEMS_DATA_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}`,
      },
    });

    console.log("Fetched Items Data:", response.data);

    const formattedData = response.data.data.map((item) => ({
      id: item.vars.id,
      item: item.vars.item,
      points: item.vars.points,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(
      "Error fetching items data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch items data" });
  }
});

const FETCH_CONTACT_URL =
  "https://api.telerivet.com/v1/projects/PJb993879964086d72/contacts";

app.get("/api/get-contactID", async (req, res) => {
  const { phone_number } = req.query;

  if (!phone_number) {
    return res.status(400).json({ error: "phone_number is required" });
  }

  console.log(`Fetching contact data for phone number: ${phone_number}`);

  try {
    // Set up request configuration
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}`,
      },
      params: { phone_number }, // Use phone_number dynamically
    };

    // Make the API call
    const response = await axios.get(FETCH_CONTACT_URL, config);

    console.log("Fetched Contact Data:", response.data);

    // Return data as is or formatted if necessary
    res.json({
      success: true,
      data: response.data.data.map((contact) => ({
        id: contact.id,
        phone_number: contact.phone_number,
        name: contact.name || "Unknown",
      })),
    });
  } catch (error) {
    console.error(
      "Error fetching contact data:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Failed to fetch contact data",
      details: error.response?.data || error.message,
    });
  }
});

app.post("/generate-otp", async (req, res) => {
  const { phone_number } = req.body;

  console.log("Received request to generate OTP for:", phone_number); // Log the incoming request

  try {
    const response = await axios.post(
      API_URL,
      {
        api_key: API_KEY,
        context: "contact",
        phone_number: phone_number,
        variables: { name: "User" },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response for OTP:", response.data); // Log the Telerivet response
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error occurred:",
      error.response ? error.response.data : error.message
    ); // Log the error details
    res.status(500).send("Failed to send OTP");
  }
});

app.post("/validate-otp", async (req, res) => {
  const { phone_number, otp } = req.body; // Get phone_number and user-entered OTP from the request
  const API_URL_VALIDATE =
    "https://api.telerivet.com/v1/projects/PJb993879964086d72/services/SVbf918bf3363669c8/invoke";

  console.log("Validating OTP for:", phone_number);

  try {
    // Call the Telerivet API to validate the OTP
    const response = await axios.post(
      API_URL_VALIDATE,
      {
        api_key: API_KEY,
        context: "contact",
        phone_number: phone_number,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the return_value (the actual OTP sent by Telerivet)
    const serverOtp = response.data.return_value;

    console.log("Server OTP:", serverOtp);

    // Check if the user-provided OTP matches the server OTP
    if (otp === serverOtp) {
      res.json({ success: true, message: "OTP verified successfully!" });
    } else {
      res.status(401).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(
      "Error occurred:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Failed to validate OTP");
  }
});

app.post("/register-user", async (req, res) => {
  const { phone_number, name, email, dob, age } = req.body;

  const API_URL_ADD_USER =
    "https://api.telerivet.com/v1/projects/PJb993879964086d72/services/SV70a0b59d483d613c/invoke";

  console.log("Registering user:", { phone_number, name, email, dob });

  try {
    // Call the Telerivet API to add the user
    const response = await axios.post(
      API_URL_ADD_USER,
      {
        api_key: API_KEY,
        context: "contact",
        phone_number,
        name,
        variables: {
          name,
          email,
          dob,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("User added successfully to Telerivet:", response.data);

    // Respond with the full Telerivet API response
    res.json({
      success: true,
      message: "User registered successfully!",
      data: response.data, // Include the full API response
    });
  } catch (error) {
    console.error(
      "Error occurred:",
      error.response ? error.response.data : error.message
    );

    // Respond with error details
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.response ? error.response.data : error.message,
    });
  }
});

app.post("/redemption", async (req, res) => {
  const { phone_number, currentPoints, selectedItems } = req.body;

  console.log("Received Redemption Request:", {
    phone_number,
    currentPoints,
    selectedItems,
  });

  try {
    // Call the external API (e.g., Telerivet)
    const apiResponse = await axios.post(
      "https://api.telerivet.com/v1/projects/PJb993879964086d72/services/SV98e376b61115caec/invoke",
      {
        api_key: API_KEY, // Replace with your actual API key
        context: "contact",
        phone_number,
        variables: {
          currentPoints,
          selectedItems,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("External API response:", apiResponse.data);

    // Send the actual API response back to the client
    res.json({ success: true, data: apiResponse.data });
  } catch (error) {
    console.error("Error during redemption:", error);

    // Send error details to the client
    res.status(500).json({
      success: false,
      message: "Redemption failed.",
      error: error.message,
    });
  }
});

app.post("/calculatedRedemption", async (req, res) => {
  const { phone_number, currentPoints, selectedItems } = req.body;

  console.log("Received Redemption Request:", {
    phone_number,
    currentPoints,
    selectedItems,
  });

  try {
    // Call the external API (e.g., Telerivet)
    const apiResponse = await axios.post(
      "https://api.telerivet.com/v1/projects/PJb993879964086d72/services/SV2041e026e3027869/invoke",
      {
        api_key: API_KEY, // Replace with your actual API key
        context: "contact",
        phone_number,
        variables: {
          currentPoints,
          selectedItems,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("External API response:", apiResponse.data);

    // Send the actual API response back to the client
    res.json({ success: true, data: apiResponse.data });
  } catch (error) {
    console.error("Error during redemption:", error);

    // Send error details to the client
    res.status(500).json({
      success: false,
      message: "Redemption failed.",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000; // Use Railway's PORT or default to 5000
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
