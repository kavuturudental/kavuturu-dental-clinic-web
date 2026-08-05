// src/routes/aboutRoutes.js

const express = require("express");
const router = express.Router();

const {
    getAbout,
    updateAbout,
} = require("../controllers/aboutController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

/**
 * @route   GET /api/website/about
 * @desc    Get About Section Content
 * @access  Public
 */
router.get("/", getAbout);

/**
 * @route   PUT /api/website/about
 * @desc    Update About Section Content
 * @access  Private (Doctor Only)
 */
router.put(
    "/",
    authenticateUser,
    authorizeRoles("doctor"),
    updateAbout
);

module.exports = router;