import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./component/Navbar";
import ProtectedRoute from "./component/ProtectedRoute";
import Footer from "./component/Footer";

// Pages
import Home from "./pages/Home";
import OwnerRegisterGuide from "./pages/OwnerRegisterGuide";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminCustomers from "./pages/AdminCustomers";
import NotFound from "./pages/NotFound";

// Car pages
import CarList from "./pages/CarList";
import CarDetail from "./pages/CarDetail";

// Driver
import DriverLayout from "./layouts/DriverLayout";
import DriverDashboard from "./pages/driver/DriverDashboard";
import TripHistory from "./pages/driver/TripHistory";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCarList from "./pages/admin/AdminCarList";
import AdminBookingList from "./pages/admin/AdminBookingList";

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />

      <Routes location={location}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Driver routes */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute role="DRIVER">
              <DriverLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DriverDashboard />} />
          <Route path="history" element={<TripHistory />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="cars" element={<AdminCarList />} />
          <Route path="bookings" element={<AdminBookingList />} />

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

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}
