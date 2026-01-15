export const createBooking = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:8080/api/customer/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`   
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Đặt xe thất bại");
  }

  return res.json();
};

export const getBookingDetail = async (bookingId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:8080/api/customer/bookings/${bookingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Không tìm thấy đơn đặt xe");
  }

  return res.json();
};
