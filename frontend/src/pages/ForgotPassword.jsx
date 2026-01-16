import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";

import "../style/login.css";      // dùng authModalOverlay/authModal
import "../style/register.css";   // dùng mioto-modal/mioto-input/mioto-btn/mioto-error/mioto-alert...
import bg from "../assets/xe.jpg";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export default function ForgotPassword() {
    const nav = useNavigate();
    const location = useLocation();

    const isModal = Boolean(location.state?.backgroundLocation);
    const bgLocation = location.state?.backgroundLocation || location;

    const [email, setEmail] = useState(location.state?.prefillEmail || "");
    const [loading, setLoading] = useState(false);

    const [ok, setOk] = useState("");
    const [errors, setErrors] = useState({ email: "", form: "" });

    const setField = (v) => {
        setEmail(v);
        setErrors((p) => ({ ...p, email: "", form: "" }));
        setOk("");
    };

    const validateClient = () => {
        const e = { email: "", form: "" };

        if (!email.trim()) e.email = "Email không được trống";
        else if (!EMAIL_RE.test(email.trim())) e.email = "Email không hợp lệ";

        setErrors(e);
        return !e.email && !e.form;
    };

    const mapBackendToField = (msg = "") => {
        const m = String(msg || "").toLowerCase().trim();

        if (m.includes("email")) return { field: "email", msg };
        if (m.includes("body")) return { field: "form", msg };

        return { field: "form", msg: msg || "Có lỗi xảy ra" };
    };

    const submit = async (e) => {
        e.preventDefault();
        setOk("");
        if (!validateClient()) return;

        setLoading(true);
        try {
            const res = await api.post("/api/auth/forgot-password", {
                email: email.trim().toLowerCase(),
            });

            // backend bạn trả message như postman
            setOk(res?.data?.message || "Nếu email tồn tại, hệ thống đã gửi OTP đặt lại mật khẩu.");
            setErrors({ email: "", form: "" });
        } catch (err) {
            const mapped = mapBackendToField(err?.message);
            setErrors((p) => ({ ...p, [mapped.field]: mapped.msg }));
        } finally {
            setLoading(false);
        }
    };

    

    const close = () => {
        if (isModal) {
            nav(bgLocation.pathname + (bgLocation.search || ""), { replace: true });
        } else {
            nav("/");
        }
    };

    // ESC đóng modal
    useEffect(() => {
        if (!isModal) return;
        const onKey = (e) => e.key === "Escape" && close();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModal]);

    // khóa scroll khi mở modal
    useEffect(() => {
        if (!isModal) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = prev);
    }, [isModal]);

    const Card = (
        <div className="mioto-modal" style={{ width: 560, maxWidth: "92vw" }}>
            <button className="mioto-close" onClick={close} type="button">
                ✕
            </button>

            <div className="mioto-title">Quên mật khẩu</div>

            {errors.form ? <div className="mioto-alert">{errors.form}</div> : null}
            {ok ? <div className="mioto-alert">{ok}</div> : null}

            <form className="mioto-form" onSubmit={submit}>
                <div className="mioto-field">
                    <label>Email</label>
                    <input
                        className="mioto-input"
                        value={email}
                        onChange={(ev) => setField(ev.target.value)}
                        placeholder="Nhập email của bạn"
                        autoComplete="email"
                    />
                    {errors.email ? <div className="mioto-error">{errors.email}</div> : null}
                </div>

                <button className="mioto-btn" disabled={loading} type="submit">
                    {loading ? "Đang gửi..." : "Tiếp tục"}
                </button>

                <div className="mioto-footer" style={{ marginTop: 14 }}>
                    Đã có OTP?{" "}
                    <Link
                        to="/reset-password"
                        state={{ backgroundLocation: bgLocation, prefillEmail: email.trim() }}
                    >
                        Đặt lại mật khẩu
                    </Link>
                </div>
            </form>
        </div>
    );

    if (isModal) {
        return (
            <div className="authModalOverlay" onMouseDown={close}>
                <div className="authModal" onMouseDown={(e) => e.stopPropagation()}>
                    {Card}
                </div>
            </div>
        );
    }

    return (
        <div className="mioto-auth-wrap" style={{ backgroundImage: `url(${bg})` }}>
            {Card}
        </div>
    );
}
