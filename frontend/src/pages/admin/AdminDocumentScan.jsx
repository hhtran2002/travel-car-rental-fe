import { useMemo, useState } from "react";
import { documentApi } from "../../api/documentApi";

export default function AdminDocumentScan() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file]
  );

  const scan = async () => {
    if (!file) return;
    setLoading(true);
    setErr("");
    setRes(null);
    try {
      const data = await documentApi.scanVehicleRegistration(file);
      setRes(data);
    } catch (e) {
      setErr(e?.response?.data || e?.message || "Scan lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">
          Kiểm tra giấy tờ (FPT.AI)
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload ảnh → backend gọi FPT.AI → trả kết quả JSON.
        </p>
      </div>

      <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="rounded-xl border border-gray-200 dark:border-gray-800 max-h-72 object-contain w-full bg-black/5"
          />
        )}

        <button
          onClick={scan}
          disabled={!file || loading}
          className="px-4 py-2 rounded-xl bg-[#00FF00] text-black font-extrabold disabled:opacity-60"
        >
          {loading ? "Đang quét..." : "Quét giấy tờ"}
        </button>

        {err && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 font-semibold border border-red-200 dark:border-red-800">
            {err}
          </div>
        )}

        {res && (
          <pre className="text-xs p-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 overflow-auto">
            {typeof res === "string" ? res : JSON.stringify(res, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
