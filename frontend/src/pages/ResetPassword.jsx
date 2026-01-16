import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";

import "../style/login.css";
import "../style/register.css";
import bg from "../assets/xe.jpg";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export default function ResetPassword() {
    const nav = useNavigate();
    const location = useLocation();

    const isModal = Boolean(location.state?.backgroundLocation);
    const bgLocation = location.state?.backgroundLocation || location;

    const [form, setForm] = useState({
        email: location.state?.prefillEmail || "",
        token: "",
        newPassword: "",
    });

    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [ok, setOk] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        token: "",
        newPassword: "",
        confirmNewPassword: "",
        form: "",
    });

    const setField = (k, v) => {
        setForm((p) => ({ ...p, [k]: v }));
        setErrors((p) => ({ ...p, [k]: "", form: "" }));
        setOk("");
    };

    const validateClient = () => {
        const e = { email: "", token: "", newPassword: "", confirmNewPassword: "", form: "" };

        if (!form.email.trim()) e.email = "Email không được trống";
        else if (!EMAIL_RE.test(form.email.trim())) e.email = "Email không hợp lệ";

        if (!form.token.trim()) e.token = "OTP không được trống";


        if (!form.newPassword) e.newPassword = "Mật khẩu mới không được trống";
        else if (form.newPassword.length < 6) e.newPassword = "Mật khẩu mới tối thiểu 6 ký tự";

        if (!confirmNewPassword) e.confirmNewPassword = "Nhập lại mật khẩu không được trống";
        else if (confirmNewPassword !== form.newPassword) e.confirmNewPassword = "Mật khẩu nhập lại không khớp";


        setErrors(e);
        return Object.values(e).every((x) => !x);
    };

    // map đúng các message Postman: OTP đã hết hạn / đã dùng / không hợp lệ / Token không được trống / Email...
    const mapBackendToField = (msg = "") => {
        const m = String(msg || "").toLowerCase().trim();

        if (m.includes("email")) return { field: "email", msg };

        if (m.includes("token") || m.includes("otp")) return { field: "token", msg };

        if (m.includes("mật khẩu") || m.includes("mat khau") || m.includes("password"))
            return { field: "newPassword", msg };

        if (m.includes("body")) return { field: "form", msg };

        return { field: "form", msg: msg || "Có lỗi xảy ra" };
    };

    const setConfirm = (v) => {
        setConfirmNewPassword(v);
        setErrors((p) => ({ ...p, confirmNewPassword: "", form: "" }));
        setOk("");
    };


    const submit = async (e) => {
        e.preventDefault();
        setOk("");
        if (!validateClient()) return;

        setLoading(true);
        try {
            const payload = {
                email: form.email.trim().toLowerCase(),
                token: form.token.trim(),
                newPassword: form.newPassword,
            };

            const res = await api.post("/api/auth/reset-password", payload);

            // controller bạn trả {message: "..."}
            setOk(res?.data?.message || "Đặt lại mật khẩu thành công");
            setErrors({ email: "", token: "", newPassword: "", confirmNewPassword: "", form: "" });
            setConfirmNewPassword("");
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

    useEffect(() => {
        if (!isModal) return;
        const onKey = (e) => e.key === "Escape" && close();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModal]);

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

            <div className="mioto-title">Đặt lại mật khẩu</div>

            {errors.form ? <div className="mioto-alert">{errors.form}</div> : null}
            {ok ? <div className="mioto-alert">{ok}</div> : null}

            <form className="mioto-form" onSubmit={submit}>
                <div className="mioto-field">
                    <label>Email</label>
                    <input
                        className="mioto-input"
                        value={form.email}
                        onChange={(ev) => setField("email", ev.target.value)}
                        placeholder="Nhập email"
                        autoComplete="email"
                    />
                    {errors.email ? <div className="mioto-error">{errors.email}</div> : null}
                </div>

                <div className="mioto-field">
                    <label>OTP</label>
                    <input
                        className="mioto-input"
                        value={form.token}
                        onChange={(ev) => setField("token", ev.target.value)}
                        placeholder="Nhập OTP (6 số)"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                    />
                    {errors.token ? <div className="mioto-error">{errors.token}</div> : null}
                </div>

                <div className="mioto-field mioto-pass">
                    <label>Mật khẩu mới</label>
                    <input
                        className="mioto-input"
                        type={showPass ? "text" : "password"}
                        value={form.newPassword}
                        onChange={(ev) => setField("newPassword", ev.target.value)}
                        placeholder="Tối thiểu 6 ký tự"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        className="mioto-eye"
                        onClick={() => setShowPass((p) => !p)}
                        title={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                        👁
                    </button>
                    {errors.newPassword ? <div className="mioto-error">{errors.newPassword}</div> : null}
                </div>

                <div className="mioto-field mioto-pass">
                    <label>Nhập lại mật khẩu mới</label>
                    <input
                        className="mioto-input"
                        type={showPass ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(ev) => setConfirm(ev.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        autoComplete="new-password"
                    />
                    {errors.confirmNewPassword ? (
                        <div className="mioto-error">{errors.confirmNewPassword}</div>
                    ) : null}
                </div>


                <button className="mioto-btn" disabled={loading} type="submit">
                    {loading ? "Đang xử lý..." : "Xác nhận"}
                </button>

                <div className="mioto-footer" style={{ marginTop: 14 }}>
                    Chưa có OTP?{" "}
                    <Link
                        to="/forgot-password"
                        state={{ backgroundLocation: bgLocation, prefillEmail: form.email.trim() }}
                    >
                        Gửi lại OTP
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
