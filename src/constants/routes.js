// src/constants/routes.js

export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    ABOUT: "/about",
    TREATMENTS: "/treatments",
    DOCTORS: "/doctors",
    GALLERY: "/gallery",
    TESTIMONIALS: "/testimonials",
    BLOGS: "/blogs",
    BEFORE_AFTER: "/before-after"
  },
  AUTH: {
    LOGIN: "/login"
  },
  DOCTOR: {
    HOME: "/doctor/home",
    PROFILE: "/doctor/profile",
    APPOINTMENT_MANAGEMENT: {
      DASHBOARD: "/doctor/appointment-management/dashboard",
      APPOINTMENTS: "/doctor/appointment-management/appointments",
      REQUESTS: "/doctor/appointment-management/requests",
      PATIENTS: "/doctor/appointment-management/patients",
      CALENDAR: "/doctor/appointment-management/calendar",
      DATA_EXPORT: "/doctor/appointment-management/data-export",
      INSIGHTS: "/doctor/appointment-management/insights",
      NOTIFICATIONS: "/doctor/appointment-management/notifications"
    },
    WEBSITE_MANAGEMENT: {
      HERO: "/doctor/website-management/hero",
      ABOUT: "/doctor/website-management/about",
      TREATMENTS: "/doctor/website-management/treatments",
      DOCTORS: "/doctor/website-management/doctors",
      BEFORE_AFTER: "/doctor/website-management/before-after",
      GALLERY: "/doctor/website-management/gallery",
      REVIEWS: "/doctor/website-management/testimonials",
      BLOGS: "/doctor/website-management/blogs",
      CONTACT: "/doctor/website-management/clinic-info"
    }
  },
  RECEPTIONIST: {
    DASHBOARD: "/receptionist/appointments",
    APPOINTMENTS: "/receptionist/appointments",
    REQUESTS: "/receptionist/appointment-requests",
    PATIENTS: "/receptionist/patients",
    NOTIFICATIONS: "/receptionist/notifications",
    PROFILE: "/receptionist/profile"
  }
};

export default ROUTES;
