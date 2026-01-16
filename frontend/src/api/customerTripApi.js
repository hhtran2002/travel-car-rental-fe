import axiosClient from "./axiosClient";

export const customerTripApi = {
  getCurrent: () => axiosClient.get("/customer/trips/current"),
};
