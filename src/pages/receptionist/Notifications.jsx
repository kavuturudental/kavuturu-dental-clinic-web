// src/receptionist/pages/Notifications.jsx

import React from "react";
import DashboardLayout from "../../components/receptionist/layout/DashboardLayout";
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Trash2, 
  Inbox, 
  UserPlus 
} from "lucide-react";
import useNotifications from "../../hooks/useNotifications";

const getCategoryStyle = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("request")) {
    return {
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      iconClass: "bg-amber-50 text-amber-600",
      Icon: Inbox
    };
  }
  if (t.includes("approved") || t.includes("accept")) {
    return {
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      iconClass: "bg-emerald-50 text-emerald-600",
      Icon: CheckCircle2
    };
  }
  if (t.includes("cancelled") || t.includes("rejected")) {
    return {
      badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
      iconClass: "bg-rose-50 text-rose-600",
      Icon: XCircle
    };
  }
  if (t.includes("rescheduled")) {
    return {
      badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
      iconClass: "bg-blue-50 text-blue-600",
      Icon: Calendar
    };
  }
  if (t.includes("patient")) {
    return {
      badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
      iconClass: "bg-purple-50 text-purple-600",
      Icon: UserPlus
    };
  }
  return {
    badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
    iconClass: "bg-slate-50 text-slate-600",
    Icon: Bell
  };
};

export default function Notifications() {
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification
  } = useNotifications();

  return (
    <DashboardLayout>
      <div className="p-1 space-y-2.5 max-w-[1200px] mx-auto font-sans select-none">
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Activity Notifications
              </h2>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Real-time appointment alerts & clinic updates stored in MongoDB.
              </p>
            </div>

            {notifications && notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#0E2A6D] hover:underline cursor-pointer outline-none"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
              Loading notifications from database...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-rose-500 text-xs">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-medium">
              No notifications found in database.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => {
                const isRead = Boolean(n.isRead || n.read);
                const styleInfo = getCategoryStyle(n.type);
                const Icon = styleInfo.Icon;

                return (
                  <div
                    key={n._id || n.id}
                    className={`py-4 flex items-start justify-between gap-4 transition-colors ${
                      !isRead ? "bg-slate-50/60 p-3 rounded-2xl" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-2xl flex-shrink-0 mt-0.5 ${styleInfo.iconClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${styleInfo.badgeClass}`}>
                            {n.type || "System Notification"}
                          </span>
                          {!isRead && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-normal leading-relaxed">
                          {n.message || n.description}
                        </p>
                        <span className="text-[11px] font-mono text-slate-400 block pt-1">
                          {n.createdAt ? new Date(n.createdAt).toLocaleString() : n.time || "Recent"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!isRead && (
                        <button
                          type="button"
                          onClick={() => markAsRead(n._id || n.id)}
                          className="text-[11px] font-semibold text-[#0E2A6D] hover:bg-sky-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNotification(n._id || n.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
