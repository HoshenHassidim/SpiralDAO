/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#000000",
        secondary: "#F5DEB3",
        "tech-blue": "#007BFF",
        "future-neon": "#8A2BE2",
        "growth-green": "#28A745",
        "community-coral": "#FF6347",
        "democracy-beige": "#F5DEB3",
        "neutral-gray": "#2C2C2C",
      },
      fontFamily: {
        primary: ["Roboto", "sans-serif"],
        secondary: ["Lato", "sans-serif"],
      },
      spacing: {
        72: "18rem",
        80: "20rem",
        88: "22rem",
        96: "24rem",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
