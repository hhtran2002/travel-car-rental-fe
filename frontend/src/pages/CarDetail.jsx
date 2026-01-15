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

  useEffect(() => {
    getCarDetail(id).then((data) => {
      setCar(data);
      setActiveImage(data.mainImage);
    });
  }, [id]);

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
        driverId: null,
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
      {/* IMAGE SECTION */}
      <div className="car-gallery">
        <img className="main-image" src={activeImage} alt={car.modelName} />

        <div className="thumbnail-list">
          {[car.mainImage, ...car.images].map((img, idx) => (
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

      {/* INFO */}
      <div className="car-info">
        <h1>{car.modelName}</h1>
        <p>Năm sản xuất: {car.year}</p>
        <p>Trạng thái: {car.status}</p>
        <p>Đánh giá: ⭐ {car.rating}</p>

        <button className="btn-open-booking" onClick={() => setShowModal(true)}>
          🚗 Đặt xe ngay
        </button>
      </div>

      {/* ===== BOOKING MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>📅 Thông tin đặt xe</h2>

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
