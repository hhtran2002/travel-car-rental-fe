import { useState } from "react";
import { api } from "../api";
import "../style/form.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [err, setErr] = useState(null);
    const [ok, setOk] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setErr(null); setOk(null);

        try {
            const res = await api.post("/api/auth/forgot-password", { email });
            setOk(res.data.message || "Nếu email tồn tại, hệ thống đã gửi OTP.");
        } catch (e) {
            setErr(`${e.status} - ${e.message}`);
        }
    };

    return (
        <div className="card">
            <h2>Quên mật khẩu</h2>

            {err && <div className="alert error">{err}</div>}
            {ok && <div className="alert ok">{ok}</div>}

            <form onSubmit={submit} className="form">
                <label>Email</label>
                <input value={email} onChange={(ev) => setEmail(ev.target.value)} />
                <button className="btn primary">Gửi OTP</button>
            </form>

            <div className="muted" style={{ marginTop: 10 }}>
                Sau khi nhận OTP, sang trang Reset Password để nhập OTP.
            </div>
        </div>
    );
}