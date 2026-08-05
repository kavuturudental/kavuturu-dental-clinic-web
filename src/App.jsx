import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/website/navbar/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { DialogProvider } from "./context/DialogContext";

// Public Pages
import Home from "./pages/website/Home";
import About from "./pages/website/About";
import Treatments from "./pages/website/Treatments";
import TreatmentDetails from "./pages/website/TreatmentDetails";
import Doctors from "./pages/website/Doctors";
import Gallery from "./pages/website/Gallery";
import Testimonials from "./pages/website/Testimonials";
import Blogs from "./pages/website/Blogs";
import BlogDetails from "./pages/website/BlogDetails";
import BeforeAfter from "./pages/website/BeforeAfter";
import BookAppointment from "./pages/website/BookAppointment";
import PrivacyPolicy from "./pages/website/PrivacyPolicy";
import TermsAndConditions from "./pages/website/TermsAndConditions";

// Auth Pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Doctor CMS
import DoctorRoutes from "./routes/doctorRoutes";

// Common
import NotFound from "./pages/website/NotFound";
import FloatingSocialBar from "./components/common/FloatingSocialBar";

function AppContent() {
  const location = useLocation();

  // Hide Navbar & Floating Bar on Auth and Doctor CMS portal pages
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/doctor/") ||
    location.pathname === "/doctor";

  return (
    <>
      <ScrollToTop />

      {!hideLayout && <Navbar />}

      <Routes>
        {/* =========================
            Public Website
        ========================== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/treatments" element={<Treatments />} />
        <Route path="/treatments/:id" element={<TreatmentDetails />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetails />} />
        <Route path="/before-after" element={<BeforeAfter />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* =========================
            Authentication
        ========================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* =========================
            Doctor CMS Portal
        ========================== */}
        <Route path="/doctor" element={<Navigate to="/doctor/website-management/hero" replace />} />
        <Route path="/doctor/*" element={<DoctorRoutes />} />

        {/* =========================
            404 Page
        ========================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <FloatingSocialBar />}
    </>
  );
}

function App() {
  return (
    <DialogProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DialogProvider>
  );
}

export default App;