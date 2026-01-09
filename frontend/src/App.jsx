import { Routes, Route, Navigate } from "react-router-dom";
import CarList from "./pages/CarList";
import CarDetail from "./pages/CarDetail";

// Driver Imports
import DriverLayout from "./layouts/DriverLayout";
import DriverDashboard from "./pages/driver/DriverDashboard";
import TripHistory from "./pages/driver/TripHistory";

//admin Imports
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCarList from "./pages/admin/AdminCarList";
import AdminBookingList from "./pages/admin/AdminBookingList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CarList />} />
      <Route path="/cars/:id" element={<CarDetail />} />

      {/* Driver Routes */}
      <Route path="/driver" element={<DriverLayout />}>
        <Route index element={<DriverDashboard />} />{" "}
        {/* Mặc định vào dashboard */}
        <Route path="history" element={<TripHistory />} />
        {/* <Route path="profile" element={<DriverProfile />} /> */}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="cars" element={<AdminCarList />} />
        <Route path="bookings" element={<AdminBookingList />} />
        {/* Các route con chờ phát triển tiếp */}

        <Route
          path="customers"
          element={
            <div className="text-gray-500 dark:text-white">
              Quản lý Khách hàng (Coming Soon)
            </div>
          }
        />
        <Route
          path="contracts"
          element={
            <div className="text-gray-500 dark:text-white">
              Quản lý Hợp đồng (Coming Soon)
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Route>
    </Routes>
  );
}

export default App;
