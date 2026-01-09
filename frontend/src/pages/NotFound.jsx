import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="card">
            <h2>404 - Not Found</h2>
            <p className="muted">Trang bạn tìm không tồn tại.</p>
            <Link className="btn primary" to="/">Về trang chủ</Link>
        </div>
    );
}