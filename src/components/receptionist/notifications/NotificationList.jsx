import React, { useState } from "react";
import NotificationTabs from "./NotificationTabs";
import NotificationCard from "./NotificationCard";
import NotificationDetails from "./NotificationDetails";
import EmptyState from "../common/EmptyState";
import Button from "../common/Button";
import { notificationsData as initialNotifications } from "../../../data/receptionist/notificationsData";
import { CheckCheck } from "lucide-react";

const NotificationList = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedNotif, setSelectedNotif] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark single as read
  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (selectedNotif && selectedNotif.id === id) {
      setSelectedNotif((prev) => ({ ...prev, read: true }));
    }
  };

  // Delete notification
  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotif && selectedNotif.id === id) {
      setSelectedNotif(null);
    }
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (selectedNotif) {
      setSelectedNotif((prev) => ({ ...prev, read: true }));
    }
  };

  // Filter Logic
  const getFilteredNotifs = () => {
    if (activeTab === "Unread") {
      return notifications.filter((n) => !n.read);
    } else if (activeTab === "Read") {
      return notifications.filter((n) => n.read);
    }
    return notifications;
  };

  const filteredNotifs = getFilteredNotifs();

  return (
    <div className="flex flex-col lg:flex-row gap-6 select-none">
      {/* Left: Filter tabs and Notifications List */}
      <div className="w-full lg:w-[60%] bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <NotificationTabs
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            unreadCount={unreadCount}
          />

          {unreadCount > 0 && (
            <Button
              variant="secondary"
              onClick={handleMarkAllRead}
              className="h-9 text-[11px] px-3.5"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read</span>
            </Button>
          )}
        </div>

        {/* Notifications List scrolling container */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredNotifs.length === 0 ? (
            <EmptyState
              title="No Notifications"
              description="You have no notifications in this category. Everything is clear."
              iconName="BellOff"
            />
          ) : (
            filteredNotifs.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
                onSelect={setSelectedNotif}
              />
            ))
          )}
        </div>
      </div>

      {/* Right: Detailed notification viewer */}
      <div className="w-full lg:w-[40%]">
        <NotificationDetails selectedNotification={selectedNotif} />
      </div>
    </div>
  );
};

export default NotificationList;
