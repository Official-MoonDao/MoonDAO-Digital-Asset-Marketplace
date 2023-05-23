/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "moon-orange": "#F9B95C",
        "moon-secondary": "#D7594F",
        "moon-gold": "#F9B95C",
        "moon-white": "#E9E9F9"
      },
      fontFamily: {
        GoodTimes: ["Good Times", "sans-serif"],
      },
    },
  },
};
