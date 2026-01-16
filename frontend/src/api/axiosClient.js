// import axios from "axios";

// // const axiosClient = axios.create({
// //   baseURL: "http://localhost:8080/api",
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });
// export const api = axios.create({
//     baseURL: "/api",
//     headers: { "Content-Type": "application/json" },
// });
// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`; // Đảm bảo đúng chuẩn Bearer
//     }
//     if (config.data instanceof FormData) {
//       delete config.headers["Content-Type"];
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosClient.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     // Nếu không có response (lỗi mạng) hoặc lỗi khác
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem("token");
//       // SỬA Ở ĐÂY: Chuyển hướng về trang login thay vì /admin
//       // window.location.href = "/login";
//     } else if (error.response && error.response.status === 403) {
//       alert("Bạn không có quyền truy cập vào trang quản trị!");
//       window.location.href = "/"; // Về trang chủ
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosClient;
import axios from "axios";

/**
 * Axios instance dùng CHUNG cho toàn bộ project
 * - Không hardcode localhost
 * - Chạy được máy B, máy C, production
 */
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Nếu gửi FormData thì để browser tự set Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login"; // nếu muốn redirect
    }

    if (error.response?.status === 403) {
      alert("Bạn không có quyền truy cập!");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);


export default api;
