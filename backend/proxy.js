require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
  });
}

// Load environment variables
const PORT = process.env.PORT || 5000;
const API_BASE_URL = process.env.API_BASE_URL;
const PROJECT_ID = process.env.PROJECT_ID;
const API_KEY = process.env.API_KEY;

const FETCH_USER_DATA_URL = `${API_BASE_URL}/projects/${PROJECT_ID}/tables/DT17df762382dd3f3c/rows`;
const FETCH_ITEMS_DATA_URL = `${API_BASE_URL}/projects/${PROJECT_ID}/tables/DTb965fe028d603020/rows`;
const FETCH_CONTACT_URL = `${API_BASE_URL}/projects/${PROJECT_ID}/contacts`;
const OTP_GENERATE_URL = `${API_BASE_URL}/projects/${PROJECT_ID}/services/SVf48f1eddcbd5f9d0/invoke`;
const OTP_VALIDATE_URL = `${API_BASE_URL}/projects/${PROJECT_ID}/services/SV44a8ca886b47f4ae/invoke`;
const USER_REGISTER_URL = `${API_BASE_URL}/projects/${PROJECT_ID}/services/SVc6a0370d7991f0be/invoke`;
const REDEMPTION_URL = `${API_BASE_URL}/projects/${PROJECT_ID}/services/SV8350cdbe330192d3/invoke`;
const CALCULATED_REDEMPTION_URL = `${API_BASE_URL}/projects/${PROJECT_ID}/services/SV0d67ff9ea34e6989/invoke`;

// Helper function to create headers
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}`,
});

// Routes
app.get("/api/user-data", async (req, res) => {
  const { contact_id } = req.query;
  console.log("Fetching user data for contact_id:", contact_id);

  try {
    const response = await axios.get(
      `${FETCH_USER_DATA_URL}?contact_id=${contact_id}`,
      {
        headers: getHeaders(),
      }
    );

    console.log("Fetched User Data:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching user data:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/api/get-items", async (req, res) => {
  console.log("Fetching items data...");

  try {
    const response = await axios.get(FETCH_ITEMS_DATA_URL, {
      headers: getHeaders(),
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
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch items data" });
  }
});

app.get("/api/get-contactID", async (req, res) => {
  const { phone_number } = req.query;

  if (!phone_number) {
    return res.status(400).json({ error: "phone_number is required" });
  }

  console.log(`Fetching contact data for phone number: ${phone_number}`);

  try {
    const response = await axios.get(FETCH_CONTACT_URL, {
      headers: getHeaders(),
      params: { phone_number },
    });

    console.log("Fetched Contact Data:", response.data);

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
  console.log("Generating OTP for:", phone_number);

  try {
    const response = await axios.post(
      OTP_GENERATE_URL,
      {
        api_key: API_KEY,
        context: "contact",
        phone_number,
        variables: { name: "User" },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("OTP API Response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error generating OTP:",
      error.response?.data || error.message
    );
    res.status(500).send("Failed to send OTP");
  }
});

app.post("/validate-otp", async (req, res) => {
  const { phone_number, otp } = req.body;
  console.log("Validating OTP for:", phone_number);

  try {
    const response = await axios.post(
      OTP_VALIDATE_URL,
      { api_key: API_KEY, context: "contact", phone_number },
      { headers: { "Content-Type": "application/json" } }
    );

    const serverOtp = response.data.return_value;
    console.log("Server OTP:", serverOtp);

    if (otp === serverOtp) {
      res.json({ success: true, message: "OTP verified successfully!" });
    } else {
      res.status(401).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(
      "Error validating OTP:",
      error.response?.data || error.message
    );
    res.status(500).send("Failed to validate OTP");
  }
});

app.post("/register-user", async (req, res) => {
  const { phone_number, name, email, dob, age } = req.body;
  console.log("Registering user:", { phone_number, name, email, dob });

  try {
    const response = await axios.post(
      USER_REGISTER_URL,
      {
        api_key: API_KEY,
        context: "contact",
        phone_number,
        name,
        variables: { name, email, dob },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("User registration response:", response.data);
    res.json({
      success: true,
      message: "User registered successfully!",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error registering user:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.response?.data || error.message,
    });
  }
});

app.post("/redemption", async (req, res) => {
  const { phone_number, currentPoints, selectedItems } = req.body;
  console.log("Processing redemption for:", {
    phone_number,
    currentPoints,
    selectedItems,
  });

  try {
    const response = await axios.post(
      REDEMPTION_URL,
      {
        api_key: API_KEY,
        context: "contact",
        phone_number,
        variables: { currentPoints, selectedItems },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Redemption response:", response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(
      "Error processing redemption:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Redemption failed.",
      error: error.message,
    });
  }
});

app.post("/calculatedRedemption", async (req, res) => {
  const { phone_number, currentPoints, selectedItems } = req.body;
  console.log("Processing calculated redemption for:", {
    phone_number,
    currentPoints,
    selectedItems,
  });

  try {
    const response = await axios.post(
      CALCULATED_REDEMPTION_URL,
      {
        api_key: API_KEY,
        context: "contact",
        phone_number,
        variables: { currentPoints, selectedItems },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Calculated Redemption response:", response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(
      "Error processing calculated redemption:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Calculated redemption failed.",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
