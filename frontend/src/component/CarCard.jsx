import { useNavigate } from "react-router-dom";

function CarCard({ car }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/cars/${car.carId}`)}>
      <img src={car.mainImage} width="200" />
      <h3>{car.modelName}</h3>
      <p>Năm: {car.year}</p>
    </div>
  );
}

export default CarCard;
