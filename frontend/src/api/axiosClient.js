import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const status = err?.response?.status;

    // 401: token hết hạn / sai -> ép logout
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      window.location.href = "/login";
      return;
    }

    // 403: có token nhưng không đủ quyền
    if (status === 403) {
      alert("Bạn không có quyền truy cập!");
      window.location.href = "/";
      return;
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
