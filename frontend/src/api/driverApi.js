import axiosClient from "./axiosClient";

export const driverApi = {
  // ✅ đúng: /driver/trips
  getMyTrips: () => axiosClient.get("/driver/trips"),

  // ✅ lịch sử
  getHistory: () => axiosClient.get("/driver/trips/history"),

  // ✅ update status
  updateTripStatus: (id, status) =>
    axiosClient.patch(`/driver/trips/${id}/status`, { status }),
};
