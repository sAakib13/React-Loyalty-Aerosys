const flowbite = require("flowbite/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                       // Include the main HTML file
    "./src/**/*.{js,jsx,ts,tsx}",         // Include all source files for Tailwind classes
    "./node_modules/flowbite/**/*.js",    // Include Flowbite's JavaScript for utility classes
  ],
  theme: {
    extend: {
      colors: {
        dark: "rgb(28, 28, 26)",          // Custom dark color
        primary: "rgb(21, 146, 209)",       // Custom hover color
        light: "#adb9c3",                 // Custom light color
      },
      fontFamily: {
        jost: ["Jost", "sans-serif"],     // Add custom Jost font family
      },
      fontSize: {
        tiny: "20px",                     // Custom tiny font size
        xxl: "32px",                      // Custom extra-large font size
        huge: "68px",                     // Custom huge font size
      },
      screens: {
        sm: '298px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [
    flowbite,                              // Enable Flowbite plugin
  ],
};
