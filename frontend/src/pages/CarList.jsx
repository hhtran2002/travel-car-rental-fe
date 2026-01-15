import { useEffect, useState } from "react";
import { getAllCars } from "../api/carApi";
import CarCard from "../component/CarCard";
import "../style/carlist.css";

const PAGE_SIZE = 12;

function CarList() {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllCars().then(setCars);
  }, []);

  // ================= PAGINATION LOGIC =================
  const totalPages = Math.ceil(cars.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentCars = cars.slice(startIndex, startIndex + PAGE_SIZE);

  // ================= UI =================
  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách xe</h2>

      {/* GRID XE */}
      <div className="car-list">
        {currentCars.map((car) => (
          <CarCard key={car.carId} car={car} />
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ◀
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default CarList;
