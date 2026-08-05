// src/pages/doctor/AppointmentManagement/Notifications.jsx

import React, { useState } from "react";
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  RefreshCw, 
  Trash2, 
  Check, 
  Inbox,
  UserPlus
} from "lucide-react";
import useNotifications from "../../../hooks/useNotifications";
import SearchBar from "../../../components/receptionist/common/SearchBar";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";

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

// Helper mapper to normalize backend notification model to UI representation
const mapBackendNotificationToUI = (n) => {
  if (!n) return null;
  const isRead = Boolean(n.read || n.isRead);
  const createdDate = n.createdAt ? new Date(n.createdAt) : new Date();
  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = createdDate.toISOString().split("T")[0] === todayStr;

  const styleInfo = getCategoryStyle(n.type);

  return {
    id: n._id || n.id,
    title: n.title || n.type || "Notification Alert",
    description: n.message || n.description || n.details || "Notification update from clinic management.",
    type: n.type || "System Notification",
    time: n.createdAt ? createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (n.time || "Recently"),
    date: createdDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    isToday,
    read: isRead,
    raw: n,
    icon: styleInfo.Icon,
    badgeClass: styleInfo.badgeClass,
    iconClass: styleInfo.iconClass
  };
};

export default function Notifications() {
  const {
    notifications: rawNotifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState("All"); // 'All' | 'Unread' | 'Read'
  const [searchQuery, setSearchQuery] = useState("");

  const mappedNotifications = (rawNotifications || []).map(mapBackendNotificationToUI);

  // Filtering & Search Logic
  const getFilteredNotifications = () => {
    let list = [...mappedNotifications];

    if (activeFilter === "Unread") {
      list = list.filter((n) => !n.read);
    } else if (activeFilter === "Read") {
      list = list.filter((n) => n.read);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.description && n.description.toLowerCase().includes(q)) ||
          (n.type && n.type.toLowerCase().includes(q))
      );
    }

    return list;
  };

  const filteredList = getFilteredNotifications();

  // Handlers
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      toast.success("Notification marked as read");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeNotification(id);
      toast.success("Notification deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchNotifications();
      toast.success("Notifications reloaded from server");
    } catch (err) {
      console.error(err);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full py-12">
        <div className="w-10 h-10 border-4 border-[#0E2A6D]/20 border-t-[#0E2A6D] rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Loading notifications from server...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-12">
        <p className="font-semibold text-rose-800 text-sm">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchNotifications}>
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto font-sans select-none pb-12 w-full min-w-0">
      
      {/* Main Notifications Container */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
        
        {/* Header & Main Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Notifications Log
            </h2>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Structured view of appointment updates and booking alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-all cursor-pointer outline-none"
              title="Refresh Notifications"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-all cursor-pointer outline-none flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-slate-500" />
              <span>Mark all read</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {["All", "Unread", "Read"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer outline-none border ${
                  activeFilter === tab
                    ? "bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-2xs"
                    : "bg-white hover:bg-slate-50 border-[#E5E7EB] text-slate-600 font-medium"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <SearchBar
              placeholder="Search by title, message or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Structured List */}
        <div className="space-y-3">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No notifications match your filter or search criteria.</p>
            </div>
          ) : (
            filteredList.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className={`p-4.5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    n.read
                      ? "bg-slate-50/50 border-slate-100 text-slate-600"
                      : "bg-white border-slate-200/80 text-slate-900 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`p-2.5 rounded-2xl flex-shrink-0 mt-0.5 ${n.iconClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{n.title}</span>
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${n.badgeClass}`}>
                          {n.type}
                        </span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                      {n.time}
                    </span>
                    
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(n.id)}
                        className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-500 transition-all cursor-pointer"
                        title="Mark as Read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(n.id)}
                      className="p-1.5 rounded-full hover:bg-rose-100 text-rose-500 transition-all cursor-pointer"
                      title="Delete Notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
