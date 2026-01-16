import axiosClient from "./axiosClient";

export const adminApi = {
  // ========== BOOKING ==========
  getAllBookings: () => axiosClient.get("/admin/bookings"),

  // BE: PUT /api/admin/bookings/{id}/confirm
  confirmBooking: (id) => axiosClient.put(`/admin/bookings/${id}/confirm`),

  // BE: PUT /api/admin/bookings/{id}/assign-driver  body {driverId}
  assignDriver: (bookingId, driverId) =>
    axiosClient.put(`/admin/bookings/${bookingId}/assign-driver`, { driverId }),

  // BE: PUT /api/admin/bookings/{id}/cancel
  cancelBooking: (id) => axiosClient.put(`/admin/bookings/${id}/cancel`),

  // ========== CUSTOMER LIST (server-side paging/search) ==========
  // BE: GET /api/admin/customers?keyword=&page=&size=
  getCustomers: (page = 0, size = 10, keyword = "") => {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("size", size);

    if (keyword && keyword.trim()) params.set("keyword", keyword.trim());

    return axiosClient.get(`/admin/customers?${params.toString()}`);
  },

  // ========== CUSTOMER CRUD ==========
  getCustomerById: (id) => axiosClient.get(`/admin/customers/${id}`),
  createCustomer: (payload) => axiosClient.post("/admin/customers", payload),
  updateCustomer: (id, payload) =>
    axiosClient.patch(`/admin/customers/${id}`, payload),

  // ========== CAR ==========
  getAllCars: () => axiosClient.get("/cars"),
  createCar: (carData) => axiosClient.post("/admin/cars", carData),
  updateCar: (id, carData) => axiosClient.put(`/admin/cars/${id}`, carData),
  deleteCar: (id) => axiosClient.delete(`/admin/cars/${id}`),
};
