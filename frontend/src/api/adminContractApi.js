import axiosClient from "./axiosClient";

export const adminContractApi = {
  pending: () => axiosClient.get("/admin/contracts/pending"),
  detail: (id) => axiosClient.get(`/admin/contracts/${id}`),
  approve: (id, adminNote) =>
    axiosClient.post(`/admin/contracts/${id}/approve`, { adminNote }),
  reject: (id, adminNote) =>
    axiosClient.post(`/admin/contracts/${id}/reject`, { adminNote }),
};
