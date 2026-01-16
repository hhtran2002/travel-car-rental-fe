import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

export default function AdminContractReview() {
  const [rows, setRows] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState(null);
  const [driverId, setDriverId] = useState("");
  const [loading, setLoading] = useState(false);

  const norm = (b) => ({
    id: b.bookingId ?? b.id,
    status: (b.status || "").toLowerCase(),
    tripStatus: (b.tripStatus || "").toLowerCase(),
    userId: b.userId,
    carId: b.carId,
    driverId: b.driverId,
    totalPrice: b.totalPrice ?? 0,
    pickupLocation: b.pickupLocation,
    dropoffLocation: b.dropoffLocation,
  });

  const load = async () => {
    setErr("");
    try {
      const [all, ds] = await Promise.all([
        adminApi.getAllBookings(),
        adminApi.getDrivers(),
      ]);

      const bookings = (Array.isArray(all) ? all : all?.data ?? []).map(norm);
      const pending = bookings.filter((b) => b.status === "pending");

      setRows(pending);
      setDrivers(Array.isArray(ds) ? ds : ds?.data ?? []);
    } catch (e) {
      setErr(
        e?.response?.data?.message || "Không tải được danh sách booking/driver"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const open = (b) => {
    setSelected(b);
    setDriverId("");
  };

  const assign = async () => {
    if (!selected || !driverId) return;
    setLoading(true);
    try {
      await adminApi.assignDriver(selected.id, Number(driverId));
      setSelected(null);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Assign driver thất bại");
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await adminApi.cancelBooking(selected.id);
      setSelected(null);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Cancel thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="text-xl font-bold mb-3">
        Booking chờ xử lý (thay hợp đồng)
      </div>

      {err && (
        <div className="mb-3 p-3 rounded bg-red-50 text-red-700">{err}</div>
      )}

      <div className="bg-white rounded-xl border">
        <div className="p-3 border-b font-semibold">Pending: {rows.length}</div>

        {rows.length === 0 ? (
          <div className="p-4 text-gray-500">Không có booking pending</div>
        ) : (
          <div className="divide-y">
            {rows.map((b) => (
              <div key={b.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Booking #{b.id}</div>
                  <div className="text-sm text-gray-600">
                    {b.pickupLocation} → {b.dropoffLocation}
                  </div>
                </div>
                <button
                  onClick={() => open(b)}
                  className="px-3 py-2 rounded bg-gray-900 text-white"
                >
                  Gán tài xế
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl p-4">
            <div className="font-bold text-lg">
              Gán tài xế cho Booking #{selected.id}
            </div>

            <select
              className="mt-3 w-full border rounded p-2"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            >
              <option value="">-- Chọn tài xế --</option>
              {drivers.map((d) => (
                <option key={d.driverId} value={d.driverId}>
                  #{d.driverId} - {d.fullName || d.name || "Driver"} ({d.status}
                  )
                </option>
              ))}
            </select>

            <div className="mt-3 flex gap-2 justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-2 rounded bg-gray-200"
              >
                Đóng
              </button>
              <button
                disabled={loading}
                onClick={cancel}
                className="px-3 py-2 rounded bg-red-600 text-white"
              >
                Hủy đơn
              </button>
              <button
                disabled={loading || !driverId}
                onClick={assign}
                className="px-3 py-2 rounded bg-green-600 text-white"
              >
                Gán tài xế
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
