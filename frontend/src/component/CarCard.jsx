import { useNavigate } from "react-router-dom";
import "../style/carcard.css";

function CarCard({ car }) {
  const navigate = useNavigate();

  return (
    <div
      className="car-card"
      onClick={() => navigate(`/cars/${car.carId}`)}
    >
      <img src={car.mainImage} alt={car.modelName} />

      <div className="car-card-body">
        <h3 className="car-card-title">{car.modelName}</h3>
        <p className="car-card-year">Năm: {car.year}</p>
      </div>
    </div>
  );
}

export default CarCard;
