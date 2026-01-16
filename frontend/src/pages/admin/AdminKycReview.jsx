import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { kycApi } from "../../api/kycApi";

function filePreviewUrl(file) {
  if (!file) return "";
  return URL.createObjectURL(file);
}

export default function AdminKycReview() {
  const { id } = useParams();
  const nav = useNavigate();

  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // uploads
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [idPortrait, setIdPortrait] = useState(null);
  const [selfie, setSelfie] = useState(null);

  const [ocrRes, setOcrRes] = useState(null);
  const [faceRes, setFaceRes] = useState(null);

  const frontUrl = useMemo(() => filePreviewUrl(front), [front]);
  const backUrl = useMemo(() => filePreviewUrl(back), [back]);
  const idPortraitUrl = useMemo(() => filePreviewUrl(idPortrait), [idPortrait]);
  const selfieUrl = useMemo(() => filePreviewUrl(selfie), [selfie]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await kycApi.getRequest(id);
      setInfo(data);
      // backend có thể trả sẵn links ảnh => gợi ý admin khỏi upload lại
      // data.frontUrl / data.backUrl / data.selfieUrl ...
    } catch (e) {
      setErr(e?.message || "Lỗi tải hồ sơ KYC");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const doOcr = async () => {
    setErr("");
    setOcrRes(null);
    try {
      const res = await kycApi.ocrIdCard(id, front, back);
      setOcrRes(res);
    } catch (e) {
      setErr(e?.message || "OCR lỗi");
    }
  };

  const doFace = async () => {
    setErr("");
    setFaceRes(null);
    try {
      const res = await kycApi.faceMatch(id, idPortrait, selfie);
      setFaceRes(res);
    } catch (e) {
      setErr(e?.message || "FaceMatch lỗi");
    }
  };

  const approve = async () => {
    const note = prompt("Ghi chú duyệt (tuỳ chọn):") || "";
    try {
      await kycApi.approve(id, note);
      alert("Đã duyệt KYC");
      nav("/admin/kyc");
    } catch (e) {
      setErr(e?.message || "Duyệt lỗi");
    }
  };

  const reject = async () => {
    const reason = prompt("Lý do từ chối:") || "";
    if (!reason.trim()) return;
    try {
      await kycApi.reject(id, reason);
      alert("Đã từ chối KYC");
      nav("/admin/kyc");
    } catch (e) {
      setErr(e?.message || "Từ chối lỗi");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white">
            Duyệt KYC • #{id}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload ảnh → gọi OCR/FaceMatch → quyết định duyệt/từ chối.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => nav("/admin/kyc")}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold"
          >
            ← Quay lại
          </button>
          <button
            onClick={load}
            className="px-4 py-2 rounded-lg bg-[#00FF00] text-black font-extrabold"
          >
            ↻ Tải lại
          </button>
        </div>
      </div>

      {err && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 font-semibold border border-red-200 dark:border-red-800">
          {err}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left: user info */}
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212]">
          <div className="font-black text-gray-800 dark:text-white mb-2">
            Thông tin yêu cầu
          </div>

          {loading ? (
            <div className="text-gray-500 dark:text-gray-400">Đang tải...</div>
          ) : (
            <>
              <div className="text-sm text-gray-500">Họ tên</div>
              <div className="font-bold text-gray-800 dark:text-white">
                {info?.fullName || info?.name || "—"}
              </div>

              <div className="mt-3 text-sm text-gray-500">Email</div>
              <div className="font-bold text-gray-800 dark:text-white">
                {info?.email || "—"}
              </div>

              <div className="mt-3 text-sm text-gray-500">Trạng thái</div>
              <div className="font-extrabold text-gray-800 dark:text-white">
                {info?.status || "PENDING"}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Tip: Ảnh đầu vào nên rõ 4 góc, = 5MB, tối thiểu ~640×480 (theo
                docs FPT.AI Reader). :contentReference[oaicite:3]{(index = 3)}
              </div>
            </>
          )}
        </div>

        {/* Middle: OCR */}
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] space-y-3">
          <div className="font-black text-gray-800 dark:text-white">
            1) OCR CCCD/CMND
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <label className="block">
              <div className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
                Mặt trước
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFront(e.target.files?.[0] || null)}
                className="w-full"
              />
              {frontUrl && (
                <img
                  src={frontUrl}
                  alt="front"
                  className="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 max-h-48 object-contain w-full bg-black/5"
                />
              )}
            </label>

            <label className="block">
              <div className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
                Mặt sau (tuỳ chọn)
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBack(e.target.files?.[0] || null)}
                className="w-full"
              />
              {backUrl && (
                <img
                  src={backUrl}
                  alt="back"
                  className="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 max-h-48 object-contain w-full bg-black/5"
                />
              )}
            </label>
          </div>

          <button
            onClick={doOcr}
            disabled={!front}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white dark:bg-gray-200 dark:text-black font-bold disabled:opacity-50"
          >
            Chạy OCR (FPT.AI ID Recognition) →
          </button>

          {ocrRes && (
            <pre className="text-xs p-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 overflow-auto">
              {JSON.stringify(ocrRes, null, 2)}
            </pre>
          )}
        </div>

        {/* Right: Face match */}
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] space-y-3">
          <div className="font-black text-gray-800 dark:text-white">
            2) Face Match (Selfie vs ảnh chân dung)
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <label className="block">
              <div className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
                Ảnh chân dung trên giấy tờ
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIdPortrait(e.target.files?.[0] || null)}
                className="w-full"
              />
              {idPortraitUrl && (
                <img
                  src={idPortraitUrl}
                  alt="idPortrait"
                  className="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 max-h-48 object-contain w-full bg-black/5"
                />
              )}
            </label>

            <label className="block">
              <div className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
                Selfie người dùng
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelfie(e.target.files?.[0] || null)}
                className="w-full"
              />
              {selfieUrl && (
                <img
                  src={selfieUrl}
                  alt="selfie"
                  className="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 max-h-48 object-contain w-full bg-black/5"
                />
              )}
            </label>
          </div>

          <button
            onClick={doFace}
            disabled={!idPortrait || !selfie}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white dark:bg-gray-200 dark:text-black font-bold disabled:opacity-50"
          >
            Chạy FaceMatch →
          </button>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            FPT.AI FaceMatch API (server-side) dùng endpoint checkface.
            :contentReference[oaicite:4]{(index = 4)}
          </div>

          {faceRes && (
            <pre className="text-xs p-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 overflow-auto">
              {JSON.stringify(faceRes, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Gợi ý rule duyệt: OCR ra số giấy tờ + họ tên hợp lý, ảnh rõ; FaceMatch
          score đạt ngưỡng (backend tự set).
        </div>
        <div className="flex gap-2">
          <button
            onClick={reject}
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-extrabold"
          >
            Từ chối
          </button>
          <button
            onClick={approve}
            className="px-4 py-2 rounded-xl bg-[#00FF00] text-black font-extrabold"
          >
            Duyệt
          </button>
        </div>
      </div>
    </div>
  );
}
