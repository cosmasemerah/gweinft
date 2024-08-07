/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f1f5f9",
        secondary: "#e9e9e9",
        dark: "#070a13",
      },
      fontFamily: {
        mokoto: ["Mokoto"],
      },
    },
  },
  plugins: [],
};
