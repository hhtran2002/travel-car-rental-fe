import { useState } from "react";
import "../style/terms.css";

export default function Terms() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="termsPage">
            <div className="termsContainer">
                <h1>Điều khoản & Chính sách thuê xe</h1>

                {/* 1 */}
                <section className={`termsSection ${openIndex === 1 ? "open" : ""}`}>
                    <h2 onClick={() => toggle(1)}>
                        1. Giới thiệu
                        <span className="arrow">⌄</span>
                    </h2>
                    <div className="termsContent">
                        <p>
                            Hệ thống thuê xe trực tuyến, cung cấp dịch vụ thuê xe tự lái hoặc xe có tài xế.
                        </p>
                    </div>
                </section>

                {/* 2 */}
                <section className={`termsSection ${openIndex === 2 ? "open" : ""}`}>
                    <h2 onClick={() => toggle(2)}>
                        2. Điều kiện sử dụng
                        <span className="arrow">⌄</span>
                    </h2>
                    <div className="termsContent">
                        <ul>
                            <li>Khách hàng từ 18 tuổi trở lên</li>
                            <li>Có giấy phép lái xe hợp lệ (nếu tự lái)</li>
                            <li>Tài khoản hợp lệ và đang hoạt động</li>
                        </ul>
                    </div>
                </section>

                {/* 3 */}
                <section className={`termsSection ${openIndex === 3 ? "open" : ""}`}>
                    <h2 onClick={() => toggle(3)}>
                        3. Quy trình đặt xe
                        <span className="arrow">⌄</span>
                    </h2>
                    <div className="termsContent">
                        <p><strong>Bước 1:</strong> Chọn xe cần thuê.</p>
                        <p><strong>Bước 2:</strong> Xem chi tiết giá thuê và điều kiện.</p>
                        <p><strong>Bước 3:</strong> Nhập thông tin đặt xe</p>
                        <p><strong>Bước 5:</strong> Chọn phương thức thanh toán.</p>
                        <p><strong>Bước 6:</strong> Xác nhận và hoàn tất đặt xe.</p>
                        </div>
                </section>

                {/* 4 */}
                <section className={`termsSection ${openIndex === 4 ? "open" : ""}`}>
                    <h2 onClick={() => toggle(4)}>
                        4. Giá thuê & phụ phí
                        <span className="arrow">⌄</span>
                    </h2>
                    <div className="termsContent">
                        <ul>
                            <li>Giá được tính theo giờ hoặc ngày</li>
                            <li>Có thể áp dụng phụ phí cuối tuần, lễ</li>
                            <li>Trả xe quá giờ sẽ bị tính thêm phí</li>
                        </ul>
                    </div>
                </section>

                {/* 5 */}
                <section className={`termsSection ${openIndex === 5 ? "open" : ""}`}>
                    <h2 onClick={() => toggle(5)}>
                        5. Hủy xe & hoàn tiền
                        <span className="arrow">⌄</span>
                    </h2>
                    <div className="termsContent">
                        <p>
                            Việc hủy xe phải tuân theo chính sách hủy đã công bố trên hệ thống.
                        </p>
                    </div>
                </section>

                {/* 6 */}
                <section className={`termsSection ${openIndex === 6 ? "open" : ""}`}>
                    <h2 onClick={() => toggle(6)}>
                        6. Trách nhiệm các bên
                        <span className="arrow">⌄</span>
                    </h2>
                    <div className="termsContent">
                        <p>
                            Khách hàng có trách nhiệm bảo quản xe trong thời gian thuê.
                            Hệ thống cam kết cung cấp dịch vụ đúng thông tin.
                        </p>
                    </div>
                </section>

                <p className="updatedAt">Cập nhật lần cuối: 01/2026</p>
            </div>
        </div>
    );
}
