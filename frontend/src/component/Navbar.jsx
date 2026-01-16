import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, logout } from "../auth";
import "../style/navbar.css";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const token = getToken();
  const role = localStorage.getItem("role"); // CUSTOMER | OWNER | DRIVER | ADMIN

  // ưu tiên fullName, fallback email
  const fullName = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const displayName = fullName || email || "Tài khoản";

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const onLogout = () => {
    logout();
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role");
    nav("/");
  };

  // ================= LOGIC: TRỞ THÀNH CHỦ XE =================
  const goBecomeOwner = () => {
    if (!token) {
      nav("/login", { state: { redirectTo: "/become-owner" } });
      return;
    }

    if (role === "OWNER") {
      nav("/owner/dashboard");
      return;
    }

    // CUSTOMER
    nav("/become-owner");
  };

  return (
    <nav className="navbar">
      {/* ========== LEFT ========== */}
      <div className="nav-left">
        <Link to="/" className="brand">
          <span className="brand-badge">C</span>
          Travel Car Rental
        </Link>
      </div>

      {/* ========== RIGHT ========= */}
      <div className="nav-right">
        <Link to="/">Giới thiệu</Link>

        <button className="nav-link-btn" onClick={goBecomeOwner}>
          Trở thành chủ xe
        </button>

        <span className="nav-divider" />

        {/* ========== CHƯA LOGIN ========== */}
        {!token && !isAuthPage && (
          <>
            <button className="nav-btn" onClick={() => nav("/register")}>
              Đăng ký
            </button>
            <button className="nav-btn" onClick={() => nav("/login")}>
              Đăng nhập
            </button>
          </>
        )}

        {/* ========== ĐANG Ở AUTH PAGE ========== */}
        {!token && isAuthPage && (
          <>
            <button className="nav-btn" onClick={() => nav("/register")}>
              Đăng ký
            </button>
            <button className="nav-btn" onClick={() => nav("/login")}>
              Đăng nhập
            </button>
          </>
        )}

        {/* ========== ĐÃ LOGIN ========== */}
        {token && (
          <>
            <span className="nav-user">{displayName}</span>
            <button className="nav-ghost" onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
