// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // <--- QUAN TRỌNG: Thêm dòng này
  theme: {
    extend: {
      colors: {
        primary: "#00FF00", // Neon Green (Dùng cho Dark Mode)
        primaryDark: "#00b300", // Green đậm hơn (Dùng cho Light Mode để dễ đọc)
        dark: "#121212",
        light: "#f3f4f6", // Màu nền sáng (Gray-100)
      },
    },
  },
  plugins: [],
};
