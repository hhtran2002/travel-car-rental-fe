import axios from "./axiosClient";

// GET /api/customer/profile
export const getMyProfile = () => {
  return axios.get("/customer/profile");
};

// GET /api/customer/bookings
export const getMyBookings = () => {
  return axios.get("/customer/bookings");
};
