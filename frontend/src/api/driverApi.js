// 
import { api } from "./axiosClient";

export const driverApi = {
  // 1. Lấy thông tin tài xế
  getProfile: async () => {
    const res = await api.get("/driver/profile");
    return res.data;
  },

  // 2. Cập nhật thông tin tài xế
  updateProfile: async (data) => {
    const res = await api.put("/driver/profile", data);
    return res.data;
  },

  // 3. Lấy danh sách chuyến đi
  getMyTrips: async () => {
    const res = await api.get("/driver/trips");
    return res.data;
  },

  // 4. Cập nhật trạng thái chuyến đi
  updateTripStatus: async (bookingId, status) => {
    const res = await api.put(
      `/driver/trips/${bookingId}/status`,
      { status }
    );
    return res.data;
  },
};
