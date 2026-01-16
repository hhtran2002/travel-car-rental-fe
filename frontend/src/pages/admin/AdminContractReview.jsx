import { useEffect, useState } from "react";
import { adminContractApi } from "../../api/adminContractApi";

export default function AdminContractReview() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    try {
      const data = await adminContractApi.pending();
      setRows(data);
    } catch (e) {
      setErr("Không tải được danh sách hợp đồng chờ duyệt");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const open = (c) => {
    setSelected(c);
    setNote("");
  };

  const approve = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await adminContractApi.approve(selected.id, note);
      setSelected(null);
      await load();
    } catch (e) {
      alert("Approve thất bại");
    } finally {
      setLoading(false);
    }
  };

  const reject = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await adminContractApi.reject(selected.id, note);
      setSelected(null);
      await load();
    } catch (e) {
      alert("Reject thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="text-xl font-bold mb-3">Hợp đồng chờ duyệt</div>
      {err && (
        <div className="mb-3 p-3 rounded bg-red-50 text-red-700">{err}</div>
      )}

      <div className="bg-white rounded-xl border">
        <div className="p-3 border-b font-semibold">
          Pending review: {rows.length}
        </div>

        {rows.length === 0 ? (
          <div className="p-4 text-gray-500">Không có hợp đồng chờ duyệt</div>
        ) : (
          <div className="divide-y">
            {rows.map((c) => (
              <div key={c.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Contract #{c.id}</div>
                  <div className="text-sm text-gray-600">
                    Status: {c.status}
                  </div>
                </div>
                <button
                  onClick={() => open(c)}
                  className="px-3 py-2 rounded bg-gray-900 text-white"
                >
                  Xem & Duyệt
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal MVP */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl p-4">
            <div className="font-bold text-lg">
              Duyệt Contract #{selected.id}
            </div>

            {/* Nếu contract có pdfUrl/pdfPath thì show */}
            {selected.pdfPath && (
              <a
                className="block mt-2 underline text-blue-600"
                href={selected.pdfPath}
                target="_blank"
                rel="noreferrer"
              >
                Xem PDF
              </a>
            )}

            <textarea
              className="mt-3 w-full border rounded p-2"
              placeholder="Ghi chú admin (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="mt-3 flex gap-2 justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-2 rounded bg-gray-200"
              >
                Đóng
              </button>
              <button
                disabled={loading}
                onClick={reject}
                className="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-60"
              >
                Từ chối
              </button>
              <button
                disabled={loading}
                onClick={approve}
                className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-60"
              >
                Duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
