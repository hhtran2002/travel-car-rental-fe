// src/pages/owner/OwnerDashboard.jsx
import { useEffect, useState } from "react";
import { ownerRegistrationApi } from "../../api/ownerRegistrationApi";

export default function OwnerDashboard() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      const data = await ownerRegistrationApi.getMyRegistration();
      setMe(data);
    } catch (e) {
      setErr("Không tải được thông tin đối tác.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (err) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="p-4 border rounded bg-red-50 text-red-700">{err}</div>
        <button
          onClick={load}
          className="mt-4 w-full px-4 py-2 rounded bg-green-600 text-white"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="text-sm text-gray-500">Owner</div>
      <h1 className="text-2xl font-bold">Partner Console</h1>

      {me && (
        <div className="mt-4 p-4 border rounded bg-white">
          <div className="font-semibold">Trạng thái: {me.status}</div>
          <div className="mt-2 text-sm text-gray-600">
            {me.fullName} • {me.phone}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {me.carBrand} {me.carModel} • {me.licensePlate}
          </div>
        </div>
      )}
    </div>
  );
}
