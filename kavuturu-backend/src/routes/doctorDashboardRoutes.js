// src/routes/doctorDashboardRoutes.js

const express = require("express");
const router = express.Router();

const {
    getDoctorDashboard,
} = require("../controllers/doctorDashboardController");

const {
    getDashboardSummary,
} = require("../controllers/dashboardController");

const {
    exportCSV,
    exportExcel,
    exportPDF
} = require("../controllers/exportController");

const {
    getInsights
} = require("../controllers/insightsController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

/**
 * ==========================================================
 * Doctor Dashboard & Insights Routes
 * ==========================================================
 */

/**
 * @route   GET /api/doctor/dashboard
 * @desc    Get doctor dashboard overview
 * @access  Private (Doctor)
 */
router.get(
    "/dashboard",
    authenticateUser,
    authorizeRoles("doctor"),
    getDoctorDashboard
);

/**
 * @route   GET /api/doctor/dashboard/appointment-summary
 * @desc    Get doctor appointment summary cards
 * @access  Private (Doctor)
 */
router.get(
    "/dashboard/appointment-summary",
    authenticateUser,
    authorizeRoles("doctor"),
    getDashboardSummary
);

/**
 * @route   GET /api/doctor/appointment-management/insights
 * @desc    Get real-time insights and analytics
 * @access  Private (Doctor)
 */
router.get(
    "/appointment-management/insights",
    authenticateUser,
    authorizeRoles("doctor"),
    getInsights
);

/**
 * @route   GET /api/doctor/appointment-management/export/csv
 * @desc    Export appointments to CSV
 * @access  Private (Doctor)
 */
router.get(
    "/appointment-management/export/csv",
    authenticateUser,
    authorizeRoles("doctor"),
    exportCSV
);

/**
 * @route   GET /api/doctor/appointment-management/export/excel
 * @desc    Export appointments to Excel (.xls)
 * @access  Private (Doctor)
 */
router.get(
    "/appointment-management/export/excel",
    authenticateUser,
    authorizeRoles("doctor"),
    exportExcel
);

/**
 * @route   GET /api/doctor/appointment-management/export/pdf
 * @desc    Export appointments to Printable PDF/HTML Report
 * @access  Private (Doctor)
 */
router.get(
    "/appointment-management/export/pdf",
    authenticateUser,
    authorizeRoles("doctor"),
    exportPDF
);

module.exports = router;