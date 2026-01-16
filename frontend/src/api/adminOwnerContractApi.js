import axiosClient from "./axiosClient";

export const adminOwnerContractApi = {
  getPending: () => axiosClient.get("/admin/owner-contracts/pending"),

  approve: (id, adminNote) =>
    axiosClient.post(`/admin/owner-contracts/${id}/approve`, {
      adminNote,
    }),

  reject: (id, adminNote) =>
    axiosClient.post(`/admin/owner-contracts/${id}/reject`, {
      adminNote,
    }),
};
