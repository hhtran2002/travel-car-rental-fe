import axiosClient from "./axiosClient";

export const documentApi = {
  scanVehicleRegistration: (file) => {
    const fd = new FormData();
    fd.append("image", file); // key phải đúng "image"

    return axiosClient.post("/ocr/vehicle-registration", fd);
  },
};
