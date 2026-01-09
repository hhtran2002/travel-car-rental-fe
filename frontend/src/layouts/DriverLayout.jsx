// frontend/src/layouts/DriverLayout.jsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const DriverLayout = () => {
  const location = useLocation();

  // 1. Khởi tạo state từ localStorage (để F5 không bị mất)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // 2. useEffect để Add/Remove class 'dark' vào thẻ HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 3. Hàm chuyển đổi
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-[#00b300] dark:text-[#00FF00] border-b-2 border-[#00b300] dark:border-[#00FF00]"
      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white";

  return (
    // FIX QUAN TRỌNG: Xóa bg-[#121212] cứng, thay bằng logic dark:bg-...
    <div className="min-h-screen bg-gray-100 dark:bg-[#121212] text-gray-900 dark:text-white font-sans transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-wider">
            DRIVER{" "}
            <span className="text-[#00b300] dark:text-[#00FF00]">APP</span>
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex gap-6 font-medium">
              <Link
                to="/driver"
                className={`py-4 transition-colors ${isActive("/driver")}`}
              >
                Công việc
              </Link>
              <Link
                to="/driver/history"
                className={`py-4 transition-colors ${isActive(
                  "/driver/history"
                )}`}
              >
                Lịch sử
              </Link>
              <Link
                to="/driver/profile"
                className={`py-4 transition-colors ${isActive(
                  "/driver/profile"
                )}`}
              >
                Tài khoản
              </Link>
            </nav>

            {/* Nút Toggle Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-10 px-4 max-w-4xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout;
