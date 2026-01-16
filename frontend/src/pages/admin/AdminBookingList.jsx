import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await adminApi.getAllBookings();

      const sortedData = [...data].sort((a, b) => b.id - a.id);
      setBookings(sortedData);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Xử lý Duyệt đơn
  const handleApprove = async (id) => {
    const isConfirm = window.confirm("Xác nhận DUYỆT đơn đặt xe này?");
    if (!isConfirm) return;

    try {
      await adminApi.confirmBooking(id);
      alert("Đã duyệt đơn thành công!");
      fetchBookings();
    } catch (error) {
      alert(
        "Lỗi duyệt đơn: " +
          (error.response?.data?.message || "Vui lòng thử lại")
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "completed":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Đang tải danh sách đơn...
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in-up">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Danh sách Đơn đặt xe
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider">
              <th className="pb-3 pl-2">Mã đơn</th>
              <th className="pb-3">Khách hàng</th>
              <th className="pb-3">Xe thuê</th>
              <th className="pb-3">Tổng tiền</th>
              <th className="pb-3 text-center">Trạng thái</th>
              <th className="pb-3 text-right pr-2">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300">
            {bookings.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border-b border-gray-50 dark:border-gray-800/50 last:border-0"
              >
                <td className="py-3 pl-2 font-mono text-sm text-blue-500">
                  #{item.id}
                </td>
                <td className="py-3">
                  <div className="font-bold text-gray-800 dark:text-white">
                    {item.customerName || "Vãng lai"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.phone || "SĐT ẩn"}
                  </div>
                </td>
                <td className="py-3 text-sm">
                  {item.carName || (
                    <span className="text-gray-400 italic">
                      Car ID: {item.carId}
                    </span>
                  )}
                </td>
                <td className="py-3 font-bold text-[#00FF00]">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.totalPrice)}
                </td>
                <td className="py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-right pr-2">
                  {item.status === "PENDING" ? (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1.5 px-3 rounded transition shadow-md shadow-blue-500/20"
                    >
                      Duyệt ngay
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      Đã xử lý
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            Chưa có đơn đặt xe nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingList;
