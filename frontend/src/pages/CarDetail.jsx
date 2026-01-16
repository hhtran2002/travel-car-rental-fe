import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarDetail } from "../api/carApi";
import { createBooking } from "../api/bookingApi";

import "../style/cardetail.css";
import "../style/bookingmodal.css";

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  // ===== MODAL =====
  const [showModal, setShowModal] = useState(false);

  // ===== BOOKING STATE =====
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== PHƯƠNG THỨC THUÊ =====
  const [rentalType, setRentalType] = useState("self_drive");

  useEffect(() => {
    getCarDetail(id).then((data) => {
      setCar(data);
      setActiveImage(data.mainImage);
    });
  }, [id]);

  // ===== TÍNH SỐ NGÀY =====
  const days =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate) - new Date(startDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // ===== TÍNH GIÁ TẠM (AN TOÀN) =====
  const totalPrice =
    days > 0 && car?.pricePerDay
      ? days * Number(car.pricePerDay) +
        (rentalType === "with_driver" ? 500000 * days : 0)
      : 0;

  const handleBooking = async () => {
    if (!startDate || !endDate || !pickup || !dropoff) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      alert("Ngày trả phải sau ngày nhận");
      return;
    }

    try {
      setLoading(true);

      const booking = await createBooking({
        carId: car.carId,
        driverId: rentalType === "with_driver" ? 0 : null,
        startDate,
        endDate,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        note,
      });

      setShowModal(false);
      navigate(`/bookings/${booking.bookingId}`);
    } catch (err) {
      alert(err.message || "Xe đã được đặt trong thời gian này");
    } finally {
      setLoading(false);
    }
  };

  if (!car) return <p>Đang tải...</p>;

  return (
    <div className="car-detail">
      {/* ===== IMAGE ===== */}
      <div className="car-gallery">
        <img
          className="main-image"
          src={activeImage}
          alt={car.modelName}
        />

        <div className="thumbnail-list">
          {[car.mainImage, ...(car.images || [])].map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="car"
              className={img === activeImage ? "thumb active" : "thumb"}
              onClick={() => setActiveImage(img)}
            />
          ))}
        </div>
      </div>

      {/* ===== INFO ===== */}
      <div className="car-info">
        <h1>{car.modelName}</h1>
        <p>Năm sản xuất: {car.year}</p>

        <p>
          Giá/ngày:{" "}
          {car.pricePerDay
            ? Number(car.pricePerDay).toLocaleString()
            : "Đang cập nhật"}{" "}
          VNĐ
        </p>

        <p>Đánh giá: ⭐ {car.rating}</p>

        <button className="btn-open-booking" onClick={() => setShowModal(true)}>
          🚗 Đặt xe ngay
        </button>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>📅 Thông tin đặt xe</h2>

            <label>Phương thức thuê</label>
            <div className="rental-type">
              <label>
                <input
                  type="radio"
                  checked={rentalType === "self_drive"}
                  onChange={() => setRentalType("self_drive")}
                />
                🚗 Tự lái
              </label>

              <label>
                <input
                  type="radio"
                  checked={rentalType === "with_driver"}
                  onChange={() => setRentalType("with_driver")}
                />
                👨‍✈️ Có tài xế
              </label>
            </div>

            {rentalType === "with_driver" && (
              <p className="driver-note">
                ✔ Tài xế sẽ do hệ thống phân công
              </p>
            )}

            <label>Ngày nhận xe</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <label>Ngày trả xe</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <label>Điểm đón</label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />

            <label>Điểm trả</label>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
            />

            <label>Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {days > 0 && (
              <div className="price-preview">
                <p>Số ngày thuê: <b>{days}</b></p>
                <p>
                  Tổng tiền dự kiến:{" "}
                  <b>{Number(totalPrice).toLocaleString()} VNĐ</b>
                </p>
              </div>
            )}

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Huỷ
              </button>

              <button
                className="btn-confirm"
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? "Đang đặt..." : "Xác nhận đặt xe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
