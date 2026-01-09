const BASE_URL = "http://localhost:8080/api/driver";

// Hàm helper để lấy Token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const driverApi = {
  // 1. Lấy thông tin tài xế
  getProfile: async () => {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // 2. Cập nhật thông tin tài xế
  updateProfile: async (data) => {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 3. Lấy danh sách chuyến đi (Có thể lọc theo trạng thái)
  getMyTrips: async () => {
    const response = await fetch(`${BASE_URL}/trips`, {
      // Check lại URL backend
      method: "GET",
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // 4. Cập nhật trạng thái chuyến đi (Nhận, Từ chối, Hoàn thành)
  updateTripStatus: async (bookingId, status) => {
    // status: 'CONFIRMED', 'REJECTED', 'COMPLETED'
    const response = await fetch(`${BASE_URL}/trips/${bookingId}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }), // Backend có thể nhận String hoặc Object
    });
    return response.json();
  },
};
