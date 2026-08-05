// src/services/notificationService.js

import { notificationsData as initialNotifications } from "../receptionist/data/notificationsData";

let notificationsStore = [...initialNotifications];

export const notificationService = {
  getNotifications: () => notificationsStore,
  markAsRead: (id) => {
    notificationsStore = notificationsStore.map((n) => (n.id === id ? { ...n, read: true } : n));
    return notificationsStore;
  },
  markAllAsRead: () => {
    notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
    return notificationsStore;
  }
};

export default notificationService;
