// src/routes/healthRoutes.js

const express = require("express");

const router = express.Router();

const { getHealth } = require("../controllers/healthController");

/**
 * @route   GET /api/health
 * @desc    API Health Check
 * @access  Public
 */
router.get("/", getHealth);

module.exports = router;