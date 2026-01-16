// frontend/src/pages/customer/CustomerTrip.jsx
import { useEffect, useMemo, useState } from "react";
import TripMap from "../../component/TripMap";

/**
 * MOCK JSON (ví dụ BE trả về từ GET /api/customer/trips/current)
 *
 * {
 *   "id": 123,
 *   "status": "IN_PROGRESS",
 *   "price": 250000,
 *   "currency": "VND",
 *   "driver": {
 *     "name": "Nguyễn Văn Tài",
 *     "phone": "0909123456"
 *   },
 *   "route": {
 *     "pickup": { "address": "Sân bay Tân Sơn Nhất", "lat": 10.818463, "lng": 106.658825 },
 *     "dropoff": { "address": "Bitexco Q1", "lat": 10.771595, "lng": 106.704758 }
 *   }
 * }
 */

const API_URL = "http://localhost:8080/api/customer/trips/current";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const formatVnd = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫";
};

const statusMeta = (status) => {
  switch (status) {
    case "CONFIRMED":
      return {
        label: "Đã xác nhận",
        pill: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        dot: "bg-blue-500",
      };
    case "IN_PROGRESS":
      return {
        label: "Đang diễn ra",
        pill: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
        dot: "bg-emerald-500",
      };
    case "COMPLETED":
      return {
        label: "Hoàn thành",
        pill: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700",
        dot: "bg-gray-500",
      };
    default:
      return {
        label: status || "Không rõ",
        pill: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
        dot: "bg-yellow-500",
      };
  }
};

export default function CustomerTrip() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchCurrentTrip = async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        // BE có thể trả 404 nếu không có trip hiện tại
        if (res.status === 404) {
          setTrip(null);
          return;
        }
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();

      // Nếu BE trả null/{} khi rỗng
      if (!data || Object.keys(data).length === 0) {
        setTrip(null);
      } else {
        setTrip(data);
      }
    } catch (e) {
      setErr(e?.message || "Có lỗi xảy ra khi tải chuyến đi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const view = useMemo(() => {
    if (!trip) return null;

    const driverName = trip?.driver?.name || "—";
    const driverPhone = trip?.driver?.phone || "—";
    const pickupAddr = trip?.route?.pickup?.address || "—";
    const dropoffAddr = trip?.route?.dropoff?.address || "—";

    const startPoint =
      trip?.route?.pickup?.lat != null && trip?.route?.pickup?.lng != null
        ? [trip.route.pickup.lat, trip.route.pickup.lng]
        : null;

    const endPoint =
      trip?.route?.dropoff?.lat != null && trip?.route?.dropoff?.lng != null
        ? [trip.route.dropoff.lat, trip.route.dropoff.lng]
        : null;

    const status = statusMeta(trip?.status);
    const priceText = formatVnd(trip?.price);

    return {
      driverName,
      driverPhone,
      pickupAddr,
      dropoffAddr,
      startPoint,
      endPoint,
      status,
      priceText,
    };
  }, [trip]);

  // ===== UI STATES =====
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Đang tải chuyến đi hiện tại...
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-24 w-full bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-[#1e1e1e] border border-red-200 dark:border-red-900 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-red-600 dark:text-red-300 font-semibold">
            Không tải được chuyến đi
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 break-words">
            {err}
          </p>
          <button
            onClick={fetchCurrentTrip}
            className="mt-4 w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚗</span>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Chưa có chuyến đi hiện tại
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Khi bạn đặt xe, thông tin chuyến đi sẽ hiển thị tại đây.
              </p>
            </div>
          </div>

          <button
            onClick={fetchCurrentTrip}
            className="mt-5 w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            Tải lại
          </button>

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            *Nếu BE trả 404 khi không có chuyến, UI này sẽ tự hiển thị.
          </p>
        </div>
      </div>
    );
  }

  // ===== MAIN VIEW =====
  return (
    <div className="max-w-md mx-auto space-y-4 pb-24">
      {/* Header mini (app vibe) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-gray-900 dark:text-white">
            Chuyến đi của bạn
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Theo dõi lộ trình & liên hệ tài xế
          </p>
        </div>

        <button
          onClick={fetchCurrentTrip}
          className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] hover:opacity-90 transition"
          title="Refresh"
        >
          ↻
        </button>
      </div>

      {/* Card: Driver + Status + Price */}
      <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {/* top accent */}
        <div className="h-1 w-full bg-emerald-500" />

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">Tài xế</p>
              <p className="text-base font-extrabold text-gray-900 dark:text-white truncate">
                {view.driverName}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 text-xs font-bold px-2.5 py-1 rounded-full border ${view.status.pill}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${view.status.dot} ${
                      trip.status === "IN_PROGRESS" ? "animate-pulse" : ""
                    }`}
                  />
                  {view.status.label}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Giá chuyến đi
              </p>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                {view.priceText}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={
                view.driverPhone !== "—" ? `tel:${view.driverPhone}` : undefined
              }
              className={`py-3 rounded-xl font-bold text-center transition ${
                view.driverPhone === "—"
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:opacity-90"
              }`}
              onClick={(e) => {
                if (view.driverPhone === "—") e.preventDefault();
              }}
            >
              📞 Gọi tài xế
            </a>

            <button
              className="py-3 rounded-xl font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] hover:opacity-90 transition"
              onClick={() => {
                const text = `Tài xế: ${view.driverName}\nSĐT: ${view.driverPhone}\nLộ trình: ${view.pickupAddr} -> ${view.dropoffAddr}\nGiá: ${view.priceText}\nTrạng thái: ${trip.status}`;
                navigator.clipboard?.writeText(text);
              }}
            >
              📋 Sao chép
            </button>
          </div>
        </div>
      </div>

      {/* Route card */}
      <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Lộ trình
        </p>

        <div className="mt-3 space-y-3">
          <div className="flex gap-3">
            <div className="pt-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <div className="w-[2px] h-10 bg-gray-200 dark:bg-gray-800 mx-auto my-1" />
              <div className="w-3 h-3 rounded-full bg-black dark:bg-white" />
            </div>

            <div className="min-w-0 flex-1">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Điểm đón
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {view.pickupAddr}
                </p>
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Điểm trả
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {view.dropoffAddr}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <p className="text-sm font-extrabold text-gray-900 dark:text-white">
            Bản đồ lộ trình
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Live route
          </span>
        </div>

        <div className="px-4 pb-4">
          {view.startPoint && view.endPoint ? (
            <TripMap startPoint={view.startPoint} endPoint={view.endPoint} />
          ) : (
            <div className="h-56 rounded-xl bg-gray-100 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Thiếu tọa độ để hiển thị bản đồ.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
