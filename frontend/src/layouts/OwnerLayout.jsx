import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OwnerLayout() {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#121212]">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Owner
            </div>
            <div className="text-lg font-extrabold text-gray-900 dark:text-white">
              Partner Console
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-bold"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 grid grid-cols-2 gap-3">
          <Link
            to="/owner/dashboard"
            className={`rounded-xl py-3 text-center font-bold text-sm ${
              isActive("/owner/dashboard")
                ? "bg-[#00b300] dark:bg-[#00FF00] text-white dark:text-black"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
          >
            Dashboard
          </Link>
          <button
            className="rounded-xl py-3 text-center font-bold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            onClick={() => alert("MVP: Coming Soon (Cars/Bookings)")}
          >
            Cars/Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
