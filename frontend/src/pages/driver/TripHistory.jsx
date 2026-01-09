// frontend/src/pages/driver/TripHistory.jsx
import { useState } from "react";

const TripHistory = () => {
  // Mock data
  const [history] = useState([
    {
      id: 99,
      route: "Nha Trang - Đà Lạt",
      date: "2023-12-20",
      status: "COMPLETED",
      income: "1.200.000",
    },
    {
      id: 98,
      route: "HCM - Cần Thơ",
      date: "2023-12-15",
      status: "COMPLETED",
      income: "800.000",
    },
    {
      id: 97,
      route: "City Tour",
      date: "2023-12-10",
      status: "REJECTED",
      income: "0",
    },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">LỊCH SỬ CHUYẾN ĐI</h2>
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
    </div>
  );
};

export default TripHistory;
