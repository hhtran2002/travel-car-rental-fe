import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminCarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách xe
  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllCars();
      setCars(data);
    } catch (error) {
      console.error("Lỗi tải danh sách xe:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Xử lý Xóa xe
  const handleDelete = async (id, modelName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa xe "${modelName}" không?`))
      return;
    try {
      await adminApi.deleteCar(id);
      alert("Xóa thành công!");
      // Cập nhật lại list sau khi xóa
      setCars(cars.filter((c) => c.carId !== id));
    } catch (error) {
      alert("Lỗi khi xóa: " + (error.response?.data?.message || "Lỗi server"));
    }
  };

  // Helper hiển thị trạng thái
  const renderStatus = (status) => {
    // Backend đang lưu: 'available', 'maintenance', 'inactive'
    const s = status?.toLowerCase() || "";
    if (s === "available")
      return (
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase border border-green-200">
          Sẵn sàng
        </span>
      );
    if (s === "maintenance")
      return (
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold uppercase border border-orange-200">
          Bảo trì
        </span>
      );
    return (
      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase border border-gray-200">
        Ngừng HĐ
      </span>
    );
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Đang tải dữ liệu kho xe...
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Kho Xe & Bãi
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({cars.length} phương tiện)
          </span>
        </h2>
        <button
          onClick={() => alert("Chức năng thêm xe sẽ làm ở form riêng!")}
          className="bg-[#00FF00] hover:bg-green-400 text-black font-bold py-2 px-4 rounded-lg shadow-lg shadow-green-500/20 transition transform hover:-translate-y-0.5"
        >
          + Thêm xe mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider">
              <th className="pb-3 pl-2">Thông tin xe</th>
              <th className="pb-3">Biển số</th>
              <th className="pb-3 text-center">Năm SX</th>
              <th className="pb-3 text-center">Trạng thái</th>
              <th className="pb-3 text-right pr-2">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300">
            {cars.map((car) => (
              <tr
                key={car.carId} // Lưu ý: Entity dùng carId chứ không phải id
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition border-b border-gray-50 dark:border-gray-800/50 last:border-0"
              >
                <td className="py-3 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                      {car.mainImage ? (
                        <img
                          src={car.mainImage}
                          alt="Car"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[10px] text-gray-400">
                          NO IMG
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white line-clamp-1">
                        {car.modelName}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Brand ID: {car.brandId} • Type ID: {car.typeId}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 font-mono text-sm font-semibold">
                  {car.plateNumber}
                </td>
                <td className="py-3 text-center">{car.year}</td>
                <td className="py-3 text-center">{renderStatus(car.status)}</td>
                <td className="py-3 text-right pr-2">
                  <button className="text-blue-500 hover:text-blue-400 text-sm font-semibold mr-4">
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(car.carId, car.modelName)}
                    className="text-red-500 hover:text-red-400 text-sm font-semibold"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cars.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            Kho xe đang trống.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCarList;
