import { Routes, Route, Navigate } from "react-router-dom";

/* ========== CORE ========== */
import ProtectedRoute from "./component/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

/* ========== PUBLIC PAGES ========== */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

/* ========== CAR ========== */
import CarList from "./pages/CarList";
import CarDetail from "./pages/CarDetail";
import BookingDetail from "./pages/BookingDetail";

/* ========== CUSTOMER ========== */
import CustomerLayout from "./layouts/CustomerLayout";
import CustomerTrip from "./pages/customers/CustomerTrip";
import AccountPage from "./pages/AccountPage";
import ProfileTab from "./pages/ProfileTab";
import BookingHistoryTab from "./pages/BookingHistoryTab";
import BecomeOwner from "./pages/customers/BecomeOwner";

/* ========== DRIVER ========== */
import DriverLayout from "./layouts/DriverLayout";
import DriverDashboard from "./pages/driver/DriverDashboard";
import TripHistory from "./pages/driver/TripHistory";

/* ========== ADMIN ========== */
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCarList from "./pages/admin/AdminCarList";
import AdminBookingList from "./pages/admin/AdminBookingList";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminKycRequests from "./pages/admin/AdminKycRequest";
import AdminKycReview from "./pages/admin/AdminKycReview";
import AdminDocumentScan from "./pages/admin/AdminDocumentScan";
import AdminEsignDemo from "./pages/admin/AdminEsignDemo";
import AdminContractReview from "./pages/admin/AdminContractReview";

/* ========== OWNER ========== */
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";

export default function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* ================= CUSTOMER ACCOUNT ================= */}
      <Route
        path="/account"
        element={
          <ProtectedRoute allowRoles={["CUSTOMER"]}>
            <AccountPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfileTab />} />
        <Route path="bookings" element={<BookingHistoryTab />} />
      </Route>

      {/* ================= CUSTOMER ================= */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowRoles={["CUSTOMER"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="trip" replace />} />
        <Route path="trip" element={<CustomerTrip />} />
        <Route path="*" element={<Navigate to="/customer/trip" replace />} />
      </Route>

      {/* ================= BECOME OWNER ================= */}
      <Route
        path="/become-owner"
        element={
          <ProtectedRoute allowRoles={["CUSTOMER", "OWNER"]}>
            <BecomeOwner />
          </ProtectedRoute>
        }
      />

      {/* ================= DRIVER ================= */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute allowRoles={["DRIVER"]}>
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DriverDashboard />} />
        <Route path="history" element={<TripHistory />} />
        <Route path="*" element={<Navigate to="/driver" replace />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="cars" element={<AdminCarList />} />
        <Route path="bookings" element={<AdminBookingList />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="kyc" element={<AdminKycRequests />} />
        <Route path="kyc/:id" element={<AdminKycReview />} />
        <Route path="documents" element={<AdminDocumentScan />} />
        <Route path="esign" element={<AdminEsignDemo />} />
        <Route path="contracts" element={<AdminContractReview />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* ================= OWNER ================= */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowRoles={["OWNER"]}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
