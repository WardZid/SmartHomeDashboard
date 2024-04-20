/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/views/*.{js,jsx,ts,tsx}",
    "./src/components/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: "#F05622",
        "dark-blue": "#042A35",
        "light-blue": "#42B6E9",
        "off-white": "#EEEEEE",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
