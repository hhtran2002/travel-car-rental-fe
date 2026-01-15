const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const USERID_KEY = "userId";
const EMAIL_KEY = "email";


export function setToken(token, extra = {}) {
    localStorage.setItem(TOKEN_KEY, token);

    // lưu thêm thông tin nếu có
    if (extra.role) localStorage.setItem(ROLE_KEY, extra.role);
    if (extra.userId) localStorage.setItem(USERID_KEY, String(extra.userId));
    if (extra.email) localStorage.setItem(EMAIL_KEY, extra.email);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USERID_KEY);
    localStorage.removeItem(EMAIL_KEY);

    // ✅ reset theme về light để public page không bị dark đè
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
}

/** Decode JWT payload (chỉ đọc data, không verify signature) */
export function parseJwt(token) {
    try {
        if (!token) return null;
        const payload = token.split(".")[1];
        if (!payload) return null;
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decodeURIComponent(escape(json)));
    } catch (e) {
        return null;
    }
}

/**
 * Lấy role từ token.
 * Hỗ trợ các kiểu claim phổ biến: role / roles[] / authorities[]
 */
export function getRoleFromToken(token = getToken()) {
    // Ưu tiên lấy role đã lưu từ login response (nhanh + chắc)
    const savedRole = localStorage.getItem(ROLE_KEY);
    if (savedRole) return String(savedRole).toLowerCase();

    const data = parseJwt(token);
    if (!data) return null;

    const role =
        data.role ||
        (Array.isArray(data.roles) ? data.roles[0] : null) ||
        (Array.isArray(data.authorities) ? data.authorities[0] : null);

    if (!role) return null;

    return String(role).replace("ROLE_", "").toLowerCase();
}