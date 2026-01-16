// frontend/src/pages/driver/TripHistory.jsx
import { useEffect, useState } from "react";
import { driverApi } from "../../api/driverApi";

const TripHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await driverApi.getMyTrips();
        const arr = Array.isArray(res) ? res : res?.data ?? [];

        // Nếu BE trả field khác, map lại cho đúng UI
        const normalized = arr.map((t) => ({
          id: t.id ?? t.tripId ?? t.bookingId,
          date: t.date ?? t.createdAt ?? "",
          route:
            t.route ??
            `${t.pickupAddress ?? ""} → ${t.dropoffAddress ?? ""}`.trim(),
          status: t.status,
          income: t.income ?? t.price ?? t.totalPrice ?? "",
        }));

        setHistory(
          normalized.filter(
            (t) => t.status === "COMPLETED" || t.status === "REJECTED"
          )
        );
      } catch (e) {
        setErr("Không tải được lịch sử. Kiểm tra BE/CORS/token.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-gray-300">Đang tải...</div>;
  if (err) return <div className="text-red-500">{err}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">LỊCH SỬ CHUYẾN ĐI</h2>

      {history.length === 0 ? (
        <div className="text-gray-400 italic">
          Chưa có chuyến nào hoàn thành / bị từ chối.
        </div>
      ) : (
        <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-800">
          <table className="w-full text-left">
            <thead className="bg-[#2a2a2a] text-gray-400 text-sm uppercase">
              <tr>
                <th className="p-4">Ngày</th>
                <th className="p-4">Lộ trình</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-right">Thu nhập</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[#252525] transition">
                  <td className="p-4 text-gray-300">{item.date}</td>
                  <td className="p-4 font-medium text-white">{item.route}</td>

                  <td className="p-4 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded border ${
                        item.status === "COMPLETED"
                          ? "border-green-800 bg-green-900/30 text-green-400"
                          : "border-red-800 bg-red-900/30 text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 text-right font-mono text-[#00FF00]">
                    {item.income}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TripHistory;
