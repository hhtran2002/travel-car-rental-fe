/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#00FF00",
        primaryDark: "#00b300",
        dark: "#121212",
        light: "#f3f4f6",
      },
    },
  },
  plugins: [],
};
