import "../style/footer.css";
import { Link } from "react-router-dom";

function IconFacebook() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.6-1.5H16.8V5.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.6 1.6-4.6 4.7V11H6.7v3h2.8v8h4z"
            />
        </svg>
    );
}
function IconYoutube() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.9 4.6 12 4.6 12 4.6s-5.9 0-7.5.5A3 3 0 0 0 2.4 7.2 31.6 31.6 0 0 0 2 12a31.6 31.6 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.6.5 7.5.5 7.5.5s5.9 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 22 12a31.6 31.6 0 0 0-.4-4.8zM10 15.3V8.7L15.7 12 10 15.3z"
            />
        </svg>
    );
}
function IconZalo() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M7.2 7.4h9.6c.4 0 .7.3.7.7v.8c0 .2-.1.4-.2.5l-7.1 8.2h6.6c.4 0 .7.3.7.7v.8c0 .4-.3.7-.7.7H7.2c-.4 0-.7-.3-.7-.7v-.8c0-.2.1-.4.2-.5l7.1-8.2H7.2c-.4 0-.7-.3-.7-.7v-.8c0-.4.3-.7.7-.7z"
            />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="tcrFooter">
            <div className="container tcrFooter__inner">
                <div className="tcrFooter__grid">
                    {/* Left: brand + contact */}
                    <div className="tcrFooter__brand">
                        <div className="tcrFooter__brandTop">
                            <div className="tcrFooter__logo">M</div>
                            <div>
                                <div className="tcrFooter__name">Travel Car Rental</div>
                                <div className="tcrFooter__desc">
                                    Nền tảng thuê xe du lịch: tự lái / có tài xế / dài hạn.
                                </div>
                            </div>
                        </div>

                        <div className="tcrFooter__contact">
                            <div className="tcrFooter__contactRow">
                                <span className="k">Hotline</span>
                                <span className="v">0900 000 000</span>
                            </div>
                            <div className="tcrFooter__contactRow">
                                <span className="k">Hỗ trợ</span>
                                <span className="v muted">07:00 - 22:00</span>
                            </div>
                            <div className="tcrFooter__contactRow">
                                <span className="k">Email</span>
                                <span className="v">support@travelcarrental.vn</span>
                            </div>
                        </div>

                        <div className="tcrFooter__social">
                            <a className="tcrFooter__socialBtn" href="#" aria-label="Facebook">
                                <IconFacebook />
                            </a>
                            <a className="tcrFooter__socialBtn" href="#" aria-label="TikTok/Zalo">
                                <IconZalo />
                            </a>
                            <a className="tcrFooter__socialBtn" href="#" aria-label="Youtube">
                                <IconYoutube />
                            </a>
                        </div>
                    </div>

                    {/* Policy */}
                    <div className="tcrFooter__col">
                        <div className="tcrFooter__title">Chính sách</div>
                        <ul className="tcrFooter__list">
                            <li><Link className="tcrFooter__link" to="#">Chính sách & quy định</Link></li>
                            <li><Link className="tcrFooter__link" to="#">Chính sách bảo mật</Link></li>
                            <li><Link className="tcrFooter__link" to="#">Giải quyết khiếu nại</Link></li>
                            <li><Link className="tcrFooter__link" to="#">Điều khoản sử dụng</Link></li>
                        </ul>
                    </div>

                    {/* Learn more */}
                    <div className="tcrFooter__col">
                        <div className="tcrFooter__title">Tìm hiểu thêm</div>
                        <ul className="tcrFooter__list">
                            <li><Link className="tcrFooter__link" to="/">Trang chủ</Link></li>
                            <li><Link className="tcrFooter__link" to="#">Hướng dẫn đặt xe</Link></li>
                            <li><Link className="tcrFooter__link" to="#">Hướng dẫn thanh toán</Link></li>
                            <li><Link className="tcrFooter__link" to="/owner/register-guide">Trở thành chủ xe</Link></li>
                        </ul>
                    </div>

                    {/* Services mapped from DB (hiển thị theo nghiệp vụ, không show tên bảng lộ liễu) */}
                    <div className="tcrFooter__col">
                        <div className="tcrFooter__title">Dịch vụ</div>
                        <ul className="tcrFooter__list">
                            <li><span className="tcrFooter__dot" /> Đặt xe & quản lý chuyến đi</li>
                            <li><span className="tcrFooter__dot" /> Danh sách xe (hãng, loại, ảnh)</li>
                            <li><span className="tcrFooter__dot" /> Thuê xe có tài xế (tuỳ chọn)</li>
                            <li><span className="tcrFooter__dot" /> Khuyến mãi & mã giảm giá</li>
                            <li><span className="tcrFooter__dot" /> Hợp đồng & thanh toán</li>
                            <li><span className="tcrFooter__dot" /> Bảng giá theo quy tắc</li>
                        </ul>

                    </div>
                </div>

                <div className="tcrFooter__divider" />

                <div className="tcrFooter__bottom">
                    <div className="tcrFooter__copy">
                        © 2025 Travel Car Rental. All rights reserved.
                    </div>

                    <div className="tcrFooter__bottomRight">
                        <div className="tcrFooter__miniLinks">
                            <Link to="#" className="mini">Chính sách</Link>
                            <span className="sep">•</span>
                            <Link to="#" className="mini">Điều khoản</Link>
                        </div>

                        <div className="tcrFooter__payments">
                            <span className="payTitle">Phương thức thanh toán:</span>
                            <span className="payPill">MoMo</span>
                            <span className="payPill">VNPay</span>


                            <span className="payPill">Tiền mặt</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}