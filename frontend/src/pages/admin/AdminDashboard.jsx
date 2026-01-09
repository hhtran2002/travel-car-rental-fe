import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi"; // Import API vừa tạo

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "Tổng Doanh Thu",
      value: "0đ",
      sub: "Đang cập nhật...",
      color: "text-[#00FF00]",
      icon: "💰",
    },
    {
      title: "Đơn đặt xe",
      value: "0",
      sub: "Tổng số đơn",
      color: "text-blue-400",
      icon: "🚗",
    },
    {
      title: "Khách hàng",
      value: "0",
      sub: "Thành viên",
      color: "text-purple-400",
      icon: "👥",
    },
    {
      title: "Xe sẵn sàng",
      value: "0",
      sub: "Đang hoạt động",
      color: "text-orange-400",
      icon: "🔥",
    },
  ]);

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi song song 3 API để tiết kiệm thời gian
        const [bookingsData, customersData, carsData] = await Promise.all([
          adminApi.getAllBookings(),
          adminApi.getCustomers(0, 100), // Lấy 100 khách đầu tiên để đếm tạm
          adminApi.getAllCars(), // Cần đảm bảo có public API get cars
        ]);

        // 1. Xử lý số liệu DOANH THU & ĐƠN HÀNG (Bookings)
        // Giả sử Booking entity có trường 'totalPrice' và 'status'
        const totalRevenue = bookingsData.reduce(
          (acc, curr) => acc + (curr.totalPrice || 0),
          0
        );
        const pendingOrders = bookingsData.filter(
          (b) => b.status === "PENDING"
        ).length;

        // 2. Xử lý số liệu KHÁCH HÀNG (Customers)
        // Backend trả về Page, nên data nằm trong .content
        const totalCustomers =
          customersData.totalElements || customersData.content?.length || 0;

        // 3. Xử lý số liệu XE (Cars)
        const activeCars = carsData.length || 0;

        // Cập nhật State cho các thẻ Card
        setStats([
          {
            title: "Tổng Doanh Thu",
            value: new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalRevenue),
            sub: "Tính trên đơn hoàn thành",
            color: "text-[#00FF00]",
            icon: "💰",
          },
          {
            title: "Tổng Đơn Đặt",
            value: bookingsData.length,
            sub: `${pendingOrders} đơn chờ duyệt`,
            color: "text-blue-400",
            icon: "🚗",
          },
          {
            title: "Khách hàng",
            value: totalCustomers,
            sub: "Tổng thành viên",
            color: "text-purple-400",
            icon: "👥",
          },
          {
            title: "Tổng số xe",
            value: activeCars,
            sub: "Trong hệ thống",
            color: "text-orange-400",
            icon: "🔥",
          },
        ]);

        // 4. Lấy 5 đơn hàng mới nhất để hiện bảng "Đơn đặt gần đây"
        // Sắp xếp theo id giảm dần hoặc ngày tạo (nếu có)
        const sortedBookings = [...bookingsData]
          .sort((a, b) => b.id - a.id)
          .slice(0, 5);

        // Map dữ liệu từ BE sang format của FE
        const formattedOrders = sortedBookings.map((b) => ({
          id: `BK${b.id}`,
          user: b.customerName || "Khách vãng lai", // Cần check lại tên trường trong Entity Booking
          car: b.carName || "Xe thuê", // Cần check lại tên trường
          total: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(b.totalPrice),
          status: b.status,
          statusColor: getStatusColor(b.status),
        }));

        setRecentOrders(formattedOrders);
      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper chọn màu cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-500 bg-green-500/10";
      case "PENDING":
        return "text-yellow-500 bg-yellow-500/10";
      case "CANCELLED":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Đang tải dữ liệu từ Server...
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl text-2xl">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
              {stat.title}
            </h3>
            <p
              className={`text-2xl font-black mt-1 text-gray-900 dark:text-white`}
            >
              {stat.value}
            </p>
            <span className={`text-xs font-bold ${stat.color}`}>
              {stat.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Orders List */}
      <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Đơn đặt gần đây
        </h3>
        <div className="space-y-4">
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Chưa có đơn hàng nào.
            </p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">
                    {order.car}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.user} • {order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#00FF00]">{order.total}</p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
