import { Navigate } from "react-router-dom";
import { getToken, getRoleFromToken } from "../auth";

export default function ProtectedRoute({ children, allowRoles = [] }) {
    const token = getToken();
    if (!token) return <Navigate to="/login" replace />;

    const role = getRoleFromToken(token);
    if (allowRoles.length && role && !allowRoles.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}