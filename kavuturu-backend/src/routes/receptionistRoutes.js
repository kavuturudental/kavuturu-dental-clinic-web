// src/routes/receptionistRoutes.js

const express = require("express");
const router = express.Router();

const {
  getReceptionists,
  createReceptionist,
  updateReceptionist,
  resetReceptionistPassword,
  deleteReceptionist,
} = require("../controllers/receptionistController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// All routes require Doctor authentication
router.use(authenticateUser);
router.use(authorizeRoles("doctor"));

router.get("/", getReceptionists);
router.post("/", createReceptionist);
router.put("/:id", updateReceptionist);
router.put("/:id/reset-password", resetReceptionistPassword);
router.delete("/:id", deleteReceptionist);

module.exports = router;
