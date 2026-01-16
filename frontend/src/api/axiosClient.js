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
    // nếu hết hạn token -> ép logout
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
<<<<<<< HEAD
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      window.location.href = "/login";
=======
      // SỬA Ở ĐÂY: Chuyển hướng về trang login thay vì /admin
      // window.location.href = "/login";
    } else if (error.response && error.response.status === 403) {
      alert("Bạn không có quyền truy cập vào trang quản trị!");
      window.location.href = "/"; // Về trang chủ
>>>>>>> origin/Tran
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
