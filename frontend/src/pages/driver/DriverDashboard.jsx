// frontend/src/pages/driver/DriverDashboard.jsx
import { useState, useEffect } from "react";
// import { driverApi } from "../../api/driverApi"; // Bỏ comment khi có API
import TripMap from "../../component/TripMap"; // <--- Import Map

const DriverDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả lập data CÓ TỌA ĐỘ (Lat, Lng)
  const mockTrips = [
    {
      id: 1,
      customerName: "Nguyễn Văn A",
      route: "Sân Bay TSN - Bitexco Quận 1",
      date: "2024-01-10",
      status: "IN_PROGRESS", // Đang chạy để hiện bản đồ
      price: "2.500.000",
      // Tọa độ ví dụ (Sân bay -> Quận 1)
      startPoint: [10.818463, 106.658825],
      endPoint: [10.771595, 106.704758],
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      route: "Quận 7 - Landmark 81",
      date: "2024-01-09",
      status: "ASSIGNED",
      price: "500.000",
      startPoint: [10.7328, 106.721],
      endPoint: [10.795, 106.722],
    },
  ];

  useEffect(() => {
    // loadTrips();
    setTrips(mockTrips);
    setLoading(false);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    if (
      !window.confirm(`Bạn chắc chắn muốn đổi trạng thái thành ${newStatus}?`)
    )
      return;
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  if (loading)
    return <div className="text-[#00FF00] text-center mt-10">Đang tải...</div>;

  const newRequests = trips.filter((t) => t.status === "ASSIGNED");
  const activeTrips = trips.filter(
    (t) => t.status === "IN_PROGRESS" || t.status === "CONFIRMED"
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Section 1: Chuyến đi hiện tại */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center text-[#00b300] dark:text-[#00FF00]">
          <span className="w-2 h-2 bg-[#00b300] dark:bg-[#00FF00] rounded-full mr-2 animate-pulse"></span>
          CHUYẾN ĐI HIỆN TẠI & BẢN ĐỒ
        </h2>

        {activeTrips.length === 0 ? (
          <p className="text-gray-500 italic">
            Bạn đang rảnh rỗi, chưa có chuyến nào đang chạy.
          </p>
        ) : (
          <div className="grid gap-6">
            {activeTrips.map((trip) => (
              <div key={trip.id} className="space-y-4">
                {/* Thông tin chuyến đi */}
                <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md relative overflow-hidden transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00b300] dark:bg-[#00FF00]"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {trip.customerName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        📍 {trip.route}
                      </p>
                    </div>
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-xs px-2 py-1 rounded border border-yellow-300 dark:border-yellow-600">
                      {trip.status}
                    </span>
                  </div>

                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => handleStatusChange(trip.id, "COMPLETED")}
                      className="w-full bg-[#00b300] dark:bg-[#00FF00] text-white dark:text-black font-bold py-3 rounded hover:opacity-90 transition shadow-sm"
                    >
                      HOÀN THÀNH CHUYẾN
                    </button>
                  </div>
                </div>

                {/* BẢN ĐỒ ĐIỀU HƯỚNG */}
                <div className="w-full">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Bản đồ dẫn đường
                  </h3>
                  {/* Truyền tọa độ vào Map */}
                  <TripMap
                    startPoint={trip.startPoint}
                    endPoint={trip.endPoint}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <hr className="border-gray-200 dark:border-gray-800" />

      {/* Section 2: Yêu cầu mới */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          YÊU CẦU MỚI ({newRequests.length})
        </h2>
        {/* ... (Giữ nguyên phần render list yêu cầu mới như cũ) ... */}
        <div className="grid gap-4">
          {newRequests.map((trip) => (
            <div
              key={trip.id}
              className="bg-gray-50 dark:bg-[#2a2a2a] p-5 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm text-[#00b300] dark:text-[#00FF00] font-medium">
                  {trip.date}
                </span>
                <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                  {trip.price}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {trip.route}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Khách: {trip.customerName}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleStatusChange(trip.id, "CONFIRMED")}
                  className="bg-transparent border border-[#00b300] dark:border-[#00FF00] text-[#00b300] dark:text-[#00FF00] py-2 rounded font-bold hover:bg-[#00b300] dark:hover:bg-[#00FF00] hover:text-white dark:hover:text-black transition"
                >
                  NHẬN
                </button>
                <button
                  onClick={() => handleStatusChange(trip.id, "REJECTED")}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-200 transition"
                >
                  TỪ CHỐI
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DriverDashboard;
