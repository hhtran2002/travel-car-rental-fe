import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/home.css";

export default function Home() {
    const navigate = useNavigate();

    const [mode, setMode] = useState("self"); // self | driver | long
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const longTermHint = useMemo(() => {
        if (!startDate || !endDate) return "";
        const s = new Date(startDate);
        const e = new Date(endDate);
        if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
        const diffDays = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) return "⚠️ Ngày trả phải sau ngày nhận";
        if (diffDays >= 7) return `✅ Bạn đang thuê ${diffDays} ngày (dài hạn)`;
        return `Gợi ý: thuê ≥ 7 ngày để tính “dài hạn” (hiện ${diffDays} ngày)`;
    }, [startDate, endDate]);

    const onSearch = () => {
        // Validate tối thiểu theo DB booking
        if (!pickup.trim()) return alert("Vui lòng nhập Điểm đón (pickup_location)");
        if (!dropoff.trim()) return alert("Vui lòng nhập Điểm trả (dropoff_location)");
        if (!startDate) return alert("Vui lòng chọn Ngày/giờ nhận xe (start_date)");
        if (!endDate) return alert("Vui lòng chọn Ngày/giờ trả xe (end_date)");

        const s = new Date(startDate);
        const e = new Date(endDate);
        if (e <= s) return alert("Ngày/giờ trả xe phải sau ngày/giờ nhận xe.");

        // Đẩy query sang trang danh sách xe (bạn làm trang /cars sau)
        const params = new URLSearchParams({
            pickup,
            dropoff,
            startDate,
            endDate,
            withDriver: mode === "driver" ? "1" : "0",
            longTerm: mode === "long" ? "1" : "0",
        });

        navigate(`/cars?${params.toString()}`);
    };

    return (
        <div className="homePage">
            <div className="container">
                {/* HERO */}
                <div className="hero">
                    <div
                        className="heroBanner"
                        style={{
                            backgroundImage:
                                'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2400&auto=format&fit=crop")',
                        }}
                    >
                        <div className="heroOverlay" />
                        <div className="heroContent">
                            <h1 className="heroTitle">Thuê xe du lịch – Cùng bạn trên mọi hành trình</h1>
                            <div className="heroLine" />
                            <p className="heroSub">
                                Chọn xe nhanh – minh bạch – an toàn, với nhiều dòng xe theo nhu cầu của bạn.
                            </p>
                        </div>
                    </div>

                    {/* SEARCH CARD (đúng DB: pickup/dropoff/start/end) */}
                    <div className="searchWrap">
                        <div className="tabs">
                            <button
                                className={mode === "self" ? "tab active" : "tab"}
                                onClick={() => setMode("self")}
                                type="button"
                            >
                                🚗 Xe tự lái
                            </button>
                            <button
                                className={mode === "driver" ? "tab active" : "tab"}
                                onClick={() => setMode("driver")}
                                type="button"
                            >
                                👨‍✈️ Xe có tài xế
                            </button>
                            <button
                                className={mode === "long" ? "tab active" : "tab"}
                                onClick={() => setMode("long")}
                                type="button"
                            >
                                🗓️ Thuê dài hạn
                            </button>
                        </div>

                        <div className="searchCard">
                            <div className="field">
                                <div className="label">📍 Điểm đón</div>
                                <input
                                    className="input"
                                    value={pickup}
                                    onChange={(e) => setPickup(e.target.value)}
                                
                                />
                            
                            </div>

                            <div className="vDivider" />

                            <div className="field">
                                <div className="label">📍 Điểm trả</div>
                                <input
                                    className="input"
                                    value={dropoff}
                                    onChange={(e) => setDropoff(e.target.value)}
                                    
                                />
                                
                            </div>

                            <div className="vDivider" />

                            <div className="field">
                                <div className="label">🗓️ Nhận xe</div>
                                <input
                                    className="input"
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                
                            </div>

                            <div className="vDivider" />

                            <div className="field">
                                <div className="label">⏱️ Trả xe</div>
                                <input
                                    className="input"
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                
                            </div>

                            <button className="btnSearch" onClick={onSearch} type="button">
                                Tìm xe
                            </button>
                        </div>

                        {mode === "long" && (
                            <div className="longHint">{longTermHint || "Gợi ý: chọn ngày để xem số ngày thuê."}</div>
                        )}

                        {mode === "driver" && (
                            <div className="longHint">
                                Chế độ <b>Xe có tài xế</b>: khi đặt xe sẽ có <b>driver_id</b> (không null).
                            </div>
                        )}
                    </div>
                </div>

                {/* Gợi ý section dưới hero (cho đẹp giống landing page) */}
                <div className="miniGrid">
                    <div className="miniCard">
                        <div className="miniIcon">🛡️</div>
                        <div>
                            <div className="miniTitle">Minh bạch</div>
                            <div className="miniText">Thông tin rõ ràng, dễ lựa chọn dòng xe phù hợp.</div>
                        </div>
                    </div>
                    <div className="miniCard">
                        <div className="miniIcon">⚡</div>
                        <div>
                            <div className="miniTitle">Nhanh chóng</div>
                            <div className="miniText">Tìm xe theo lịch nhận/trả, tránh trùng lịch booking.</div>
                        </div>
                    </div>
                    <div className="miniCard">
                        <div className="miniIcon">💬</div>
                        <div>
                            <div className="miniTitle">Hỗ trợ</div>
                            <div className="miniText">Có thể mở rộng: giảm giá (discount), hợp đồng (contract), thanh toán (payment).</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}