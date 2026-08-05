// src/controllers/healthController.js

const mongoose = require("mongoose");

/**
 * @desc    API Health Check
 * @route   GET /api/health
 * @access  Public
 */
const getHealth = (req, res) => {
    const dbState = mongoose.connection.readyState;

    const databaseStatus = {
        0: "Disconnected",
        1: "Connected",
        2: "Connecting",
        3: "Disconnecting",
    };

    return res.status(200).json({
        success: true,
        server: "Running",
        database: databaseStatus[dbState] || "Unknown",
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
    });
};

module.exports = {
    getHealth,
};