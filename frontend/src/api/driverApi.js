// frontend/src/api/driverApi.js
import axiosClient from "./axiosClient";

const getUserId = () => Number(localStorage.getItem("userId"));

let cachedDriverId = null;

const getDriverId = async () => {
  if (cachedDriverId) return cachedDriverId;

  const userId = getUserId();
  if (!userId) throw new Error("Missing userId in localStorage");

  const driver = await axiosClient.get(`/drivers/user/${userId}`);
  // BE trả Driver entity: driverId là PK
  cachedDriverId = driver?.driverId ?? driver?.id;
  if (!cachedDriverId) throw new Error("Driver not found for userId=" + userId);

  return cachedDriverId;
};

const normTrip = (b) => ({
  id: b.id ?? b.tripId ?? b.bookingId,
  date: b.date ?? b.createdAt ?? b.startDate ?? "",
  route:
    b.route ??
    `${b.pickupLocation ?? b.pickupAddress ?? ""} → ${
      b.dropoffLocation ?? b.dropoffAddress ?? ""
    }`.trim(),
  // ưu tiên tripStatus nếu có, fallback status
  status: (b.tripStatus ?? b.status ?? "").toString(),
  income: b.income ?? b.totalPrice ?? b.price ?? 0,
});

export const driverApi = {
  // Dashboard: gom requests/confirmed/inProgress thành 1 list cho UI tự group
  getMyTrips: async () => {
    const driverId = await getDriverId();
    const data = await axiosClient.get(`/drivers/${driverId}/dashboard-trips`);

    const requests = (data?.requests ?? []).map(normTrip);
    const confirmed = (data?.confirmed ?? []).map(normTrip);
    const inProgress = (data?.inProgress ?? []).map(normTrip);

    // Convert status để DriverDashboard (ASSIGNED/CONFIRMED/IN_PROGRESS/COMPLETED/REJECTED)
    const toUi = (t) => {
      const status = (t.status || "").toLowerCase();

      if (status === "in_progress") return { ...t, status: "IN_PROGRESS" };
      if (status === "assigned") return { ...t, status: "ASSIGNED" };
      if (status === "confirmed") return { ...t, status: "CONFIRMED" };
      if (status === "completed") return { ...t, status: "COMPLETED" };
      if (status === "cancelled") return { ...t, status: "REJECTED" }; // map cancel -> REJECTED UI
      return { ...t, status: (t.status || "").toUpperCase() };
    };

    return [...inProgress, ...confirmed, ...requests].map(toUi);
  },

  // Lịch sử: BE trả toàn bộ trips, FE lọc completed/cancelled
  getHistory: async () => {
    const driverId = await getDriverId();
    const data = await axiosClient.get(`/drivers/${driverId}/trips`);
    return Array.isArray(data) ? data : data?.data ?? [];
  },

  // UI gọi updateTripStatus(id, nextStatus)
  updateTripStatus: async (bookingId, nextStatus) => {
    const driverId = await getDriverId();

    // DriverDashboard đang gửi: CONFIRMED / REJECTED / IN_PROGRESS / COMPLETED
    if (nextStatus === "CONFIRMED") {
      return axiosClient.patch(
        `/drivers/${driverId}/bookings/${bookingId}/decision?decision=confirm`
      );
    }

    if (nextStatus === "REJECTED") {
      return axiosClient.patch(
        `/drivers/${driverId}/bookings/${bookingId}/decision?decision=reject`
      );
    }

    if (nextStatus === "IN_PROGRESS") {
      return axiosClient.patch(
        `/drivers/trips/${bookingId}/status?status=in_progress`
      );
    }

    if (nextStatus === "COMPLETED") {
      return axiosClient.patch(
        `/drivers/trips/${bookingId}/status?status=completed`
      );
    }

    throw new Error("Unsupported nextStatus=" + nextStatus);
  },
};
