import { Link } from "react-router-dom";

export default function OwnerRegisterGuide() {
    return (
        <div className="card">
            <h2>Đăng ký chủ xe</h2>
            <p className="muted">
                Trang này “tham khảo kiểu bố cục Mioto”: rõ ràng, có bước hướng dẫn + CTA.
                Nội dung bạn có thể chỉnh theo yêu cầu báo cáo.
            </p>

            <h3>Yêu cầu cơ bản</h3>
            <ul>
                <li>Giấy tờ xe hợp lệ</li>
                <li>Thông tin liên hệ chính xác</li>
                <li>Hình ảnh xe (nếu sau này bạn làm chức năng upload)</li>
            </ul>

            <h3>Các bước</h3>
            <div className="grid3">
                <div className="feature">
                    <b>Bước 1</b>
                    <div className="muted">Tạo tài khoản (đăng ký).</div>
                </div>
                <div className="feature">
                    <b>Bước 2</b>
                    <div className="muted">Cung cấp thông tin chủ xe / xe.</div>
                </div>
                <div className="feature">
                    <b>Bước 3</b>
                    <div className="muted">Chờ duyệt và bắt đầu cho thuê.</div>
                </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <Link className="btn primary" to="/register">Bắt đầu đăng ký</Link>
                <Link className="btn" to="/login">Tôi đã có tài khoản</Link>
            </div>
        </div>
    );
}