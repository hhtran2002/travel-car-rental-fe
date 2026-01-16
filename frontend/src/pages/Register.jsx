import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";

import "../style/login.css";     // ✅ dùng overlay modal giống Login
import "../style/register.css";
import bg from "../assets/xe.jpg";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^0\d{9,10}$/;

export default function Register() {
    const nav = useNavigate();
    const location = useLocation();

    const isModal = Boolean(location.state?.backgroundLocation);
    const bgLocation = location.state?.backgroundLocation || location;

    const [form, setForm] = useState({
        phone: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        referralCode: "",
        agree: true,
    });

    const [showPass, setShowPass] = useState({
        password: false,
        confirmPassword: false,
    });

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        phone: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: "",
        form: "",
    });

    const setField = (key, value) => {
        setForm((p) => ({ ...p, [key]: value }));
        setErrors((p) => ({ ...p, [key]: "", form: "" }));
    };

    const validateClient = () => {
        const e = {
            phone: "",
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            agree: "",
            form: "",
        };

        if (!form.fullName.trim()) e.fullName = "Họ tên không được trống";

        if (!form.email.trim()) e.email = "Email không được trống";
        else if (!EMAIL_RE.test(form.email.trim())) e.email = "Email không hợp lệ";

        if (!form.password) e.password = "Mật khẩu không được trống";
        else if (form.password.length < 6) e.password = "Mật khẩu tối thiểu 6 ký tự";

        if (!form.confirmPassword) e.confirmPassword = "Mật khẩu nhập lại không được trống";
        else if (form.confirmPassword !== form.password) e.confirmPassword = "Mật khẩu nhập lại không khớp";

        if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) {
            e.phone = "Số điện thoại không hợp lệ";
        }

        if (!form.agree) e.agree = "Bạn cần đồng ý với chính sách & quy định";

        setErrors(e);
        return Object.values(e).every((x) => !x);
    };

    // ✅ NOTE (CHANGED): map lỗi backend “mềm” theo status + includes (bền hơn ===)
    const mapBackendMessageToField = (msg = "", status) => {
        const m = String(msg || "").toLowerCase().trim();

        // ✅ bắt lỗi trùng dữ liệu dù status/message kiểu gì
        const isDuplicate =
            status === 409 ||
            m.includes("tồn tại") ||
            m.includes("exists") ||
            m.includes("duplicate");

        if (isDuplicate) {
            if (m.includes("email")) return { field: "email", msg };
            if (m.includes("số điện thoại") || m.includes("so dien thoai") || m.includes("phone"))
                return { field: "phone", msg };
            return { field: "form", msg };
        }

        // validate
        if (m.includes("họ tên") || m.includes("ho ten") || m.includes("fullname"))
            return { field: "fullName", msg };

        if (m.includes("email")) return { field: "email", msg };

        if (m.includes("mật khẩu") || m.includes("mat khau") || m.includes("password"))
            return { field: "password", msg };

        if (m.includes("body")) return { field: "form", msg };

        return { field: "form", msg: msg || "Có lỗi xảy ra" };
    };



    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateClient()) return;

        setLoading(true);
        try {
            const payload = {
                fullName: form.fullName.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
            };
            if (form.phone.trim()) payload.phone = form.phone.trim();

            await api.post("/auth/register", payload);

            if (isModal) {
                nav("/login", { state: { backgroundLocation: bgLocation }, replace: true });
            } else {
                nav("/login", { replace: true });
            }
        } catch (err) {
            // ✅ ưu tiên err.status/err.data vì interceptor đã normalize
            const status = err?.status ?? err?.response?.status;
            const data = err?.data ?? err?.response?.data;

            const fieldBag =
                (data?.errors && typeof data.errors === "object" && data.errors) ||
                (data?.fieldErrors && typeof data.fieldErrors === "object" && data.fieldErrors);

            if (fieldBag) {
                setErrors((p) => ({ ...p, ...fieldBag, form: "" }));
                return;
            }


            const msg =
                err?.message ||                 // ✅ message từ normalizeApiError
                data?.message ||
                data?.msg ||
                data?.detail ||
                data?.errorMessage ||
                "";

            const finalMsg = msg || (status === 409 ? "Dữ liệu đã tồn tại" : "Có lỗi xảy ra");

            const mapped = mapBackendMessageToField(finalMsg, status);
            setErrors((p) => ({ ...p, [mapped.field]: mapped.msg }));
        }
        finally {
            setLoading(false);
        }
    };


    const canSubmit = useMemo(() => {
        return (
            form.fullName.trim() &&
            form.email.trim() &&
            form.password &&
            form.confirmPassword &&
            form.agree
        );
    }, [form]);

    const close = () => {
        if (isModal) {
            nav(bgLocation.pathname + (bgLocation.search || ""), { replace: true });
        } else {
            nav("/");
        }
    };


    // ✅ ESC đóng modal giống Login
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

        return () => {
            document.body.style.overflow = prev;
        };
    }, [isModal]);


    // ====== CARD (nội dung form) ======
    const RegisterCard = (
        <div className="mioto-modal">
            <button className="mioto-close" onClick={close} type="button">
                ✕
            </button>

            <div className="mioto-title">Đăng ký</div>

            {errors.form ? <div className="mioto-alert">{errors.form}</div> : null}

            <form className="mioto-form" onSubmit={onSubmit}>
                <div className="mioto-field">
                    <label>Số điện thoại</label>
                    <input
                        className="mioto-input"
                        value={form.phone}
                        onChange={(ev) => setField("phone", ev.target.value)}
                        placeholder="Ví dụ: 0912356789"
                        autoComplete="tel"
                        inputMode="numeric" // ✅ NOTE (optional): mobile hiện bàn phím số
                    />
                    {errors.phone ? <div className="mioto-error">{errors.phone}</div> : null}
                </div>

                <div className="mioto-field">
                    <label>Họ và tên</label>
                    <input
                        className="mioto-input"
                        value={form.fullName}
                        onChange={(ev) => setField("fullName", ev.target.value)}
                        placeholder="Ví dụ: Thạch Ly An"
                        autoComplete="name"
                    />
                    {errors.fullName ? <div className="mioto-error">{errors.fullName}</div> : null}
                </div>

                <div className="mioto-field">
                    <label>Email</label>
                    <input
                        className="mioto-input"
                        value={form.email}
                        onChange={(ev) => setField("email", ev.target.value)}
                        placeholder="Ví dụ: anly@gmail.com"
                        autoComplete="email"
                    />
                    {errors.email ? <div className="mioto-error">{errors.email}</div> : null}
                </div>

                <div className="mioto-field mioto-pass">
                    <label>Mật khẩu</label>
                    <input
                        className="mioto-input"
                        type={showPass.password ? "text" : "password"}
                        value={form.password}
                        onChange={(ev) => setField("password", ev.target.value)}
                        placeholder="Tối thiểu 6 ký tự"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        className="mioto-eye"
                        onClick={() => setShowPass((p) => ({ ...p, password: !p.password }))}
                        title={showPass.password ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                        👁
                    </button>
                    {errors.password ? <div className="mioto-error">{errors.password}</div> : null}
                </div>

                <div className="mioto-field mioto-pass">
                    <label>Mật khẩu</label>
                    <input
                        className="mioto-input"
                        type={showPass.confirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(ev) => setField("confirmPassword", ev.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        className="mioto-eye"
                        onClick={() => setShowPass((p) => ({ ...p, confirmPassword: !p.confirmPassword }))}
                        title={showPass.confirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                        👁
                    </button>
                    {errors.confirmPassword ? <div className="mioto-error">{errors.confirmPassword}</div> : null}
                </div>

                <div className="mioto-field">
                    <label>Mã giới thiệu (nếu có)</label>
                    <input
                        className="mioto-input"
                        value={form.referralCode}
                        onChange={(ev) => setField("referralCode", ev.target.value)}
                        placeholder="Nhập mã (không bắt buộc)"
                    />
                </div>

                <div className="mioto-check">
                    <input
                        type="checkbox"
                        checked={form.agree}
                        onChange={(ev) => setField("agree", ev.target.checked)}
                    />
                    <div>
                        Tôi đã đọc và đồng ý với{" "}
                        <a href="#" onClick={(ev) => ev.preventDefault()}>
                            Chính sách & quy định
                        </a>{" "}
                        và{" "}
                        <a href="#" onClick={(ev) => ev.preventDefault()}>
                            Chính sách bảo vệ dữ liệu cá nhân
                        </a>{" "}
                        của hệ thống.
                        {errors.agree ? <div className="mioto-error">{errors.agree}</div> : null}
                    </div>
                </div>
                <button className="mioto-btn" disabled={loading} type="submit">
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>

                <div className="mioto-social">
                    <button type="button" onClick={() => alert("Demo UI thôi nhé 🙂")}>
                        Facebook
                    </button>
                    <button type="button" onClick={() => alert("Demo UI thôi nhé 🙂")}>
                        Google
                    </button>
                </div>

                <div className="mioto-footer">
                    Đã có tài khoản?{" "}
                    <Link to="/login" state={{ backgroundLocation: bgLocation }}>
                        Đăng nhập
                    </Link>
                </div>
            </form>
        </div>
    );

    // ====== MODAL MODE (đè lên Home giống Login) ======
    if (isModal) {
        return (
            <div className="authModalOverlay" onMouseDown={close}>
                <div className="authModal" onMouseDown={(e) => e.stopPropagation()}>
                    {RegisterCard}
                </div>
            </div>
        );
    }

    // ====== PAGE MODE (gõ /register trực tiếp) ======
    return (
        <div className="mioto-auth-wrap" style={{ backgroundImage: `url(${bg})` }}>
            {RegisterCard}
        </div>
    );
}