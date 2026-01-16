import { useState } from "react";
import { esignApi } from "../../api/esignApi";

export default function AdminEsignDemo() {
  const [file, setFile] = useState(null);
  const [reason, setReason] = useState("Ky hop dong");
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSign = async () => {
    if (!file) return setErr("Chọn file trước đã");
    setErr("");
    setRes(null);
    setLoading(true);
    try {
      const data = await esignApi.sign(file, reason);
      setRes(data);
    } catch (e) {
      // axiosClient của bạn reject raw error; lấy message gọn
      setErr(e?.response?.data?.message || e?.message || "Ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <h2 className="text-xl font-black text-gray-800 dark:text-white">
        Demo Ký số (Local Provider)
      </h2>

      <div className="mt-4 grid gap-3">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm"
        />

        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Lý do ký (optional)"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f0f0f]"
        />

        <button
          onClick={onSign}
          disabled={loading}
          className="px-4 py-2 rounded-lg font-bold bg-green-500 text-white disabled:opacity-60"
        >
          {loading ? "Đang ký..." : "Ký ngay"}
        </button>

        {err && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 font-semibold">
            {err}
          </div>
        )}

        {res && (
          <pre className="p-3 rounded-lg bg-gray-50 dark:bg-[#0f0f0f] text-xs overflow-auto">
            {JSON.stringify(res, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
