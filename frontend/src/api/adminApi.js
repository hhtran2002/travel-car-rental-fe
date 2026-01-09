import axiosClient from "./axiosClient";

export const adminApi = {
  // --- BOOKING ---
  getAllBookings: () => {
    return axiosClient.get("/admin/bookings");
  },
  confirmBooking: (id) => {
    return axiosClient.patch(`/admin/bookings/${id}/confirm`);
  },

  // --- CUSTOMER ---
  getCustomers: (page = 0, size = 100) => {
    return axiosClient.get(`/admin/customers?page=${page}&size=${size}`);
  },

  // --- CAR (XE) ---
  getAllCars: () => {
    return axiosClient.get("/cars"); // Public API
  },
  createCar: (carData) => {
    return axiosClient.post("/admin/cars", carData);
  },
  updateCar: (id, carData) => {
    return axiosClient.put(`/admin/cars/${id}`, carData);
  },
  deleteCar: (id) => {
    return axiosClient.delete(`/admin/cars/${id}`);
  },
};
