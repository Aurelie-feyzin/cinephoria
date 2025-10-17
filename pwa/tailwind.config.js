/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui"],
      },
      boxShadow: {
        card: "0px 0px 20px 0px rgba(0, 0, 0, 0.15)",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      minHeight: {
        24: "96px"
      },
      colors: {
        cyan: {
          500: "#46b6bf",
          700: "#0f929a",
          200: "#bceff3"
        },
        red: {
          500: "#ee4322"
        },
        black: "#1d1e1c",
        white: "#F8F6F0", // ##ffffff
        primary: "#2E4D34",
        primary_light: "#7E9276",
        secondary: "#C9A85C",
        custom_brown: "#7A5A3C",
        transparent: "transparent",
      },
    },
    container: {
      padding: "2rem",
      center: true,
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
