import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { kycApi } from "../../api/kycApi";

export default function AdminKycRequests() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await kycApi.listRequests({
        q: q || "",
        status: status === "ALL" ? "" : status,
      });
      // backend nên trả: { items: [...] } hoặc [...] — mình linh hoạt:
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setErr(e?.message || "Lỗi tải danh sách KYC");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white">
            Duyệt giấy tờ (KYC)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Danh sách user gửi CCCD/CMND, admin kiểm tra và duyệt.
          </p>
        </div>

        <button
          onClick={load}
          className="px-4 py-2 rounded-lg bg-[#00FF00] text-black font-extrabold hover:brightness-95"
        >
          ↻ Tải lại
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên / email / số giấy tờ..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] text-gray-800 dark:text-white outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] text-gray-800 dark:text-white outline-none"
        >
          <option value="ALL">Tất cả</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
        </select>

        <button
          onClick={load}
          className="px-4 py-3 rounded-xl bg-gray-900 text-white dark:bg-gray-200 dark:text-black font-bold"
        >
          Lọc / Tìm
        </button>
      </div>

      {err && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 font-semibold border border-red-200 dark:border-red-800">
          {err}
        </div>
      )}

      <div className="overflow-auto rounded-2xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-[900px] w-full bg-white dark:bg-[#121212]">
          <thead className="bg-gray-50 dark:bg-[#171717]">
            <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
              <th className="p-4">User</th>
              <th className="p-4">Giấy tờ</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  className="p-4 text-gray-500 dark:text-gray-400"
                  colSpan={5}
                >
                  Đang tải...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  className="p-4 text-gray-500 dark:text-gray-400"
                  colSpan={5}
                >
                  Không có yêu cầu nào.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr
                  key={it.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <td className="p-4">
                    <div className="font-bold text-gray-800 dark:text-white">
                      {it.fullName || it.name || "—"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {it.email || "—"}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                    {it.docType || "CCCD/CMND"}{" "}
                    <span className="text-gray-400">
                      {it.docNumber ? `• ${it.docNumber}` : ""}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        it.status === "APPROVED"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                          : it.status === "REJECTED"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                      }`}
                    >
                      {it.status || "PENDING"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                    {it.createdAt || "—"}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/admin/kyc/${it.id}`}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-gray-200 dark:text-black font-bold"
                    >
                      Xem / Duyệt →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
