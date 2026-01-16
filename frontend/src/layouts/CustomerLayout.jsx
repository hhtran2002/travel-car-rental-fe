// frontend/src/layouts/CustomerLayout.jsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CustomerLayout() {
  const location = useLocation();

  // giữ giống Driver: reload không mất theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b0b]">
      {/* Header (mobile-first app vibe) */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0b0b0b]/80 backdrop-blur">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
            <h1 className="text-base font-extrabold text-gray-900 dark:text-white truncate">
              Travel Car Rental
            </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] hover:opacity-90 transition text-sm font-bold"
            title="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-md mx-auto px-4 py-4">
        <Outlet />
      </main>

      {/* Bottom Nav (simple) */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#0b0b0b]/90 backdrop-blur">
        <div className="max-w-md mx-auto px-4 py-3 grid grid-cols-2 gap-2">
          <Link
            to="/customer/trip"
            className={`py-3 rounded-xl text-center font-bold transition border ${
              isActive("/customer/trip")
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white dark:bg-[#121212] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800"
            }`}
          >
            🚗 Chuyến đi
          </Link>

          <Link
            to="/"
            className="py-3 rounded-xl text-center font-bold transition border bg-white dark:bg-[#121212] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:opacity-90"
          >
            🏠 Trang chủ
          </Link>
        </div>
      </nav>

      {/* Spacer để không bị che bởi bottom nav */}
      <div className="h-20" />
    </div>
  );
}
