import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/adminApi";
import Pagination from "../../component/Pagination";


const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^0\d{9,10}$/;
const DEFAULT_AVATAR =
    "https://ui-avatars.com/api/?background=22c55e&color=fff&bold=true&name=";

function Avatar({ fullName, email, avatar }) {
    const name = (fullName || email || "User").trim();

    // Backend có avatar URL
    if (avatar) {
        return (
            <img
                src={avatar}
                alt={name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                onError={(e) => {
                    e.currentTarget.src = `${DEFAULT_AVATAR}${encodeURIComponent(name)}`;
                }}
            />
        );
    }

    // Fallback: ui-avatars (nhìn “thực tế” hơn chữ cái đơn)
    return (
        <img
            src={`${DEFAULT_AVATAR}${encodeURIComponent(name)}`}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
    );
}

function StatusBadge({ status }) {
    const s = String(status || "").toLowerCase();
    const cls =
        s === "active"
            ? "bg-green-100 text-green-700 border-green-200"
            : s === "locked"
                ? "bg-red-100 text-red-700 border-red-200"
                : "bg-gray-100 text-gray-600 border-gray-200";

    const label =
        s === "active" ? "Hoạt động" : s === "locked" ? "Bị khóa" : "Không rõ";

    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${cls}`}>
            {label}
        </span>
    );
}

function normalize(v) {
    return String(v || "").trim().toLowerCase();
}

function formatVNDate(iso) {
    if (!iso) return "-";
    const [y, m, d] = String(iso).split("-");
    if (!y || !m || !d) return iso; // fallback
    return `${d}/${m}/${y}`;
}

function normalizeGenderValue(g) {
    const s = String(g || "").trim().toLowerCase();
    if (s === "nam") return "male";
    if (s === "nữ" || s === "nu") return "female";
    if (s === "male" || s === "female") return s;
    return "";
}


function formatGender(g) {
    const s = normalizeGenderValue(g);
    if (s === "male") return "Nam";
    if (s === "female") return "Nữ";
    return "-";
}





function validateCreate(form) {
    if (!form.fullName.trim()) return "Họ tên không được trống";
    if (!form.email.trim()) return "Email không được trống";
    if (!EMAIL_RE.test(form.email.trim())) return "Email không hợp lệ";
    if (!form.password) return "Mật khẩu không được trống";
    if (form.password.length < 6) return "Mật khẩu tối thiểu 6 ký tự";

    // phone: nếu backend bạn đang để nullable=false thì bắt buộc nhập
    if (!form.phone.trim()) return "Số điện thoại không được trống";
    if (!PHONE_RE.test(form.phone.trim())) return "Số điện thoại không hợp lệ";

    // dob: optional, nếu có thì phải là ngày quá khứ
    if (form.dob) {
        const d = new Date(form.dob);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!(d < today)) return "Ngày sinh phải là ngày trong quá khứ";
    }

    return "";
}

function validatePatch(original, form) {
    // build changed fields first (để validate đúng thứ user đổi)
    const changes = {};

    const oFull = (original?.fullName ?? "");
    const fFull = form.fullName;

    if (fFull !== oFull) {
        const v = String(fFull ?? "").trim();
        if (!v) return { ok: false, msg: "Họ tên không được trống" };
        changes.fullName = v;
    }

    const oPhone = (original?.phone ?? "");
    const fPhone = form.phone;

    if (fPhone !== oPhone) {
        const v = String(fPhone ?? "").trim();
        if (!v) return { ok: false, msg: "Số điện thoại không được trống" };
        if (!PHONE_RE.test(v)) return { ok: false, msg: "Số điện thoại không hợp lệ" };
        changes.phone = v;
    }

    const oDob = (original?.dob ?? "");
    const fDob = form.dob;

    // dob: chỉ gửi nếu khác và có giá trị hợp lệ
    if (fDob !== oDob) {
        if (fDob) {
            const d = new Date(fDob);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (!(d < today)) return { ok: false, msg: "Ngày sinh phải là ngày trong quá khứ" };
            changes.dob = fDob;
        }
        // nếu fDob rỗng => coi như không sửa dob, không add changes.dob
    }


    const oGender = normalizeGenderValue(original?.gender);
    const fGender = normalizeGenderValue(form.gender);

    if (fGender !== oGender) {
        // cho phép bỏ chọn -> gửi null
        changes.gender = fGender ? fGender : null;
    }


    const oAvatar = (original?.avatar ?? "");
    const fAvatar = form.avatar;

    if (fAvatar !== oAvatar) {
        const v = String(fAvatar ?? "").trim();
        changes.avatar = v; // "" => clear, backend đã xử lý
    }

    const oStatus = (original?.status ?? "");
    const fStatus = form.status;

    if (String(fStatus ?? "") !== String(oStatus ?? "")) {
        const v = String(fStatus ?? "").trim();
        if (!v) return { ok: false, msg: "Status không được trống" };
        const s = v.toLowerCase();
        if (!["active", "locked"].includes(s))
            return { ok: false, msg: "Status chỉ nhận 'active' hoặc 'locked'" };
        changes.status = s;
    }

    if (Object.keys(changes).length === 0) {
        return { ok: false, msg: "Không có dữ liệu cập nhật" };
    }

    return { ok: true, changes };
}



export default function AdminCustomers() {
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");



    // Search + debounce
    const [keyword, setKeyword] = useState("");
    const [kw, setKw] = useState("");



    const load = async () => {
        setErr("");
        setLoading(true);
        try {
            const res = await adminApi.getCustomers(page, size, kw);
            setData(res);
        } catch (e) {
            setErr(e?.response?.data?.message || e?.message || "Lỗi tải khách hàng");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const t = setTimeout(() => setKw(keyword), 250);
        return () => clearTimeout(t);
    }, [keyword]);


    useEffect(() => {
        // kw đổi: nếu đang ở trang khác 0 thì reset về 0, chưa gọi API
        if (page !== 0) {
            setPage(0);
            return;
        }
        // nếu đang ở page 0 sẵn thì load luôn
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kw]);

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);




    // Sort FE (vì API chưa có sort param)
    const [sortKey, setSortKey] = useState("newest"); // newest | name | email | status









    const baseIndex =
        (data?.pageable?.pageNumber ?? page) * (data?.pageable?.pageSize ?? size);

    const rows = useMemo(() => {
        const list = data?.content || [];

        const sorted = [...list];
        if (sortKey === "name") {
            sorted.sort((a, b) => normalize(a.fullName).localeCompare(normalize(b.fullName)));
        } else if (sortKey === "email") {
            sorted.sort((a, b) => normalize(a.email).localeCompare(normalize(b.email)));
        } else if (sortKey === "status") {
            sorted.sort((a, b) => normalize(a.status).localeCompare(normalize(b.status)));
        } else {
            sorted.sort((a, b) => (b.userId ?? 0) - (a.userId ?? 0));
        }

        return sorted;
    }, [data, sortKey]);


    const [detailOpen, setDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailErr, setDetailErr] = useState("");
    const [detail, setDetail] = useState(null);
    const [customerId, setCustomerId] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editErr, setEditErr] = useState("");

    const [editForm, setEditForm] = useState({
        fullName: "",
        phone: "",
        dob: "",     // yyyy-mm-dd
        gender: "",  // "", "nam", "nữ", "male", "female"
        avatar: "",
        status: "",  // "", "active", "locked"
    });


    // --- Create modal ---
    const [createOpen, setCreateOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createErr, setCreateErr] = useState("");

    const [createForm, setCreateForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        dob: "",
        gender: "", // "male" | "female" | "" (tuỳ backend)
        avatar: "",
    });

    const openCreate = () => {
        setCreateErr("");
        setCreateForm({
            fullName: "",
            email: "",
            password: "",
            phone: "",
            dob: "",
            gender: "",
            avatar: "",
        });
        setCreateOpen(true);
    };

    const submitCreate = async (e) => {
        e.preventDefault();
        setCreateErr("");

        const msg = validateCreate(createForm);
        if (msg) {
            setCreateErr(msg);
            return;
        }

        setCreateLoading(true);
        try {
            const payload = {
                fullName: createForm.fullName.trim(),
                email: createForm.email.trim(),
                password: createForm.password,
                phone: createForm.phone.trim(),
                dob: createForm.dob ? createForm.dob : null,
                gender: createForm.gender || null,
                avatar: createForm.avatar?.trim() || null,
            };

            await adminApi.createCustomer(payload);

            setCreateOpen(false);

            // refresh list: về page 0 + reload
            if (page !== 0) setPage(0);
            else load();
        } catch (e2) {
            // backend của bạn trả message rất chuẩn rồi -> ưu tiên show message đó
            const status = e2?.response?.status;
            const backendMsg = e2?.response?.data?.message;

            if (status === 409) setCreateErr(backendMsg || "Dữ liệu bị trùng (email/sđt)");
            else if (status === 400) setCreateErr(backendMsg || "Dữ liệu không hợp lệ");
            else setCreateErr(backendMsg || e2?.message || "Lỗi tạo khách hàng");
        } finally {
            setCreateLoading(false);
        }
    };

    const openDetail = async (id) => {
        setDetailOpen(true);
        setDetail(null);
        setDetailErr("");
        setDetailLoading(true);

        try {
            const res = await adminApi.getCustomerById(id);
            setDetail(res);
            setEditMode(false);
            setEditErr("");
            setEditForm({
                fullName: res?.fullName ?? "",
                phone: res?.phone ?? "",
                dob: res?.dob ?? "",
                gender: normalizeGenderValue(res?.gender),
                avatar: res?.avatar ?? "",
                status: res?.status ?? "", // active/locked
            });

        } catch (e) {
            const status = e?.response?.status;
            const msg = e?.response?.data?.message || e?.message || "Lỗi tải chi tiết";

            if (status === 400) setDetailErr("Tài khoản không phải khách hàng.");
            else if (status === 404) setDetailErr("Không tìm thấy khách hàng.");
            else if (status === 403) setDetailErr("Bạn không có quyền truy cập.");
            else setDetailErr(msg);
        } finally {
            setDetailLoading(false);
        }
    };

    const onLookupById = () => {
        const id = Number(String(customerId).trim());
        if (!id || id <= 0 || Number.isNaN(id)) {
            alert("Vui lòng nhập Mã KH hợp lệ (số).");
            return;
        }
        setDetailErr("");
        openDetail(id);
    };

    const submitPatch = async () => {
        if (!detail) return;
        setEditErr("");

        const { ok, msg, changes } = validatePatch(detail, editForm);
        if (!ok) {
            setEditErr(msg);
            return;
        }

        setEditLoading(true);
        try {
            const res = await adminApi.updateCustomer(detail.userId, changes);

            // cập nhật UI ngay cho “thực tế”
            setDetail(res);

            // update form theo dữ liệu mới
            setEditForm({
                fullName: res?.fullName ?? "",
                phone: res?.phone ?? "",
                dob: res?.dob ?? "",
                gender: normalizeGenderValue(res?.gender),
                avatar: res?.avatar ?? "",
                status: res?.status ?? "",
            });

            // refresh list để bảng cập nhật
            load();

            setEditMode(false);
        } catch (e) {
            const status = e?.response?.status;
            const backendMsg = e?.response?.data?.message;

            if (status === 400) setEditErr(backendMsg || "Dữ liệu không hợp lệ");
            else if (status === 409) setEditErr(backendMsg || "Dữ liệu bị trùng");
            else if (status === 401) setEditErr("Chưa đăng nhập hoặc token không hợp lệ.");
            else if (status === 403) setEditErr("Bạn không có quyền truy cập.");
            else if (status === 404) setEditErr("Không tìm thấy khách hàng.");
            else setEditErr(backendMsg || e?.message || "Lỗi cập nhật");
        } finally {
            setEditLoading(false);
        }
    };


    return (
        <>
            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                {/* Top bar */}
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Title */}
                        <div className="shrink-0">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">
                                Quản lý khách hàng
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Tổng: <b>{data?.totalElements ?? 0}</b> • Trang{" "}
                                <b>{(data?.pageable?.pageNumber ?? 0) + 1}</b>/
                                <b>{data?.totalPages ?? 0}</b>
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-3 w-full lg:w-auto">
                            {/* Row 1: search + lookup */}
                            <div className="flex flex-col xl:flex-row gap-2 xl:items-center">
                                <input
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Tìm theo tên / email / SĐT..."
                                    className="w-full xl:w-[360px] px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
          bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-[#00FF00]/30"
                                />

                                <div className="flex gap-2 w-full xl:w-auto">
                                    <input
                                        value={customerId}
                                        onChange={(e) => setCustomerId(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") onLookupById();
                                            if (e.key === "Escape") setCustomerId("");
                                        }}
                                        placeholder="Mã KH (vd: 27)"
                                        className="flex-1 xl:w-[160px] px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
            bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                                        inputMode="numeric"
                                    />

                                    <button
                                        type="button"
                                        onClick={onLookupById}
                                        disabled={detailLoading}
                                        className={`px-4 py-2 rounded-lg border font-bold transition whitespace-nowrap
              ${detailLoading
                                                ? "opacity-60 cursor-not-allowed bg-blue-50 text-blue-700 border-blue-200"
                                                : "border-blue-200 dark:border-blue-700/50 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-200"
                                            }`}
                                    >
                                        {detailLoading ? "Đang tra cứu..." : "Tra cứu"}
                                    </button>
                                </div>
                            </div>

                            {/* Row 2: actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-end">
                                <button
                                    type="button"
                                    onClick={load}
                                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
          bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold transition"
                                >
                                    Reload
                                </button>

                                <button
                                    type="button"
                                    onClick={openCreate}
                                    className="px-4 py-2 rounded-lg font-bold border border-green-200 dark:border-green-700/50
          bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30
          text-green-700 dark:text-green-200 transition"
                                >
                                    + Thêm khách hàng
                                </button>

                                <select
                                    value={sortKey}
                                    onChange={(e) => setSortKey(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700
          bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none"
                                >
                                    <option value="newest">Sắp xếp: Mới nhất</option>
                                    <option value="name">Sắp xếp: Tên</option>
                                    <option value="email">Sắp xếp: Email</option>
                                    <option value="status">Sắp xếp: Trạng thái</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Error */}
                {err && (
                    <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
                        {err}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="py-12 text-center text-gray-500">Đang tải dữ liệu...</div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-[#151515]">
                                    <tr className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="py-3 px-4 w-[72px]">STT</th>
                                        <th className="py-3 px-4 min-w-[260px]">Khách hàng</th>
                                        <th className="py-3 px-4 min-w-[240px]">Liên hệ</th>
                                        <th className="py-3 px-4 text-center w-[140px]">Trạng thái</th>
                                        <th className="py-3 px-4 text-right w-[140px]">Thao tác</th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-700 dark:text-gray-200">
                                    {rows.map((c, idx) => (
                                        <tr
                                            key={c.userId}
                                            className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
                                        >
                                            {/* STT */}
                                            <td className="py-4 px-4 font-mono text-sm text-gray-500">
                                                {baseIndex + idx + 1}
                                            </td>

                                            {/* Customer */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar fullName={c.fullName} email={c.email} avatar={c.avatar} />
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-gray-900 dark:text-white truncate">
                                                            {c.fullName || "Chưa cập nhật"}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            Mã KH: <span className="font-mono">#{c.userId}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="py-4 px-4">
                                                <div className="text-sm text-gray-900 dark:text-gray-100 truncate">
                                                    {c.email || "-"}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {c.phone || "Chưa có SĐT"}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4 text-center">
                                                <StatusBadge status={c.status} />
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() => openDetail(c.userId)}
                                                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-semibold"
                                                >
                                                    Xem
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {rows.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-gray-400">
                                                Không tìm thấy khách hàng phù hợp.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-5 flex justify-center sm:justify-end">
                            <Pagination
                                page={data?.pageable?.pageNumber ?? page}
                                totalPages={data?.totalPages ?? 0}
                                onPage={setPage}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Modal chi tiết */}
            {detailOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-[9999] grid place-items-center p-4"
                    onMouseDown={() => setDetailOpen(false)}
                >
                    <div
                        className="w-full max-w-xl bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-5"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-lg font-black text-gray-900 dark:text-white">
                                Chi tiết khách hàng
                            </div>
                            <button
                                onClick={() => setDetailOpen(false)}
                                className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                title="Đóng"
                            >
                                ✕
                            </button>
                        </div>

                        {detailLoading && (
                            <div className="py-10 text-center text-gray-500">Đang tải chi tiết...</div>
                        )}

                        {!detailLoading && detailErr && (
                            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
                                {detailErr}
                            </div>
                        )}

                        {!detailLoading && !detailErr && detail && (
                            <>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar fullName={detail.fullName} email={detail.email} avatar={detail.avatar} />
                                        <div>
                                            <div className="text-lg font-black text-gray-900 dark:text-white">
                                                {detail.fullName || "Chưa cập nhật"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Mã KH: <span className="font-mono">#{detail.userId}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditErr("");
                                                if (!editMode) {
                                                    // bật edit -> reset form theo detail hiện tại
                                                    setEditForm({
                                                        fullName: detail?.fullName ?? "",
                                                        phone: detail?.phone ?? "",
                                                        dob: detail?.dob ?? "",
                                                        gender: normalizeGenderValue(detail?.gender),
                                                        avatar: detail?.avatar ?? "",
                                                        status: detail?.status ?? "",
                                                    });
                                                }
                                                setEditMode(!editMode);
                                            }}
                                            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-bold"
                                            disabled={editLoading}
                                        >
                                            {editMode ? "Hủy" : "Chỉnh sửa"}
                                        </button>
                                    </div>
                                </div>

                                {editErr && (
                                    <div className="mb-3 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
                                        {editErr}
                                    </div>
                                )}

                                {!editMode ? (
                                    // === VIEW MODE (giữ như bạn đang làm) ===
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <InfoBox label="Email" value={detail.email || "-"} />
                                        <InfoBox label="Số điện thoại" value={detail.phone || "-"} />
                                        <InfoBox label="Ngày sinh" value={formatVNDate(detail.dob)} />
                                        <InfoBox label="Giới tính" value={formatGender(detail.gender)} />

                                        <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 md:col-span-2 flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-gray-400 uppercase font-bold">Trạng thái</div>
                                                <div className="mt-1">
                                                    <StatusBadge status={detail.status} />
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400 italic">Bạn có thể chỉnh trong chế độ “Chỉnh sửa”</div>
                                        </div>
                                    </div>
                                ) : (
                                    // === EDIT MODE ===
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2">
                                                <label className="text-xs text-gray-400 uppercase font-bold">Họ tên</label>
                                                <input
                                                    value={editForm.fullName}
                                                    onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                                                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500/30"
                                                    placeholder="Nguyễn Văn A"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-gray-400 uppercase font-bold">Số điện thoại</label>
                                                <input
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                                                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500/30"
                                                    placeholder="0xxxxxxxxx"
                                                    inputMode="numeric"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-gray-400 uppercase font-bold">Ngày sinh</label>
                                                <input
                                                    type="date"
                                                    value={editForm.dob || ""}
                                                    onChange={(e) => setEditForm((p) => ({ ...p, dob: e.target.value }))}
                                                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500/30"
                                                />

                                            </div>

                                            <div>
                                                <label className="text-xs text-gray-400 uppercase font-bold">Giới tính</label>
                                                <select
                                                    value={editForm.gender ?? ""}
                                                    onChange={(e) => setEditForm((p) => ({ ...p, gender: e.target.value }))}
                                                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none"
                                                >
                                                    <option value="">(Không chọn)</option>
                                                    <option value="male">Nam</option>
                                                    <option value="female">Nữ</option>
                                                </select>

                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="text-xs text-gray-400 uppercase font-bold">Avatar URL</label>
                                                <input
                                                    value={editForm.avatar ?? ""}
                                                    onChange={(e) => setEditForm((p) => ({ ...p, avatar: e.target.value }))}
                                                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500/30"
                                                    placeholder="https://..."
                                                />

                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="text-xs text-gray-400 uppercase font-bold">Trạng thái</label>
                                                <select
                                                    value={editForm.status ?? "active"}
                                                    onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                                                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none"
                                                >
                                                    <option value="active">Hoạt động</option>
                                                    <option value="locked">Bị khóa</option>
                                                </select>

                                            </div>
                                        </div>

                                        <div className="mt-5 flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setEditMode(false)}
                                                disabled={editLoading}
                                                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-bold"
                                            >
                                                Hủy
                                            </button>

                                            <button
                                                type="button"
                                                onClick={submitPatch}
                                                disabled={editLoading}
                                                className={`px-4 py-2 rounded-lg font-bold transition border
              ${editLoading
                                                        ? "opacity-60 cursor-not-allowed bg-green-50 text-green-700 border-green-200"
                                                        : "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/50"
                                                    }`}
                                            >
                                                {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                    </div>
                </div>
            )}

            {
                createOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-[9999] grid place-items-center p-4"
                        onMouseDown={() => !createLoading && setCreateOpen(false)}
                    >
                        <form
                            className="w-full max-w-xl bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-5"
                            onMouseDown={(e) => e.stopPropagation()}
                            onSubmit={submitCreate}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-lg font-black text-gray-900 dark:text-white">
                                    Tạo khách hàng
                                </div>
                                <button
                                    type="button"
                                    onClick={() => !createLoading && setCreateOpen(false)}
                                    className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                    title="Đóng"
                                >
                                    ✕
                                </button>
                            </div>

                            {createErr && (
                                <div className="mb-3 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
                                    {createErr}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="md:col-span-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold">Họ tên *</label>
                                    <input
                                        value={createForm.fullName}
                                        onChange={(e) => setCreateForm((p) => ({ ...p, fullName: e.target.value }))}
                                        className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500/30"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold">Email *</label>
                                    <input
                                        value={createForm.email}
                                        onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                                        className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500/30"
                                        placeholder="abc@gmail.com"
                                        inputMode="email"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold">Mật khẩu *</label>
                                    <input
                                        type="password"
                                        value={createForm.password}
                                        onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                                        className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500/30"
                                        placeholder="Tối thiểu 6 ký tự"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold">Số điện thoại *</label>
                                    <input
                                        value={createForm.phone}
                                        onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
                                        className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500/30"
                                        placeholder="0xxxxxxxxx"
                                        inputMode="numeric"
                                    />
                                    <div className="mt-1 text-[11px] text-gray-400">
                                        Bắt đầu bằng 0, dài 10–11 số.
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold">Ngày sinh</label>
                                    <input
                                        type="date"
                                        value={createForm.dob}
                                        onChange={(e) => setCreateForm((p) => ({ ...p, dob: e.target.value }))}
                                        className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500/30"
                                    />


                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold">Giới tính</label>
                                    <select
                                        value={createForm.gender}
                                        onChange={(e) => setCreateForm((p) => ({ ...p, gender: e.target.value }))}
                                        className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none"
                                    >
                                        <option value="">(Không chọn)</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold">Avatar URL</label>
                                    <input
                                        value={createForm.avatar}
                                        onChange={(e) => setCreateForm((p) => ({ ...p, avatar: e.target.value }))}
                                        className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500/30"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => !createLoading && setCreateOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-bold"
                                    disabled={createLoading}
                                >
                                    Hủy
                                </button>

                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className={`px-4 py-2 rounded-lg font-bold transition border
            ${createLoading
                                            ? "opacity-60 cursor-not-allowed bg-green-50 text-green-700 border-green-200"
                                            : "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/50"
                                        }`}
                                >
                                    {createLoading ? "Đang tạo..." : "Tạo khách hàng"}
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }

        </>
    );
}




function InfoBox({ label, value }) {
    return (
        <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-400 uppercase font-bold">{label}</div>
            <div className="text-sm text-gray-900 dark:text-gray-100 mt-1">{value}</div>
        </div>
    );
}


