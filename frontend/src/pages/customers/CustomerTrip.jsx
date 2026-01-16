import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function CustomerTrip() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchCurrentTrip = async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await axiosClient.get("/customer/trips/current");
      const data = res?.data ?? res; // axiosClient có thể unwrap sẵn

      if (
        !data ||
        (typeof data === "object" && Object.keys(data).length === 0)
      ) {
        setTrip(null);
      } else {
        setTrip(data);
      }
    } catch (e) {
      const status = e?.response?.status;

      if (status === 404) {
        setTrip(null);
        return;
      }

      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Có lỗi xảy ra khi tải chuyến đi.";

      setErr(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentTrip();
  }, []);

  if (loading) return <div className="text-gray-500">Đang tải...</div>;
  if (err) return <div className="text-red-500">{err}</div>;
  if (!trip)
    return <div className="text-gray-500">Chưa có chuyến hiện tại</div>;

  return (
    <div className="p-4">
      <div className="font-bold">Trip ID: {trip.id}</div>
      <div>Status: {trip.status}</div>
      <div>Price: {trip.price}</div>
    </div>
  );
}
