// src/api/authApi.js
import axiosClient from "./axiosClient";

export const authApi = {
  login: (payload) => axiosClient.post("/auth/login", payload),
  register: (payload) => axiosClient.post("/auth/register", payload),

  // ✅ refresh token để lấy role mới (OWNER) sau khi admin APPROVED
  refresh: () => axiosClient.post("/auth/refresh"),
};
