// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./component/Navbar";
import ProtectedRoute from "./component/ProtectedRoute";
import Footer from "./component/Footer";

// Pages
import Home from "./page/Home";
import OwnerRegisterGuide from "./page/OwnerRegisterGuide";
import Login from "./page/Login";
import Register from "./page/Register";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";
import AdminCustomers from "./page/AdminCustomers";
import NotFound from "./page/NotFound";

// Car pages
import CarList from "./page/CarList";
import CarDetail from "./page/CarDetail";

export default function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <div className="appShell">
      <Navbar />

      <main className="appMain">
        <div className="container">
          <Routes location={backgroundLocation || location}>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Cars */}
            <Route path="/cars" element={<CarList />} />
            <Route path="/cars/:id" element={<CarDetail />} />

            {/* Owner */}
            <Route
              path="/owner/register-guide"
              element={<OwnerRegisterGuide />}
            />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin */}
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute allowRoles={["admin"]}>
                  <AdminCustomers />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      {/* Modal routes (login/register overlay) */}
      {backgroundLocation && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      )}

      <Footer />
    </div>
  );
}
