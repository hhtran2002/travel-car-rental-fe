import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContractRoleOption from "../../component/ContractRoleOption";

const pickLandingRoute = (roles = []) => {
  const set = new Set(roles);
  if (set.has("DRIVER")) return "/driver";
  if (set.has("OWNER")) return "/owner/dashboard";
  return "/customer";
};

async function submitContractToBE(payload) {
  throw new Error("NOT_IMPLEMENTED");
}

export default function OwnerContract() {
  const nav = useNavigate();
  const [wantsToBeDriver, setWantsToBeDriver] = useState(false);

  const [licenseNo, setLicenseNo] = useState("");
  const [expYears, setExpYears] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canSubmit = useMemo(() => {
    if (loading) return false;

    if (wantsToBeDriver && !licenseNo.trim()) return false;
    return true;
  }, [loading, wantsToBeDriver, licenseNo]);

  const onSubmit = async () => {
    setLoading(true);
    setErr("");
    try {
      const payload = {
        wantsToBeDriver,
        driverInfo: wantsToBeDriver
          ? { licenseNo, expYears: Number(expYears || 0) }
          : null,
      };

      const res = await submitContractToBE(payload);

      if (res?.rolesGranted?.length) {
        localStorage.setItem("roles", JSON.stringify(res.rolesGranted));
      }

      nav(pickLandingRoute(res?.rolesGranted || []), { replace: true });
    } catch (e) {
      setErr("Chưa nối backend hợp đồng / hoặc submit thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h1 className="text-lg font-extrabold text-gray-900 dark:text-white">
          Hợp đồng đối tác
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Điền thông tin và chọn vai trò bạn muốn tham gia.
        </p>
      </div>

      <ContractRoleOption
        value={wantsToBeDriver}
        onChange={setWantsToBeDriver}
        disabled={loading}
      />

      {wantsToBeDriver ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] p-4 space-y-3">
          <div className="text-sm font-extrabold text-gray-900 dark:text-white">
            Thông tin tài xế
          </div>

          <label className="text-sm font-bold text-gray-900 dark:text-white">
            Số GPLX (bắt buộc)
            <input
              value={licenseNo}
              onChange={(e) => setLicenseNo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00b300] dark:focus:ring-[#00FF00]"
              placeholder="VD: 79C1-xxxxxx"
              disabled={loading}
            />
          </label>

          <label className="text-sm font-bold text-gray-900 dark:text-white">
            Số năm kinh nghiệm (tuỳ chọn)
            <input
              value={expYears}
              onChange={(e) => setExpYears(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00b300] dark:focus:ring-[#00FF00]"
              placeholder="VD: 2"
              disabled={loading}
            />
          </label>
        </div>
      ) : null}

      {err ? (
        <div className="text-xs text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
          {err}
        </div>
      ) : null}

      <button
        disabled={!canSubmit}
        onClick={onSubmit}
        className="w-full rounded-2xl py-3 font-extrabold bg-[#00b300] dark:bg-[#00FF00] text-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Đang gửi hợp đồng..." : "GỬI HỢP ĐỒNG"}
      </button>
    </div>
  );
}
