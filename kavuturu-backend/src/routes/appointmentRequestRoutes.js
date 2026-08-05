// src/routes/appointmentRequestRoutes.js

const express = require("express");

const router = express.Router();

const {
    createAppointmentRequest,
    getAppointmentRequests,
    getAppointmentRequestById,
    acceptAppointmentRequest,
    rejectAppointmentRequest,
    rescheduleAppointmentRequest,
    getBookedSlots,
} = require("../controllers/appointmentRequestController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

/**
 * Public: Website Booking Request & Booked Slots Lookup
 */
router.post(
    "/",
    createAppointmentRequest
);

router.get(
    "/booked-slots",
    getBookedSlots
);

/**
 * Protected: Doctor & Receptionist
 */
router.get(
    "/",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    getAppointmentRequests
);

router.get(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    getAppointmentRequestById
);

// Approve / Accept routes (supports PUT & PATCH, /accept & /approve)
router.put(
    "/:id/accept",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    acceptAppointmentRequest
);
router.patch(
    "/:id/accept",
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
router.patch(
    "/:id/approve",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    acceptAppointmentRequest
);

// Reject routes (supports PUT & PATCH)
router.put(
    "/:id/reject",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    rejectAppointmentRequest
);
router.patch(
    "/:id/reject",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    rejectAppointmentRequest
);

// Reschedule routes (supports PUT & PATCH)
router.put(
    "/:id/reschedule",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    rescheduleAppointmentRequest
);
router.patch(
    "/:id/reschedule",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    rescheduleAppointmentRequest
);

module.exports = router;