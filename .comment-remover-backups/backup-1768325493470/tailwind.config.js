/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        calPolyGreen: "#104D2F",
        pineGreen: "#0F6659",
        seaGreen: "#2B946F",
        orangePantone: "#FF6309",
        jet: "#2C2C2C",
      },
    },
  },
  plugins: [],
};
