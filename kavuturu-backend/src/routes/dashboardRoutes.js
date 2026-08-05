// src/routes/dashboardRoutes.js

const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/dashboardController");
const { getInsights } = require("../controllers/insightsController");
const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// All dashboard routes require authentication and doctor/receptionist role
router.use(authenticateUser);
router.use(authorizeRoles("doctor", "receptionist"));

router.get("/summary", getDashboardSummary);
router.get("/appointment-summary", getDashboardSummary);
router.get("/insights", getInsights);

module.exports = router;