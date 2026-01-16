// src/api/ownerRegistrationApi.js
import axiosClient from "./axiosClient";

export const ownerRegistrationApi = {
  getMyRegistration: () => axiosClient.get("/customer/owner-registration/me"),

  submit: (payload) => {
    const fd = new FormData();

    fd.append("fullName", payload.fullName);
    fd.append("phone", payload.phone);
    fd.append("carBrand", payload.carBrand);
    fd.append("carModel", payload.carModel);
    fd.append("licensePlate", payload.licensePlate);

    if (payload.note) fd.append("note", payload.note);

    // đúng key theo controller: @RequestPart("cccdFront"), @RequestPart("cavet")
    fd.append("cccdFront", payload.cccdFront);
    fd.append("cavet", payload.cavet);

    return axiosClient.post("/customer/owner-registration", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
