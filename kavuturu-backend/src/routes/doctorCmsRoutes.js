// src/routes/doctorCmsRoutes.js

const express = require("express");
const router = express.Router();

const {
    getFeaturedDoctor,
    updateFeaturedDoctor,
    getAllDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
} = require("../controllers/doctorCmsController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public Routes
router.get("/featured", getFeaturedDoctor);
router.get("/", getAllDoctors);

// Doctor Only Routes
router.put(
    "/featured",
    authenticateUser,
    authorizeRoles("doctor"),
    updateFeaturedDoctor
);

router.post(
    "/",
    authenticateUser,
    authorizeRoles("doctor"),
    createDoctor
);

router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    updateDoctor
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    deleteDoctor
);

module.exports = router;
