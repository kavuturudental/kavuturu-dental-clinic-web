// src/receptionist/components/layout/NotificationDropdown.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Calendar,
  UserPlus,
  Bell,
  CheckCheck
} from "lucide-react";

export const NotificationDropdown = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAllAsRead,
  onItemClick
}) => {
  const location = useLocation();
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;
  const isDoctor = location.pathname.startsWith("/doctor");
  const viewAllLink = isDoctor
    ? "/doctor/appointment-management/notifications"
    : "/receptionist/notifications";

  const getStyleForType = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("request")) {
      return {
        icon: Inbox,
        bg: "bg-amber-50 text-amber-600 border-amber-200/80"
      };
    }
    if (t.includes("approved") || t.includes("accept")) {
      return {
        icon: CheckCircle2,
        bg: "bg-emerald-50 text-emerald-600 border-emerald-200/80"
      };
    }
    if (t.includes("cancelled") || t.includes("rejected")) {
      return {
        icon: XCircle,
        bg: "bg-rose-50 text-rose-600 border-rose-200/80"
      };
    }
    if (t.includes("rescheduled")) {
      return {
        icon: Calendar,
        bg: "bg-blue-50 text-blue-600 border-blue-200/80"
      };
    }
    if (t.includes("patient")) {
      return {
        icon: UserPlus,
        bg: "bg-purple-50 text-purple-600 border-purple-200/80"
      };
    }
    return {
      icon: Bell,
      bg: "bg-slate-50 text-slate-600 border-slate-200/80"
    };
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown Card Panel */}
      <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-slate-100 shadow-[0_16px_48px_rgba(0,0,0,0.08)] p-0 z-50 overflow-hidden text-left select-none animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Panel Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-extrabold text-slate-800 tracking-tight">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] font-bold text-sky-600 hover:text-[#0E2A6D] hover:underline flex items-center gap-1 cursor-pointer outline-none"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notification Items List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              No recent notifications.
            </div>
          ) : (
            notifications.map((item) => {
              const itemId = item._id || item.id;
              const isRead = Boolean(item.isRead || item.read);
              const { icon: ItemIcon, bg } = getStyleForType(item.type);

              return (
                <div
                  key={itemId}
                  onClick={() => onItemClick && onItemClick(itemId)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    !isRead
                      ? "bg-sky-50/30 hover:bg-sky-50/60"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {/* Type Icon */}
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center border flex-shrink-0 mt-0.5 ${bg}`}
                  >
                    <ItemIcon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {item.title}
                      </h4>
                      {!isRead && (
                        <span
                          className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"
                          title="Unread notification"
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                      {item.message || item.description || item.details}
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : item.time || "Recent"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panel Footer */}
        <Link
          to={viewAllLink}
          onClick={onClose}
          className="block w-full py-3 text-center text-xs font-bold text-[#0E2A6D] hover:text-[#16398b] bg-slate-50/80 hover:bg-slate-100 transition-colors border-t border-slate-100"
        >
          View all notifications
        </Link>
      </div>
    </>
  );
};

export default NotificationDropdown;
