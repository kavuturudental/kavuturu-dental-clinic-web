import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/website/navbar/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";
import FloatingSocialBar from "./components/common/FloatingSocialBar";
import StructuredData from "./components/seo/StructuredData";

import { AuthProvider } from "./context/AuthContext";
import { DialogProvider } from "./context/DialogContext";

// Public Pages
import Home from "./pages/website/Home";
const About = lazy(() => import("./pages/website/About"));
const Treatments = lazy(() => import("./pages/website/Treatments"));
const TreatmentDetails = lazy(() => import("./pages/website/TreatmentDetails"));
const Doctors = lazy(() => import("./pages/website/Doctors"));
const Gallery = lazy(() => import("./pages/website/Gallery"));
const Testimonials = lazy(() => import("./pages/website/Testimonials"));
const Blogs = lazy(() => import("./pages/website/Blogs"));
const BlogDetails = lazy(() => import("./pages/website/BlogDetails"));
const BeforeAfter = lazy(() => import("./pages/website/BeforeAfter"));
const Contact = lazy(() => import("./pages/website/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/website/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/website/TermsAndConditions"));

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

// Doctor CMS
const DoctorRoutes = lazy(() => import("./routes/doctorRoutes"));

// Common
const NotFound = lazy(() => import("./pages/website/NotFound"));

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
      {/* SEO Structured Data */}
      <StructuredData />

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Website Navbar */}
      {!hideLayout && <Navbar />}

      {/* Website Routes */}
      <Suspense fallback={<div className="min-h-screen" />}>
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditions />}
        />

        {/* =========================
            Authentication
        ========================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* =========================
            Doctor CMS Portal
        ========================== */}
        <Route
          path="/doctor"
          element={
            <Navigate
              to="/doctor/website-management/hero"
              replace
            />
          }
        />

        <Route
          path="/doctor/*"
          element={<DoctorRoutes />}
        />

        {/* =========================
            404 Page
        ========================== */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
      </Suspense>

      {/* Floating Social Icons */}
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