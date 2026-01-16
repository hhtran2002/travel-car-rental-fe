// src/pages/customer/BecomeOwner.jsx
import { useEffect, useState } from "react";
import { ownerRegistrationApi } from "../../api/ownerRegistrationApi";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function BecomeOwner() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    carBrand: "",
    carModel: "",
    licensePlate: "",
    note: "",
    cccdFront: null,
    cavet: null,
  });

  const [reg, setReg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const loadMe = async () => {
    setErr("");
    try {
      const data = await ownerRegistrationApi.getMyRegistration();
      setReg(data);
    } catch (e) {
      // 404 = chưa có hồ sơ
      setReg(null);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      await ownerRegistrationApi.submit(form);
      await loadMe();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Gửi hồ sơ thất bại");
    } finally {
      setLoading(false);
    }
  };

  const goOwner = async () => {
    try {
      // ✅ lấy token mới theo role hiện tại trong DB
      const res = await authApi.refresh();
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", (res.role || "").toUpperCase());

      nav("/owner/dashboard");
    } catch (e) {
      setErr("Không refresh được token. Hãy đăng nhập lại.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Đăng ký trở thành đối tác (Owner)
      </h1>

      {err && (
        <div className="mb-3 p-3 rounded bg-red-50 text-red-700">{err}</div>
      )}

      {reg ? (
        <div className="p-4 border rounded bg-white">
          <div className="font-semibold">Trạng thái hồ sơ: {reg.status}</div>
          {reg.adminNote && (
            <div className="text-sm text-gray-600 mt-1">
              Admin note: {reg.adminNote}
            </div>
          )}

          {reg.status === "APPROVED" && (
            <button
              onClick={goOwner}
              className="mt-4 px-4 py-2 rounded bg-green-600 text-white"
            >
              Vào Owner Dashboard
            </button>
          )}

          {reg.status === "REJECTED" && (
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded bg-gray-800 text-white"
            >
              Gửi lại hồ sơ (tạm reload)
            </button>
          )}
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="p-4 border rounded bg-white space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="border p-2 rounded"
              placeholder="Họ tên"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="SĐT"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Hãng xe"
              value={form.carBrand}
              onChange={(e) => setForm({ ...form, carBrand: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Dòng xe"
              value={form.carModel}
              onChange={(e) => setForm({ ...form, carModel: e.target.value })}
            />
            <input
              className="border p-2 rounded md:col-span-2"
              placeholder="Biển số"
              value={form.licensePlate}
              onChange={(e) =>
                setForm({ ...form, licensePlate: e.target.value })
              }
            />
          </div>

          <textarea
            className="border p-2 rounded w-full"
            placeholder="Ghi chú (optional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="border p-2 rounded block">
              <div className="text-sm text-gray-600 mb-1">CCCD (mặt trước)</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, cccdFront: e.target.files?.[0] || null })
                }
              />
            </label>

            <label className="border p-2 rounded block">
              <div className="text-sm text-gray-600 mb-1">Cavet xe</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, cavet: e.target.files?.[0] || null })
                }
              />
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {loading ? "Đang gửi..." : "Gửi hồ sơ"}
          </button>
        </form>
      )}
    </div>
  );
}
