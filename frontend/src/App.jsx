import { Routes, Route, Navigate, useLocation } from "react-router-dom";


<<<<<<< HEAD
// Pages (public)
=======
import ProtectedRoute from "./component/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
// Pages
>>>>>>> origin/nhanh-feature-admincustomer_auth
import Home from "./pages/Home";
import OwnerRegisterGuide from "./pages/OwnerRegisterGuide";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";

// Car pages
import CarList from "./pages/CarList";
import CarDetail from "./pages/CarDetail";
import BookingDetail from "./pages/BookingDetail";

// ================= DRIVER =================
import DriverLayout from "./layouts/DriverLayout";
import DriverDashboard from "./pages/driver/DriverDashboard";
import TripHistory from "./pages/driver/TripHistory";

// ================= ADMIN =================
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCarList from "./pages/admin/AdminCarList";
import AdminBookingList from "./pages/admin/AdminBookingList";
import AdminCustomers from "./pages/admin/AdminCustomers";

// ================= ACCOUNT (CUSTOMER) =================
import ProfileTab from "./pages/ProfileTab";
import BookingHistoryTab from "./pages/BookingHistoryTab";
import AccountPage from "./pages/AccountPage";

export default function App() {
  const location = useLocation();

  return (
    <>

<<<<<<< HEAD
      <Routes location={location}>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<Terms />} />
=======
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/owner/register-guide" element={<OwnerRegisterGuide />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
>>>>>>> origin/nhanh-feature-admincustomer_auth

        {/* ================= CUSTOMER ACCOUNT ================= */}
        <Route
          path="/account"
          element={
            // <ProtectedRoute role="CUSTOMER">
              <AccountPage />
            // </ProtectedRoute>
          }
        >
          {/* Mặc định vào profile */}
          <Route index element={<Navigate to="profile" />} />
          <Route path="profile" element={<ProfileTab />} />
          <Route path="bookings" element={<BookingHistoryTab />} />
        </Route>

        {/* ================= DRIVER ================= */}
        <Route
          path="/driver"
          element={
<<<<<<< HEAD
            // <ProtectedRoute role="DRIVER">
=======
            <ProtectedRoute allowRoles={["driver"]}>
>>>>>>> origin/nhanh-feature-admincustomer_auth
              <DriverLayout />
            // </ProtectedRoute>
          }
        >
          <Route index element={<DriverDashboard />} />
          <Route path="history" element={<TripHistory />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
<<<<<<< HEAD
            // <ProtectedRoute role="ADMIN">
=======
            <ProtectedRoute allowRoles={["admin"]}>
>>>>>>> origin/nhanh-feature-admincustomer_auth
              <AdminLayout />
            // </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="cars" element={<AdminCarList />} />
          <Route path="bookings" element={<AdminBookingList />} />
          <Route path="customers" element={<AdminCustomers />} />



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

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>


    </>
  );
}
