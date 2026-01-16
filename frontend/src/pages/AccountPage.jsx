import { NavLink, Outlet } from "react-router-dom";
import "../style/account.css";

export default function AccountPage() {
  return (
    <div className="account-wrapper">
      {/* SIDEBAR */}
      <aside className="account-sidebar">
        <h2 className="account-title">👤 Tài khoản</h2>

        <NavLink
          to="profile"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Thông tin cá nhân
        </NavLink>

        <NavLink
          to="bookings"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Lịch sử đặt xe
        </NavLink>
      </aside>

      {/* CONTENT */}
      <main className="account-content">
        <Outlet />
      </main>
    </div>
  );
}
