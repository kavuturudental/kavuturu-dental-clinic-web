// src/app.js

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

// Routes
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const doctorDashboardRoutes = require("./routes/doctorDashboardRoutes");
const appointmentRequestRoutes = require("./routes/appointmentRequestRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Website CMS Routes
const heroRoutes = require("./routes/heroRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const doctorCmsRoutes = require("./routes/doctorCmsRoutes");
const beforeAfterRoutes = require("./routes/beforeAfterRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

/* ==========================================================
   Core Middleware
========================================================== */

// Security Headers
app.use(helmet());

// Response Compression
app.use(compression());

// Enable CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Parse JSON (increase payload limit for WEBP base64 image data)
app.use(express.json({ limit: "10mb" }));

// Parse URL Encoded Data
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logger (Development Only)
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

/* ==========================================================
   Root Route
========================================================== */

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Kavuturu Dental Clinic API",
    });
});

/* ==========================================================
   API Routes
========================================================== */

// Health
app.use("/api/health", healthRoutes);

// Authentication
app.use("/api/auth", authRoutes);

// Patients
app.use("/api/patients", patientRoutes);

// Appointments
app.use("/api/appointments", appointmentRoutes);

// Receptionist Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Doctor Dashboard
app.use("/api/doctor", doctorDashboardRoutes);

// Receptionist Management
const receptionistRoutes = require("./routes/receptionistRoutes");
app.use("/api/doctor/receptionists", receptionistRoutes);

// Appointment Requests
app.use("/api/appointment-requests", appointmentRequestRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

/* ==========================================================
   Website CMS Routes
========================================================== */

// Hero Section
app.use("/api/website/hero", heroRoutes);

// About Section
app.use("/api/website/about", aboutRoutes);

// Treatments
app.use("/api/website/treatments", treatmentRoutes);

// Doctors
app.use("/api/website/doctors", doctorCmsRoutes);

// Before & After
app.use("/api/website/before-after", beforeAfterRoutes);

// Testimonials
app.use("/api/website/testimonials", testimonialRoutes);

// Gallery
app.use("/api/website/gallery", galleryRoutes);

// Blogs
app.use("/api/website/blogs", blogRoutes);

// Contact Information
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/website/contact", contactRoutes);

/* ==========================================================
   404 Handler
========================================================== */

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

/* ==========================================================
   Global Error Handler
========================================================== */

app.use((err, req, res, next) => {
    console.error(err);

    return res.status(err.status || 500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal Server Error"
                : err.message,
        ...(process.env.NODE_ENV !== "production" && {
            stack: err.stack,
        }),
    });
});

module.exports = app;