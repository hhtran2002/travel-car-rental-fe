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


                    </div>

                    {/* Policy */}
                    <div className="tcrFooter__col">
                        <div className="tcrFooter__title">Chính sách</div>
                        <ul className="tcrFooter__list">
                            <Link to="/terms">Điều khoản & Chính sách</Link>
                        </ul>
                    </div>

                    {/* Learn more */}
                    <div className="tcrFooter__col">
                        <div className="tcrFooter__title">Tìm hiểu thêm</div>
                        <ul className="tcrFooter__list">
                            <li><Link className="tcrFooter__link" to="/">Trang chủ</Link></li>
                            <li><Link className="tcrFooter__link" to="#">Hướng dẫn đặt xe</Link></li>
                            <li><Link className="tcrFooter__link" to="#">Hướng dẫn thanh toán</Link></li>
                        </ul>
                    </div>
                </div>

               
                </div>
        </footer>
    );
}