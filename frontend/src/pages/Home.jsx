import { useNavigate } from "react-router-dom";
import "../style/home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="homePage max-w-7xl mx-auto px-4">
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
                            <h1 className="heroTitle">
                                Thuê xe du lịch – Cùng bạn trên mọi hành trình
                            </h1>

                            <div className="heroLine" />

                            <p className="heroSub">
                                Đa dạng dòng xe • Giá minh bạch • Đặt xe nhanh chóng
                            </p>

                            <div className="heroActions">
                                <button
                                    className="btnPrimary"
                                    onClick={() => navigate("/cars")}
                                >
                                    🚗 Xem danh sách xe
                                </button>

                                <button
                                    className="btnOutline"
                                    onClick={() => navigate("/account")}
                                >
                                    👤 Tài khoản của tôi
                                </button>

                                <button
                                    className="btnOutline"
                                    onClick={() => navigate("/terms")}
                                >
                                    📜 Điều khoản & Chính sách
                                </button>
                            </div>
                        </div>
                    </div>
<<<<<<< HEAD
=======

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
>>>>>>> origin/nhanh-feature-admincustomer_auth
                </div>

                {/* FEATURE */}
                <div className="miniGrid">
                    <div className="miniCard">
                        <div className="miniIcon">🛡️</div>
                        <div>
                            <div className="miniTitle">Minh bạch</div>
                            <div className="miniText">
                                Giá thuê rõ ràng, thông tin xe đầy đủ.
                            </div>
                        </div>
                    </div>

                    <div className="miniCard">
                        <div className="miniIcon">⚡</div>
                        <div>
                            <div className="miniTitle">Nhanh chóng</div>
                            <div className="miniText">
                                Chỉ vài bước để xem và đặt xe phù hợp.
                            </div>
                        </div>
                    </div>

                    <div className="miniCard">
                        <div className="miniIcon">💬</div>
                        <div>
                            <div className="miniTitle">Hỗ trợ</div>
                            <div className="miniText">
                                Hỗ trợ khách hàng, hợp đồng và thanh toán rõ ràng.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
