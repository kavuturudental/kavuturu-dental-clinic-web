// src/routes/testimonialRoutes.js

const express = require("express");
const router = express.Router();

const {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} = require("../controllers/testimonialController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public Route
router.get("/", getTestimonials);

// Doctor Only Routes
router.post(
    "/",
    authenticateUser,
    authorizeRoles("doctor"),
    createTestimonial
);

router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    updateTestimonial
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    deleteTestimonial
);

module.exports = router;
