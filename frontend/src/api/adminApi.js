import axiosClient from "./axiosClient";

export const adminApi = {
  // --- BOOKING ---
  getAllBookings: () => {
    return axiosClient.get("/admin/bookings");
  },
  confirmBooking: (id) => {
    return axiosClient.patch(`/admin/bookings/${id}/confirm`);
  },

  // --- CUSTOMER LIST (search server-side) ---
  getCustomers: (page = 0, size = 10, keyword = "") => {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("size", size);
    params.set("sort", "userId,desc");

    if (keyword && keyword.trim()) {
      params.set("keyword", keyword.trim());
    }

    return axiosClient.get(`/admin/customers?${params.toString()}`);
  },

  // --- CUSTOMER DETAIL ---
  getCustomerById: (id) => {
    return axiosClient.get(`/admin/customers/${id}`);
  },

  // --- CREATE CUSTOMER ---
  createCustomer: (payload) => {
    return axiosClient.post("/admin/customers", payload);
  },

  // ---UPDATE CUSTOMER ---
  updateCustomer: (id, payload) => {
    return axiosClient.patch(`/admin/customers/${id}`, payload);
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
