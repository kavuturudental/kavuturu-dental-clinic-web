// src/api/notificationApi.js

import api from "../services/api";

/**
 * Get All Notifications
 */
export const getNotifications = async (params = {}) => {
  try {
    const response = await api.get("/notifications", { params });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch notifications from endpoint:", err);
    return { data: [], unreadCount: 0 };
  }
};

/**
 * Get Unread Notification Count
 */
export const getUnreadNotificationCount = async () => {
  try {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch unread count:", err);
    return { unreadCount: 0 };
  }
};

/**
 * Mark Single Notification as Read
 */
export const markNotificationAsRead = async (id) => {
  try {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  } catch (err) {
    // Retry with PUT if PATCH fails
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (putErr) {
      console.error("Failed to mark notification as read:", putErr);
      return { success: true };
    }
  }
};

/**
 * Mark All Notifications as Read
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.patch("/notifications/read-all");
    return response.data;
  } catch (err) {
    try {
      const response = await api.put("/notifications/read-all");
      return response.data;
    } catch (putErr) {
      console.error("Failed to mark all notifications as read:", putErr);
      return { success: true };
    }
  }
};

/**
 * Delete Notification
 */
export const deleteNotification = async (id) => {
  try {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  } catch (err) {
    console.error("Failed to delete notification:", err);
    return { success: true };
  }
};
