import { Navigate, useLocation } from "react-router-dom";
import { getToken, getRoleFromToken } from "../auth";

const getRoles = (token) => {
  try {
    const stored = JSON.parse(localStorage.getItem("roles") || "[]");
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {}

  const roleFromToken = getRoleFromToken(token);
  return roleFromToken ? [roleFromToken] : [];
};

export default function ProtectedRoute({ children, allowRoles = [] }) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRoles = getRoles(token);

  if (allowRoles.length) {
    const ok = allowRoles.some((r) => userRoles.includes(r));
    if (!ok) {
      return <Navigate to="/403" replace />;
    }
  }

  return children;
}
