/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {

    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'tablet': '960px',
      // => @media (min-width: 960px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },

    extend: {
      colors: {
        "main-background":"#090013",
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
