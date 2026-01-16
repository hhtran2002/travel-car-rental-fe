import { useEffect, useState } from "react";
import { getMyBookings } from "../api/accountApi";
import "../style/bookinghistory.css";

export default function BookingHistoryTab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then(res => setBookings(res.data))
      .catch(err => {
        console.error(err);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải lịch sử đặt xe...</p>;

  return (
    <div>
      <h3>Lịch sử đơn đặt xe</h3>

      {bookings.length === 0 ? (
        <p>Chưa có đơn đặt xe nào</p>
      ) : (
        <div className="booking-list">
          {bookings.map(b => (
            <div key={b.bookingId} className="booking-card">
              <div>
                <b>#{b.bookingId}</b> – {b.carName}
              </div>
              <div className="booking-meta">
                {b.startDate} → {b.endDate}
              </div>
              <span className={`status ${b.status}`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
