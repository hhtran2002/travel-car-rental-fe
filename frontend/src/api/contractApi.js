import axiosClient from "./axiosClient";

export const contractApi = {
  signContract: (contractId, signerName) =>
    axiosClient.patch(`/admin/contracts/${contractId}/sign`, { signerName }),
};
