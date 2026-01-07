import axios from "axios";
import { getToken, logout } from "./auth";
import { normalizeApiError } from "./error";

export const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const e = normalizeApiError(err);

        const token = getToken();
        if (token && e.status === 401) {
            logout();
            // optional: có thể redirect bằng window.location
            // window.location.href = "/login";
        }
        return Promise.reject(e);
    }
);