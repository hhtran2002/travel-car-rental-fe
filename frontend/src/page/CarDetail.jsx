import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCarDetail } from "../api/carApi";

function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    getCarDetail(id).then(setCar);
  }, [id]);

  if (!car) return <p>Loading...</p>;

  return (
    <div>
      <h2>{car.modelName}</h2>
      <img src={car.mainImage} width="300" />
      <p>Biển số: {car.plateNumber}</p>
      <p>Năm: {car.year}</p>
      <p>Trạng thái: {car.status}</p>
    </div>
  );
}

export default CarDetail;
