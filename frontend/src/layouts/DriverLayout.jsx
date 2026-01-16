// frontend/src/layouts/DriverLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const DriverLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // 👉 LOGOUT
  const handleLogout = () => {
    if (!window.confirm("Bạn có chắc chắn muốn đăng xuất?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user"); // nếu có
    navigate("/login", { replace: true });
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-[#00b300] dark:text-[#00FF00] border-b-2 border-[#00b300] dark:border-[#00FF00]"
      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#121212] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-wider">
            DRIVER{" "}
            <span className="text-[#00b300] dark:text-[#00FF00]">APP</span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex gap-6 font-medium">
              <Link to="/driver" className={`py-4 ${isActive("/driver")}`}>
                Công việc
              </Link>
              <Link
                to="/driver/history"
                className={`py-4 ${isActive("/driver/history")}`}
              >
                Lịch sử
              </Link>
              <Link
                to="/driver/profile"
                className={`py-4 ${isActive("/driver/profile")}`}
              >
                Tài khoản
              </Link>
            </nav>

            {/* Toggle Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
              title="Đổi giao diện"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* 🔴 Logout */}
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-semibold rounded-md
                         bg-red-500 text-white hover:bg-red-600 transition"
              title="Đăng xuất"
            >
              Đăng xuất
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
