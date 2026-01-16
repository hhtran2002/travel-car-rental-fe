import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./component/Navbar";
import ProtectedRoute from "./component/ProtectedRoute";
import Footer from "./component/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
import AdminKycRequests from "./pages/admin/AdminKycRequest";
import AdminKycReview from "./pages/admin/AdminKycReview";
import AdminDocumentScan from "./pages/admin/AdminDocumentScan";
import AdminEsignDemo from "./pages/admin/AdminEsignDemo";
import AdminContractReview from "./pages/admin/AdminContractReview";

// Customer
import CustomerLayout from "./layouts/CustomerLayout";
import CustomerTrip from "./pages/customers/CustomerTrip";
import BecomeOwner from "./pages/customers/BecomeOwner";

// Owner
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";

export default function App() {
  const location = useLocation();

  const isAppArea =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/driver") ||
    location.pathname.startsWith("/customer") ||
    location.pathname.startsWith("/become-owner") ||
    location.pathname.startsWith("/owner");

  return (
    <>
      {!isAppArea && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* DRIVER */}
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
          <Route path="*" element={<Navigate to="/driver" replace />} />
        </Route>

        {/* ADMIN */}
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
          <Route path="kyc" element={<AdminKycRequests />} />
          <Route path="kyc/:id" element={<AdminKycReview />} />
          <Route path="documents" element={<AdminDocumentScan />} />
          <Route path="esign" element={<AdminEsignDemo />} />
          <Route path="contracts" element={<AdminContractReview />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* BECOME OWNER (tách riêng để tắt footer/navbar) */}
        <Route
          path="/become-owner"
          element={
            <ProtectedRoute role={["CUSTOMER", "OWNER"]}>
              <BecomeOwner />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/customer/trip" replace />} />
          <Route path="trip" element={<CustomerTrip />} />
          <Route path="*" element={<Navigate to="/customer/trip" replace />} />
        </Route>

        {/* OWNER */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute role="OWNER">
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route
            path="*"
            element={<Navigate to="/owner/dashboard" replace />}
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAppArea && <Footer />}
    </>
  );
}
