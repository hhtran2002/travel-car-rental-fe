// frontend/src/pages/driver/DriverDashboard.jsx
import { useEffect, useMemo, useState } from "react";
// import { driverApi } from "../../api/driverApi"; // bật khi nối backend thật
import TripMap from "../../component/TripMap";

import { driverApi } from "../../api/driverApi";

// ====== State machine ======
const TRIP_STATUS = {
  ASSIGNED: "ASSIGNED",
  CONFIRMED: "CONFIRMED",
  REJECTED: "REJECTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

const TRANSITIONS = {
  [TRIP_STATUS.ASSIGNED]: [TRIP_STATUS.CONFIRMED, TRIP_STATUS.REJECTED],
  [TRIP_STATUS.CONFIRMED]: [TRIP_STATUS.IN_PROGRESS],
  [TRIP_STATUS.IN_PROGRESS]: [TRIP_STATUS.COMPLETED],
  [TRIP_STATUS.REJECTED]: [],
  [TRIP_STATUS.COMPLETED]: [],
};

const canTransition = (from, to) => (TRANSITIONS[from] || []).includes(to);

// ====== Mock API (đổi sang driverApi khi nối BE) ======
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(n || 0)
  );

const StatusPill = ({ status }) => {
  const base =
    "text-[11px] px-2 py-1 rounded-full border font-semibold tracking-wide";
  switch (status) {
    case TRIP_STATUS.ASSIGNED:
      return (
        <span
          className={`${base} border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700`}
        >
          ASSIGNED
        </span>
      );
    case TRIP_STATUS.CONFIRMED:
      return (
        <span
          className={`${base} border-yellow-300 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700`}
        >
          CONFIRMED
        </span>
      );
    case TRIP_STATUS.IN_PROGRESS:
      return (
        <span
          className={`${base} border-green-300 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700`}
        >
          IN_PROGRESS
        </span>
      );
    case TRIP_STATUS.COMPLETED:
      return (
        <span
          className={`${base} border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700`}
        >
          COMPLETED
        </span>
      );
    case TRIP_STATUS.REJECTED:
    default:
      return (
        <span
          className={`${base} border-red-300 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700`}
        >
          REJECTED
        </span>
      );
  }
};

const ActionButton = ({
  onClick,
  disabled,
  loading,
  variant = "primary",
  children,
  hint,
}) => {
  const base =
    "w-full rounded-xl py-3 text-sm font-bold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary:
      "bg-[#00b300] dark:bg-[#00FF00] text-white dark:text-black shadow-sm hover:opacity-95",
    outline:
      "bg-transparent border border-[#00b300] dark:border-[#00FF00] text-[#00b300] dark:text-[#00FF00] hover:bg-[#00b300] dark:hover:bg-[#00FF00] hover:text-white dark:hover:text-black",
    danger:
      "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-200",
  };

  return (
    <div className="space-y-1">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`${base} ${styles[variant]}`}
      >
        {loading ? "Đang xử lý..." : children}
      </button>
      {hint ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
};

