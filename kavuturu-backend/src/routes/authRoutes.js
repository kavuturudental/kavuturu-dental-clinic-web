// src/routes/authRoutes.js

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authenticateUser = require("../middlewares/authMiddleware");

/**
 * Authentication & Password Recovery Routes
 */

// Login
router.post("/login", authController.loginUser);

// Profile (Get & Update)
router.get("/profile", authenticateUser, authController.getProfile);
router.put("/profile", authenticateUser, authController.updateProfile);

// Change Password (Logged-in user)
router.put("/change-password", authenticateUser, authController.changePassword);

// Password Recovery System (Public)
router.post("/forgot-password", authController.forgotPassword);
router.get("/verify-reset-token/:token", authController.verifyResetToken);
router.post("/reset-password/:token", authController.resetPassword);

// Logout
router.post("/logout", authenticateUser, authController.logoutUser);

module.exports = router;