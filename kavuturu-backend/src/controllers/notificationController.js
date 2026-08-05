// src/controllers/notificationController.js

const Notification = require("../models/Notification");

/**
 * Helper: Check if a notification is read by the specified user / role
 */
const isNotificationReadByUser = (notification, user) => {
    if (!notification || !notification.readBy || !Array.isArray(notification.readBy)) {
        return false;
    }
    const userId = user?._id ? user._id.toString() : user?.id ? String(user.id) : null;
    const userRole = user?.role ? user.role.toLowerCase() : null;

    return notification.readBy.some((entry) => {
        const entryUserId = entry.user ? entry.user.toString() : null;
        const entryRole = entry.role ? entry.role.toLowerCase() : null;

        if (userId && entryUserId && userId === entryUserId) return true;
        if (userRole && entryRole && userRole === entryRole) return true;
        return false;
    });
};

/**
 * @desc    Get All Notifications (Calculates independent isRead & unreadCount per requesting user/role)
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res, next) => {
    try {
        const rawNotifications = await Notification.find()
            .populate("createdBy", "name role")
            .sort({ createdAt: -1 });

        const user = req.user || { role: "receptionist" };

        const notifications = rawNotifications.map((n) => {
            const isRead = isNotificationReadByUser(n, user);
            const obj = n.toObject ? n.toObject() : { ...n };
            obj.isRead = isRead;
            return obj;
        });

        const unreadCount = notifications.filter((n) => !n.isRead).length;

        return res.status(200).json({
            success: true,
            unreadCount,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Unread Notification Count for requesting user/role
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
const getUnreadCount = async (req, res, next) => {
    try {
        const rawNotifications = await Notification.find();
        const user = req.user || { role: "receptionist" };

        const unreadCount = rawNotifications.filter((n) => !isNotificationReadByUser(n, user)).length;

        return res.status(200).json({
            success: true,
            unreadCount,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mark Notification As Read for requesting user/role
 * @route   PUT /api/notifications/:id/read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        const user = req.user || { role: "receptionist" };
        if (!isNotificationReadByUser(notification, user)) {
            notification.readBy.push({
                user: user._id || null,
                role: user.role || "receptionist",
                readAt: new Date(),
            });
            await notification.save();
        }

        const allNotifications = await Notification.find();
        const unreadCount = allNotifications.filter((n) => !isNotificationReadByUser(n, user)).length;

        const obj = notification.toObject ? notification.toObject() : { ...notification };
        obj.isRead = true;

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            unreadCount,
            data: obj,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mark All Notifications As Read for requesting user/role
 * @route   PUT /api/notifications/read-all
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = async (req, res, next) => {
    try {
        const user = req.user || { role: "receptionist" };
        const rawNotifications = await Notification.find();

        for (const notification of rawNotifications) {
            if (!isNotificationReadByUser(notification, user)) {
                notification.readBy.push({
                    user: user._id || null,
                    role: user.role || "receptionist",
                    readAt: new Date(),
                });
                await notification.save();
            }
        }

        return res.status(200).json({
            success: true,
            unreadCount: 0,
            message: "All notifications marked as read for your account.",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        await notification.deleteOne();

        const user = req.user || { role: "receptionist" };
        const allNotifications = await Notification.find();
        const unreadCount = allNotifications.filter((n) => !isNotificationReadByUser(n, user)).length;

        return res.status(200).json({
            success: true,
            unreadCount,
            message: "Notification deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};