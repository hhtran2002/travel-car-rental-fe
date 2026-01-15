const API_URL = "http://localhost:8080/api/cars";

export const getAllCars = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const searchCars = async (params) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/search?${query}`);
  return res.json();
};

export const getCarDetail = async (id) => {
  const res = await fetch(`http://localhost:8080/api/cars/${id}`);
  if (!res.ok) throw new Error("Không tìm thấy xe");
  return res.json();
};
