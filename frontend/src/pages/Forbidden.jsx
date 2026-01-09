import { Link } from "react-router-dom";

export default function Forbidden() {
    return (
        <div className="card">
            <h2>403 - Forbidden</h2>
            <p>Bạn không có quyền truy cập.</p>
            <Link to="/login">Về trang đăng nhập</Link>
        </div>
    );
}