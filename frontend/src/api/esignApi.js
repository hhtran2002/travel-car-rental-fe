import axiosClient from "./axiosClient";

export const esignApi = {
  sign: (file, reason = "") => {
    const fd = new FormData();
    fd.append("file", file); // ✅ key phải là "file"
    if (reason?.trim()) fd.append("reason", reason.trim());

    return axiosClient.post("/esign/sign", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
