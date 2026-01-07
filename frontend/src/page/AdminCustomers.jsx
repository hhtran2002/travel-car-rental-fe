import { useEffect, useState } from "react";
import { api } from "../api";
import Pagination from "../component/Pagination";
import "../style/table.css";

export default function AdminCustomers() {
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setErr(null);
        setLoading(true);
        try {
            const res = await api.get("/api/admin/customers", {
                params: { keyword: keyword || null, page, size },
            });
            setData(res.data);
        } catch (e) {
            setErr(`${e.status} - ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [page]);

    const onSearch = (e) => {
        e.preventDefault();
        setPage(0);
        load();
    };

    const setStatus = async (userId, status) => {
        setErr(null);
        try {
            await api.put(`/api/admin/customers/${userId}`, { status });
            load();
        } catch (e) {
            setErr(`${e.status} - ${e.message}`);
        }
    };

    return (
        <div className="card">
            <h2>Admin - Customers</h2>

            {err && <div className="alert error">{err}</div>}

            <form onSubmit={onSearch} className="search-bar">
                <input
                    placeholder="Tìm theo tên / email / phone..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button className="btn primary" disabled={loading}>Search</button>
            </form>

            {loading && <div className="muted">Đang tải...</div>}

            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>UserID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>DOB</th>
                            <th>Gender</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(data?.content || []).map((c) => (
                            <tr key={c.userId}>
                                <td>{c.userId}</td>
                                <td>{c.fullName || "-"}</td>
                                <td>{c.email}</td>
                                <td>{c.phone || "-"}</td>
                                <td>{c.dob || "-"}</td>
                                <td>{c.gender || "-"}</td>
                                <td>
                                    <span className={`badge ${c.status}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td style={{ display: "flex", gap: 6 }}>
                                    <button className="btn" onClick={() => setStatus(c.userId, "active")}>
                                        Active
                                    </button>
                                    <button className="btn danger" onClick={() => setStatus(c.userId, "locked")}>
                                        Lock
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!data?.content?.length && !loading && (
                            <tr><td colSpan="8" style={{ textAlign: "center" }}>Không có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={data?.pageable?.pageNumber || page}
                totalPages={data?.totalPages || 0}
                onPage={setPage}
            />
        </div>
    );
}