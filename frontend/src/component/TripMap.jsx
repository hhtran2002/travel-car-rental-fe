// frontend/src/component/TripMap.jsx
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

// Fix lỗi icon mặc định của Leaflet trong React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component con để xử lý vẽ đường (Routing)
const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]), // Điểm đi
        L.latLng(end[0], end[1]), // Điểm đến
      ],
      routeWhileDragging: false,
      show: false, // Ẩn bảng chỉ dẫn text (turn-by-turn) cho gọn
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#00FF00", weight: 5 }], // Màu xanh Neon theo theme
      },
      createMarker: function () {
        return null;
      }, // Ẩn marker mặc định của routing machine (để dùng marker của mình nếu muốn)
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, start, end]);

  return null;
};

const TripMap = ({ startPoint, endPoint }) => {
  // Mặc định view ở TP.HCM nếu chưa có tọa độ
  const defaultCenter = [10.762622, 106.660172];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg relative z-0">
      <MapContainer
        center={startPoint || defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Vẽ đường đi nếu có đủ 2 điểm */}
        {startPoint && endPoint && (
          <RoutingMachine start={startPoint} end={endPoint} />
        )}

        {/* Marker điểm đi */}
        {startPoint && (
          <Marker position={startPoint}>
            <Popup>Điểm đón khách</Popup>
          </Marker>
        )}

        {/* Marker điểm đến */}
        {endPoint && (
          <Marker position={endPoint}>
            <Popup>Điểm trả khách</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default TripMap;
