import { useNavigate } from "react-router-dom";
import "../style/home.css";

export default function Home() {
    const navigate = useNavigate();

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
