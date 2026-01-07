import { useState } from "react";
import { api } from "../api";
import "../style/form.css";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [err, setErr] = useState(null);
    const [ok, setOk] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setErr(null); setOk(null);

        try {
            const res = await api.post("/api/auth/reset-password", { email, token, newPassword });
            setOk(res.data.message || "Đặt lại mật khẩu thành công");
        } catch (e) {
            setErr(`${e.status} - ${e.message}`);
        }
    };

    return (
        <div className="card">
            <h2>Đặt lại mật khẩu</h2>

            {err && <div className="alert error">{err}</div>}
            {ok && <div className="alert ok">{ok}</div>}

            <form onSubmit={submit} className="form">
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>OTP</label>
                <input value={token} onChange={(e) => setToken(e.target.value)} />

                <label>Mật khẩu mới</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                <button className="btn primary">Reset</button>
            </form>
        </div>
    );
}