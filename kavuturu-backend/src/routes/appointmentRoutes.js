// src/routes/appointmentRoutes.js

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    deleteAppointment,
} = require("../controllers/appointmentController");

const {
    acceptAppointmentRequest,
} = require("../controllers/appointmentRequestController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const {
    appointmentSchema,
} = require("../validations/appointmentValidation");

const router = express.Router();

/**
 * Optional Auth Middleware for POST /
 */
const optionalAuthenticateUser = async (req, res, next) => {
    let token = null;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_key_dev");
            req.user = await User.findById(decoded.id).select("-password");
        } catch (err) {
            // Ignore invalid token for public bookings
        }
    }
    next();
};

/**
 * Creation Route (Supports public website bookings & authenticated internal clinic bookings)
 */
router.post(
    "/",
    optionalAuthenticateUser,
    validateRequest(appointmentSchema),
    createAppointment
);

/**
 * Protected Routes
 */
router.get(
    "/",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    getAppointments
);

router.get(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    getAppointmentById
);

// Update Status (Lifecycle transitions: Confirmed -> Patient Arrived -> In Treatment -> Completed / Cancelled / Rescheduled)
router.patch(
    "/:id/status",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    updateAppointmentStatus
);

router.put(
    "/:id/status",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    updateAppointmentStatus
);

// Approve alias route for requests
router.patch(
    "/:id/approve",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    acceptAppointmentRequest
);

router.put(
    "/:id/approve",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    acceptAppointmentRequest
);

router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    updateAppointment
);

router.patch(
    "/:id/cancel",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    cancelAppointment
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    deleteAppointment
);

module.exports = router;