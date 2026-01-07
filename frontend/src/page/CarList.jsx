import { useEffect, useState } from "react";
import { getAllCars } from "../api/carApi";
import CarCard from "../component/CarCard";

function CarList() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    getAllCars().then(setCars);
  }, []);

  return (
    <div>
      <h2>Danh sách xe</h2>
      {cars.map(car => (
        <CarCard key={car.carId} car={car} />
      ))}
    </div>
  );
}

export default CarList;
