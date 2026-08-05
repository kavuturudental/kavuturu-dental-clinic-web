// src/routes/notificationRoutes.js

const express = require("express");

const router = express.Router();

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} = require("../controllers/notificationController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// All notification routes require login
router.use(authenticateUser);
router.use(authorizeRoles("doctor", "receptionist"));

router.get("/", getNotifications);

router.get("/unread-count", getUnreadCount);

// Support both PUT and PATCH for mark all as read
router.put("/read-all", markAllAsRead);
router.patch("/read-all", markAllAsRead);

// Support both PUT and PATCH for single mark as read
router.put("/:id/read", markAsRead);
router.patch("/:id/read", markAsRead);

router.delete("/:id", deleteNotification);

module.exports = router;