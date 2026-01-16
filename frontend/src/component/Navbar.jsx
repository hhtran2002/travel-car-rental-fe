import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, logout } from "../auth";
import "../style/navbar.css";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const token = getToken();
  const role = localStorage.getItem("role"); // CUSTOMER | OWNER | DRIVER | ADMIN

  const onLogout = () => {
    logout();
    nav("/");
  };

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const openLoginModal = () => {
    nav("/login", { state: { backgroundLocation: location } });
  };

  const openRegisterModal = () => {
    nav("/register", { state: { backgroundLocation: location } });
  };

  // ✅ LOGIC CHÍNH: Trở thành chủ xe
  const goBecomeOwner = () => {
    if (!token) {
      // chưa login → login trước
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
    <div className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          <span className="brand-badge">C</span>
          Travel Car Rental
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/">Giới thiệu</Link>

        {/* ✅ sửa link thành button có logic */}
        <button className="nav-link-btn" onClick={goBecomeOwner}>
          Trở thành chủ xe
        </button>

        <span className="nav-divider" />

        {!token && !isAuthPage && (
          <>
            <button className="nav-btn" onClick={openRegisterModal}>
              Đăng ký
            </button>
            <button className="nav-btn" onClick={openLoginModal}>
              Đăng nhập
            </button>
          </>
        )}

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

        {token && (
          <button className="nav-ghost" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
