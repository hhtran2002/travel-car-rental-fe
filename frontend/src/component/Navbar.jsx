import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, logout } from "../auth";
import "../style/navbar.css";

export default function Navbar() {
    const nav = useNavigate();
    const location = useLocation();             //  lấy cả location
    const { pathname } = location;
    const token = getToken();

    const onLogout = () => {
        logout();
        localStorage.removeItem("email");
        localStorage.removeItem("fullName");
        nav("/");
    };

    const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password");

    const openLoginModal = () => {
        nav("/login", { state: { backgroundLocation: location } }); // ✅ quan trọng
    };

    const openRegisterModal = () => {
        nav("/register", { state: { backgroundLocation: location } });
    };


    // ✅ NOTE (CHANGED): lấy tên hiển thị -> ưu tiên fullName, không có thì dùng email
    const fullName = localStorage.getItem("fullName"); // nếu sau này backend login trả fullName thì bạn set vào đây
    const email = localStorage.getItem("email");
    const displayName = fullName || email || "Tài khoản";


    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className="brand">
                    <span className="brand-badge">C</span>
                    Travel Car Rental
                </Link>
            </div>

            <div className="nav-right">
                <Link to="/">Giới thiệu</Link>

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
<<<<<<< HEAD
                    <button className="nav-ghost" onClick={onLogout}>
                        Đăng xuất
                    </button>
=======
                    <>
                        <span className="nav-user" style={{ fontWeight: 700 }}>
                            {displayName}
                        </span>

                        <button className="nav-ghost" onClick={onLogout}>
                            Logout
                        </button>
                    </>
>>>>>>> origin/nhanh-feature-admincustomer_auth
                )}
            </div>
        </nav>
    );
}