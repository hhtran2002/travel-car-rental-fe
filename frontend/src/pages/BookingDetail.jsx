import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingDetail } from "../api/bookingApi";
import "../style/bookingdetail.css";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookingDetail(id)
      .then(setBooking)
      .catch(() => {
        alert("Không tìm thấy đơn đặt xe");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <p className="loading">Đang tải hợp đồng...</p>;
  if (!booking) return null;

  // ===== XỬ LÝ TRẠNG THÁI THANH TOÁN =====
  const paymentStatus = booking.paymentStatus || "unpaid";

  const paymentLabel = {
    unpaid: "Chưa thanh toán",
    partial: "Đã cọc",
    paid: "Đã thanh toán",
  }[paymentStatus];

  return (
    <div className="booking-detail-wrapper">
      <div className="booking-detail">
        <h1 className="title">HỢP ĐỒNG THUÊ XE</h1>

        <div className="contract-box">
          <div className="row">
            <span>Mã đơn</span>
            <strong>#{booking.bookingId}</strong>
          </div>

          <div className="row">
            <span>Xe</span>
            <strong>{booking.carName}</strong>
          </div>

          <div className="row">
            <span>Thời gian</span>
            <strong>
              {booking.startDate} → {booking.endDate}
            </strong>
          </div>

          <div className="row">
            <span>Điểm đón</span>
            <strong>{booking.pickupLocation}</strong>
          </div>

          <div className="row">
            <span>Điểm trả</span>
            <strong>{booking.dropoffLocation}</strong>
          </div>

          <div className="row status">
            <span>Trạng thái hợp đồng</span>
            <strong>{booking.status}</strong>
          </div>

          {/* ===== TRẠNG THÁI THANH TOÁN ===== */}
          <div className={`row payment ${paymentStatus}`}>
            <span>Thanh toán</span>
            <strong>{paymentLabel}</strong>
          </div>

          <div className="row total">
            <span>Tổng tiền</span>
            <strong>
              {Number(booking.totalPrice || 0).toLocaleString()} VNĐ
            </strong>
          </div>

          {booking.paidAmount > 0 && (
            <div className="row paid">
              <span>Đã thanh toán</span>
              <strong>
                {Number(booking.paidAmount).toLocaleString()} VNĐ
              </strong>
            </div>
          )}
        </div>

        <button className="back-btn" onClick={() => navigate("/")}>
          ⬅ Về trang chủ
        </button>
      </div>
    </div>
  );
}
