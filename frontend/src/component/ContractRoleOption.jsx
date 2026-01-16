// src/component/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const currentRole = localStorage.getItem("role"); // bạn set lúc login/refresh

  if (!token) return <Navigate to="/login" replace />;

  // role có thể truyền string hoặc array
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(currentRole)) return <Navigate to="/" replace />;
  }

  return children;
}
