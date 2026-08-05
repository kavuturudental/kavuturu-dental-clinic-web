// src/routes/treatmentRoutes.js

const express = require("express");
const router = express.Router();

const {
    getTreatments,
    getTreatmentById,
    createTreatment,
    updateTreatment,
    deleteTreatment,
} = require("../controllers/treatmentController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public Routes
router.get("/", getTreatments);
router.get("/:id", getTreatmentById);

// Doctor Only Routes
router.post(
    "/",
    authenticateUser,
    authorizeRoles("doctor"),
    createTreatment
);

router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    updateTreatment
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    deleteTreatment
);

module.exports = router;