export default function DriverDashboard() {
  // đổi sang driverApi khi nối BE

  const [trips, setTrips] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  // loading & error theo tripId
  const [actionLoadingById, setActionLoadingById] = useState({});
  const [actionErrorById, setActionErrorById] = useState({});

  const loadTrips = async () => {
    setPageLoading(true);
    setPageError("");
    try {
      const data = await driverApi.getMyTrips();

      // normalize nếu BE trả khác key
      const normalized = (Array.isArray(data) ? data : data?.data ?? []).map(
        (t) => ({
          id: t.id ?? t.tripId ?? t.bookingId,
          customerName: t.customerName ?? t.customer?.fullName ?? "—",
          customerPhone: t.customerPhone ?? t.customer?.phone ?? "—",
          route:
            t.route ??
            `${t.pickupAddress ?? ""} → ${t.dropoffAddress ?? ""}`.trim(),
          pickupTime: t.pickupTime ?? t.startTime ?? t.createdAt ?? "",
          status: t.status,
          price: t.price ?? t.totalPrice ?? 0,
          startPoint:
            t.startPoint ??
            (t.pickupLat != null && t.pickupLng != null
              ? [t.pickupLat, t.pickupLng]
              : null),
          endPoint:
            t.endPoint ??
            (t.dropoffLat != null && t.dropoffLng != null
              ? [t.dropoffLat, t.dropoffLng]
              : null),
        })
      );

      setTrips(normalized);
    } catch (e) {
      setTrips([]);
      setPageError(
        e?.response?.data?.message ||
          "Không tải được danh sách chuyến. Kiểm tra BE/CORS/token."
      );
    } finally {
      setPageLoading(false);
    }
  };

  const doUpdateStatus = async (trip, nextStatus) => {
    const { id, status: currentStatus } = trip;

    if (!canTransition(currentStatus, nextStatus)) {
      setTripActionError(
        id,
        `Không thể chuyển từ ${currentStatus} → ${nextStatus}.`
      );
      return;
    }

    setTripActionError(id, "");
    setTripActionLoading(id, true);

    // optimistic UI
    const prevTrips = trips;
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );

    try {
      await driverApi.updateTripStatus(id, nextStatus);
    } catch (e) {
      setTrips(prevTrips);
      setTripActionError(
        id,
        e?.response?.data?.message || "Có lỗi khi cập nhật trạng thái."
      );
    } finally {
      setTripActionLoading(id, false);
    }
  };

  useEffect(() => {
    loadTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = useMemo(() => {
    const assigned = trips.filter((t) => t.status === TRIP_STATUS.ASSIGNED);
    const confirmed = trips.filter((t) => t.status === TRIP_STATUS.CONFIRMED);
    const inProgress = trips.filter(
      (t) => t.status === TRIP_STATUS.IN_PROGRESS
    );
    return { assigned, confirmed, inProgress };
  }, [trips]);

  const setTripActionLoading = (id, v) =>
    setActionLoadingById((prev) => ({ ...prev, [id]: v }));
  const setTripActionError = (id, msg) =>
    setActionErrorById((prev) => ({ ...prev, [id]: msg }));

  const TripCard = ({ trip, actions }) => {
    const loading = !!actionLoadingById[trip.id];
    const err = actionErrorById[trip.id];

    return (
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white truncate">
                  {trip.customerName}
                </h3>
                <StatusPill status={trip.status} />
              </div>

              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                📍 <span className="font-semibold">{trip.route}</span>
              </p>

              <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                  🕒 {trip.pickupTime}
                </span>
                <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                  📞 {trip.customerPhone}
                </span>
                <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 font-mono">
                  {formatVND(trip.price)}
                </span>
              </div>
            </div>
          </div>

          {err ? (
            <div className="mt-3 text-xs text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
              {err}
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-3">
            {actions.map((a, idx) => (
              <ActionButton
                key={idx}
                onClick={a.onClick}
                disabled={a.disabled}
                loading={loading && a.loadingKey === "status"} // simple: 1 action at a time
                variant={a.variant}
                hint={a.hint}
              >
                {a.label}
              </ActionButton>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (pageLoading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-flex items-center gap-2 text-[#00b300] dark:text-[#00FF00] font-bold">
          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          Đang tải chuyến…
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-200">
          {pageError}
        </div>
        <button
          onClick={loadTrips}
          className="w-full rounded-2xl py-3 font-bold bg-[#00b300] dark:bg-[#00FF00] text-white dark:text-black"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Header summary */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-gray-900 dark:text-white">
            Công việc hôm nay
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nhận chuyến → Bắt đầu → Hoàn thành
          </p>
        </div>

        <button
          onClick={loadTrips}
          className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold"
        >
          Refresh
        </button>
      </div>

      {/* Section: IN_PROGRESS (đang chạy) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
            Đang chạy ({groups.inProgress.length})
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Chỉ hoàn thành khi đang IN_PROGRESS
          </span>
        </div>

        {groups.inProgress.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-5 text-sm text-gray-500 dark:text-gray-400">
            Chưa có chuyến nào đang chạy.
          </div>
        ) : (
          <div className="space-y-4">
            {groups.inProgress.map((trip) => (
              <div key={trip.id} className="space-y-3">
                <TripCard
                  trip={trip}
                  actions={[
                    {
                      label: "HOÀN THÀNH",
                      variant: "primary",
                      loadingKey: "status",
                      disabled: !canTransition(
                        trip.status,
                        TRIP_STATUS.COMPLETED
                      ),
                      hint: "Kết thúc chuyến và chuyển COMPLETED.",
                      onClick: () =>
                        doUpdateStatus(trip, TRIP_STATUS.COMPLETED),
                    },
                    {
                      label: "GỌI KHÁCH",
                      variant: "outline",
                      loadingKey: "noop",
                      disabled: false,
                      hint: "MVP: chưa tích hợp call/sms.",
                      onClick: () =>
                        alert("MVP: sau nối backend sẽ mở app gọi điện."),
                    },
                  ]}
                />

                {/* Map */}
                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#161616]">
                    Bản đồ dẫn đường
                  </div>
                  <div className="p-2 bg-white dark:bg-[#1e1e1e]">
                    <TripMap
                      startPoint={trip.startPoint}
                      endPoint={trip.endPoint}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section: CONFIRMED (đã nhận, chưa bắt đầu) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
            Sắp đón khách ({groups.confirmed.length})
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Bấm “BẮT ĐẦU” để chuyển IN_PROGRESS
          </span>
        </div>

        {groups.confirmed.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-5 text-sm text-gray-500 dark:text-gray-400">
            Không có chuyến nào đã nhận.
          </div>
        ) : (
          <div className="space-y-4">
            {groups.confirmed.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                actions={[
                  {
                    label: "BẮT ĐẦU CHUYẾN",
                    variant: "primary",
                    loadingKey: "status",
                    disabled: !canTransition(
                      trip.status,
                      TRIP_STATUS.IN_PROGRESS
                    ),
                    hint: "Chỉ bấm khi đã đón/chuẩn bị chạy.",
                    onClick: () =>
                      doUpdateStatus(trip, TRIP_STATUS.IN_PROGRESS),
                  },
                  {
                    label: "HỦY (MVP: chặn)",
                    variant: "danger",
                    loadingKey: "noop",
                    disabled: true,
                    hint: "MVP: không hỗ trợ hủy sau CONFIRMED.",
                    onClick: () => {},
                  },
                ]}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section: ASSIGNED (yêu cầu mới) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
            Yêu cầu mới ({groups.assigned.length})
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Nhận hoặc từ chối
          </span>
        </div>

        {groups.assigned.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-5 text-sm text-gray-500 dark:text-gray-400">
            Chưa có yêu cầu mới.
          </div>
        ) : (
          <div className="space-y-4">
            {groups.assigned.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                actions={[
                  {
                    label: "NHẬN",
                    variant: "outline",
                    loadingKey: "status",
                    disabled: !canTransition(
                      trip.status,
                      TRIP_STATUS.CONFIRMED
                    ),
                    hint: "Chuyển sang CONFIRMED.",
                    onClick: () => doUpdateStatus(trip, TRIP_STATUS.CONFIRMED),
                  },
                  {
                    label: "TỪ CHỐI",
                    variant: "danger",
                    loadingKey: "status",
                    disabled: !canTransition(trip.status, TRIP_STATUS.REJECTED),
                    hint: "Chuyển sang REJECTED.",
                    onClick: () => doUpdateStatus(trip, TRIP_STATUS.REJECTED),
                  },
                ]}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
