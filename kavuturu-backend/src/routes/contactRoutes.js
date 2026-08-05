// src/routes/contactRoutes.js

const express = require("express");
const router = express.Router();
const {
  getContact,
  updateContact,
} = require("../controllers/contactController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public route to fetch single contact information record
router.get("/", getContact);

// Private route for doctor to update single contact information record
router.put("/", authenticateUser, authorizeRoles("doctor"), updateContact);

module.exports = router;
