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

  if (loading) return <p>Đang tải hợp đồng...</p>;
  if (!booking) return null;

  return (
    <div className="booking-detail">
      <h1>📄 HỢP ĐỒNG THUÊ XE</h1>

      <div className="contract-box">
        <p><b>Mã đơn:</b> #{booking.bookingId}</p>
        <p><b>Xe:</b> {booking.carName}</p>
        <p><b>Thời gian:</b> {booking.startDate} → {booking.endDate}</p>
        <p><b>Điểm đón:</b> {booking.pickupLocation}</p>
        <p><b>Điểm trả:</b> {booking.dropoffLocation}</p>
        <p><b>Trạng thái:</b> {booking.status}</p>
        <p><b>Tổng tiền:</b> {booking.totalPrice?.toLocaleString()} VNĐ</p>
      </div>

      <button onClick={() => navigate("/")}>⬅ Về trang chủ</button>
    </div>
  );
}
