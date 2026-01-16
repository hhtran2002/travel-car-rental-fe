// frontend/src/api/ownerApi.js
const BASE_URL = "http://localhost:8080/api/owner";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const ownerApi = {
  // 1) Lấy hồ sơ owner application của user hiện tại
  // GET /api/owner/application/me
  getMyApplication: async () => {
    const res = await fetch(`${BASE_URL}/application/me`, {
      method: "GET",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("GET_APPLICATION_FAILED");
    return res.json();
  },

  // 2) Submit đăng ký trở thành đối tác (multipart)
  // POST /api/owner/application  (FormData)
  submitApplication: async (formData) => {
    const res = await fetch(`${BASE_URL}/application`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        // KHÔNG set Content-Type ở đây để browser tự set boundary cho multipart
      },
      body: formData,
    });
    if (!res.ok) throw new Error("SUBMIT_APPLICATION_FAILED");
    return res.json();
  },
};
