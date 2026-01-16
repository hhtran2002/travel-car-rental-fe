// src/api/kycApi.js
import axiosClient from "./axiosClient";

export const kycApi = {
  // Admin: danh sách yêu cầu KYC
  listRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return axiosClient.get(`/admin/kyc/requests${query ? `?${query}` : ""}`);
  },

  // Admin: xem chi tiết 1 yêu cầu
  getRequest: (id) => axiosClient.get(`/admin/kyc/requests/${id}`),

  // Admin: submit ảnh CCCD để backend gọi FPT OCR
  ocrIdCard: (id, fileFront, fileBack) => {
    const fd = new FormData();
    if (fileFront) fd.append("front", fileFront);
    if (fileBack) fd.append("back", fileBack);
    return axiosClient.post(`/admin/kyc/requests/${id}/ocr`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Admin: face match (selfie vs ảnh chân dung trên giấy tờ) -> backend gọi FPT FaceMatch
  faceMatch: (id, idPortraitFile, selfieFile) => {
    const fd = new FormData();
    fd.append("idPortrait", idPortraitFile);
    fd.append("selfie", selfieFile);
    return axiosClient.post(`/admin/kyc/requests/${id}/face-match`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Admin: duyệt / từ chối
  approve: (id, note = "") =>
    axiosClient.patch(`/admin/kyc/requests/${id}/approve`, { note }),

  reject: (id, reason = "") =>
    axiosClient.patch(`/admin/kyc/requests/${id}/reject`, { reason }),
};
