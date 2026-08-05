// src/routes/doctorRoutes.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DoctorLayout from "../layouts/DoctorLayout";
import DoctorProfile from "../pages/doctor/DoctorProfile";

// Website Management CMS Module Pages
import WebsiteManagementLayout from "../pages/doctor/WebsiteManagement/WebsiteManagementLayout";
import HeroCMS from "../pages/doctor/WebsiteManagement/HeroCMS";
import AboutCMS from "../pages/doctor/WebsiteManagement/About";
import TreatmentsCMS from "../pages/doctor/WebsiteManagement/Treatments";
import DoctorsCMS from "../pages/doctor/WebsiteManagement/Doctors";
import BeforeAfterCMS from "../pages/doctor/WebsiteManagement/BeforeAfter";
import GalleryCMS from "../pages/doctor/WebsiteManagement/Gallery";
import TestimonialsCMS from "../pages/doctor/WebsiteManagement/Testimonials";
import BlogsCMS from "../pages/doctor/WebsiteManagement/Blogs";
import ContactCMS from "../pages/doctor/WebsiteManagement/Contact";

import authService from "../services/authService";

// Doctor Route protection wrapper
const DoctorProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated() || !authService.hasRole("doctor")) {
    authService.logout();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function DoctorRoutes() {
  return (
    <DoctorProtectedRoute>
      <Routes>
        <Route element={<DoctorLayout />}>
          {/* Default Landing Page: Redirect to Website Management Hero CMS */}
          <Route index element={<Navigate to="website-management/hero" replace />} />
          <Route path="home" element={<Navigate to="website-management/hero" replace />} />
          <Route path="profile" element={<DoctorProfile />} />
          
          {/* Website Management CMS Module */}
          <Route path="website-management" element={<WebsiteManagementLayout />}>
            <Route index element={<Navigate to="hero" replace />} />
            <Route path="dashboard" element={<Navigate to="../hero" replace />} />
            <Route path="hero" element={<HeroCMS />} />
            <Route path="about" element={<AboutCMS />} />
            <Route path="treatments" element={<TreatmentsCMS />} />
            <Route path="doctors" element={<DoctorsCMS />} />
            <Route path="before-after" element={<BeforeAfterCMS />} />
            <Route path="testimonials" element={<TestimonialsCMS />} />
            <Route path="gallery" element={<GalleryCMS />} />
            <Route path="blogs" element={<BlogsCMS />} />
            <Route path="contact" element={<ContactCMS />} />
            <Route path="settings" element={<Navigate to="../hero" replace />} />
          </Route>

          {/* Fallback redirects to website management */}
          <Route path="*" element={<Navigate to="website-management/hero" replace />} />
        </Route>
      </Routes>
    </DoctorProtectedRoute>
  );
}
