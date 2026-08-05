// src/routes/doctorRoutes.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DoctorLayout from "../layouts/DoctorLayout";
import DoctorProfile from "../pages/doctor/DoctorProfile";

// Appointment Management Module Pages
import AppointmentManagementLayout from "../pages/doctor/AppointmentManagement/AppointmentManagementLayout";
import AppointmentDashboard from "../pages/doctor/AppointmentManagement/Dashboard";
import Appointments from "../pages/doctor/AppointmentManagement/Appointments";
import AppointmentRequests from "../pages/doctor/AppointmentManagement/AppointmentRequests";
import Patients from "../pages/doctor/AppointmentManagement/Patients";
import CalendarView from "../pages/doctor/AppointmentManagement/Calendar";
import DataExport from "../pages/doctor/AppointmentManagement/DataExport";
import Insights from "../pages/doctor/AppointmentManagement/Insights";
import NotificationsView from "../pages/doctor/AppointmentManagement/Notifications";

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
          {/* Default Landing Page: Redirect to Appointments */}
          <Route index element={<Navigate to="appointment-management/appointments" replace />} />
          <Route path="home" element={<Navigate to="appointment-management/appointments" replace />} />
          
          <Route path="clinic-details" element={<Navigate to="website-management/clinic-info" replace />} />
          <Route path="receptionists" element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<DoctorProfile />} />
          
          {/* 1. Appointment Management Module (Default Primary Workspace) */}
          <Route path="appointment-management" element={<AppointmentManagementLayout />}>
            <Route index element={<Navigate to="appointments" replace />} />
            <Route path="dashboard" element={<Navigate to="../appointments" replace />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="requests" element={<AppointmentRequests />} />
            <Route path="patients" element={<Patients />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="data-export" element={<DataExport />} />
            <Route path="insights" element={<Insights />} />
            <Route path="reports" element={<Navigate to="../insights" replace />} />
            <Route path="notifications" element={<NotificationsView />} />
          </Route>

          {/* 2. Website Management CMS Module */}
          <Route path="website-management" element={<WebsiteManagementLayout />}>
            <Route index element={<Navigate to="hero" replace />} />
            <Route path="dashboard" element={<Navigate to="../hero" replace />} />
            <Route path="homepage" element={<Navigate to="../hero" replace />} />
            <Route path="hero" element={<HeroCMS />} />
            <Route path="about" element={<AboutCMS />} />
            <Route path="treatments" element={<TreatmentsCMS />} />
            <Route path="doctors" element={<DoctorsCMS />} />
            <Route path="doctor" element={<DoctorsCMS />} />
            <Route path="before-after" element={<BeforeAfterCMS />} />
            <Route path="testimonials" element={<TestimonialsCMS />} />
            <Route path="reviews" element={<TestimonialsCMS />} />
            <Route path="gallery" element={<GalleryCMS />} />
            <Route path="blogs" element={<BlogsCMS />} />
            <Route path="blog" element={<BlogsCMS />} />
            <Route path="clinic-info" element={<ContactCMS />} />
            <Route path="contact" element={<ContactCMS />} />
            <Route path="contact-info" element={<ContactCMS />} />
          </Route>

          {/* Fallback redirects to appointment management */}
          <Route path="*" element={<Navigate to="appointment-management/dashboard" replace />} />
        </Route>
      </Routes>
    </DoctorProtectedRoute>
  );
}
