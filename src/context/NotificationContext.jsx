// src/context/NotificationContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from "../api/notificationApi";
import eventBus from "../utils/eventBus";

export const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  loading: true,
  error: "",
  fetchNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  removeNotification: async () => {}
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchNotifications = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    try {
      const response = await getNotifications();
      const list = response.data || response || [];
      if (Array.isArray(list)) {
        setNotifications(list);
      }
      setError("");
    } catch (err) {
      console.error("Notification Context Fetch Error:", err);
      setNotifications([]);
      setError(err.response?.data?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id) => {
    // 1. Immediate optimistic UI update
    setNotifications((prev) =>
      prev.map((n) =>
        (n._id === id || n.id === id) ? { ...n, isRead: true, read: true } : n
      )
    );

    // 2. Call Backend API
    try {
      await markNotificationAsRead(id);
      eventBus.emit("STATE_UPDATED");
    } catch (err) {
      console.error("Error marking notification read:", err);
      await fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    // 1. Immediate optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, read: true }))
    );

    // 2. Call Backend API
    try {
      await markAllNotificationsAsRead();
      eventBus.emit("STATE_UPDATED");
    } catch (err) {
      console.error("Error marking all notifications read:", err);
      await fetchNotifications();
    }
  };

  const removeNotification = async (id) => {
    // 1. Immediate optimistic UI update
    setNotifications((prev) =>
      prev.filter((n) => n._id !== id && n.id !== id)
    );

    // 2. Call Backend API
    try {
      await deleteNotification(id);
      eventBus.emit("STATE_UPDATED");
    } catch (err) {
      console.error("Error deleting notification:", err);
      await fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications();

    const unsubscribe = eventBus.on("STATE_UPDATED", fetchNotifications);

    const interval = setInterval(() => {
      fetchNotifications();
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [fetchNotifications, token]);

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationContext);
