import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";
import { setToken } from "../auth";
import "../style/login.css";

function FacebookIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="#1877F2"
                d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.54-4.7c1.32 0 2.7.24 2.7.24v2.97h-1.52c-1.5 0-1.97.94-1.97 1.9v2.29h3.36l-.54 3.49h-2.82V24C19.61 23.1 24 18.1 24 12.07z"
            />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.45c-.24 1.25-1.46 3.67-5.45 3.67c-3.28 0-5.95-2.72-5.95-6.07S8.72 5.63 12 5.63c1.87 0 3.12.8 3.84 1.49l2.62-2.53C16.88 3.1 14.74 2 12 2C6.73 2 2.5 6.27 2.5 11.7S6.73 21.4 12 21.4c6.93 0 8.62-4.86 8.62-7.38c0-.5-.05-.88-.12-1.26H12z"
            />
        </svg>
    );
}

export default function Login() {
    const nav = useNavigate();
    const location = useLocation();

    // ✅ modal khi có backgroundLocation
    const isModal = Boolean(location.state?.backgroundLocation);
    const bgLocation = location.state?.backgroundLocation || location;


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // ✅ đảm bảo mặc định ẩn mật khẩu
    const [showPw, setShowPw] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [fieldErr, setFieldErr] = useState({ email: "", password: "" });
    const [apiErr, setApiErr] = useState("");

    const emailTrim = useMemo(() => email.trim(), [email]);

    const clearErrorsOnTyping = () => {
        if (apiErr) setApiErr("");
    };

    const validate = () => {
        const next = { email: "", password: "" };
        if (!emailTrim) next.email = "Email không được để trống";
        if (!password) next.password = "Mật khẩu không được để trống";
        setFieldErr(next);
        return !next.email && !next.password;
    };

    const submit = async (e) => {
        e.preventDefault();
        setApiErr("");

        if (!validate()) return;

        try {
            setSubmitting(true);

            const res = await api.post("/api/auth/login", {
                email: emailTrim,
                password,
            });

            setToken(res.data.token, {
                role: res.data.role,
                userId: res.data.userId,
                email: res.data.email,
            });

            // ✅ NOTE (CHANGED): lưu email để Navbar lấy hiển thị email
            localStorage.setItem("email", res.data.email || emailTrim);


            // điều hướng theo role (tuỳ bạn)
            const role = String(res.data.role || "").toLowerCase();
            if (role === "admin") nav("/admin/customers");
            else if (role === "driver") nav("/");     // tạm
            else if (role === "customer") nav("/");   // tạm
            else nav("/");

        } catch (err) {
            const msg = err?.response?.data?.message || "Đăng nhập thất bại";
            setApiErr(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const close = () => {
        if (isModal) {
            nav(bgLocation.pathname + (bgLocation.search || ""), { replace: true });
        } else {
            nav("/");
        }
    };


    // ✅ ESC để đóng modal cho giống web thật
    useEffect(() => {
        if (!isModal) return;
        const onKey = (e) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModal]);

    useEffect(() => {
        if (!isModal) return;

        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prev;
        };
    }, [isModal]);


    // ====== PHẦN UI CARD (dùng chung cho modal và page) ======
    const LoginCard = (
        <div className="login-card">
            <button className="login-close" onClick={close} type="button">
                ×
            </button>

            <div className="login-title">Đăng nhập</div>

            <form className="login-form" onSubmit={submit}>
                {/* EMAIL */}
                <div>
                    <div className="login-label">Email</div>
                    <input
                        className="login-input"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setFieldErr((p) => ({ ...p, email: "" }));
                            clearErrorsOnTyping();
                        }}
                        placeholder="Nhập email"
                        autoComplete="email"
                        spellCheck={false}
                    />
                    {fieldErr.email && <div className="field-error">{fieldErr.email}</div>}
                </div>

                {/* PASSWORD */}
                <div>
                    <div className="login-label">Mật khẩu</div>
                    <div className="pw-wrap">
                        <input
                            className="login-input"
                            type={showPw ? "text" : "password"}     // ✅ chỗ quyết định ẩn/hiện
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setFieldErr((p) => ({ ...p, password: "" }));
                                clearErrorsOnTyping();
                            }}
                            placeholder="Nhập mật khẩu"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="pw-toggle"
                            onClick={() => setShowPw((s) => !s)}
                            aria-label="toggle password"
                            title={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            👁️
                        </button>
                    </div>
                    {fieldErr.password && <div className="field-error">{fieldErr.password}</div>}
                </div>

                <div className="login-row">
                    <Link
                        className="login-forgot"
                        to="/forgot-password"
                        state={{ backgroundLocation: bgLocation }}
                    >
                        Quên mật khẩu?
                    </Link>

                </div>

                <button className="login-btn" disabled={submitting} type="submit">
                    {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                {apiErr && <div className="login-error">{apiErr}</div>}

                <div className="login-hint">
                    Bạn chưa là thành viên?{" "}
                    <Link to="/register" state={{ backgroundLocation: bgLocation }}>
                        Đăng ký ngay
                    </Link>
                </div>

                <div className="login-social">
                    <button type="button" className="social-btn" onClick={() => alert("Chưa hỗ trợ")}>
                        <FacebookIcon /> Facebook
                    </button>

                    <button type="button" className="social-btn" onClick={() => alert("Chưa hỗ trợ")}>
                        <GoogleIcon /> Google
                    </button>
                </div>
            </form>
        </div>
    );

    // ====== MODAL MODE (giống Mioto) ======
    if (isModal) {
        return (
            <div className="authModalOverlay" onMouseDown={close}>
                <div className="authModal" onMouseDown={(e) => e.stopPropagation()}>
                    {LoginCard}
                </div>
            </div>
        );
    }

    // ====== PAGE MODE (gõ /login trực tiếp) ======
    return (
        <div className="login-page">
            <div className="login-bg">
                <img
                    src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1600&auto=format&fit=crop"
                    alt="bg"
                />

                <div className="login-modal">{LoginCard}</div>
            </div>
        </div>
    );
}