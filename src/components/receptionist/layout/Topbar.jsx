// src/components/receptionist/layout/Topbar.jsx

import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import authService from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  Calendar,
  Clock,
  ChevronDown
} from "lucide-react";
import { ReceptionistContext } from "../../../contexts/ReceptionistContext";
import NotificationDropdown from "./NotificationDropdown";
import useNotifications from "../../../hooks/useNotifications";

export default function Topbar({ onToggleSidebar, onLogoutClick, onSearchChange, searchValue }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const { receptionistName } = useContext(ReceptionistContext);
  const displayName = user?.name || receptionistName || "Clinic Receptionist";
  const displayEmail = user?.email || "receptionist@kavuturudental.com";

  // ONLY Profile Name is Capitalized
  const upperDisplayName = String(displayName).toUpperCase();

  // Real-time updating clock & date
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  const getHeaderInfo = () => {
    switch (location.pathname) {
      case "/receptionist/appointment-requests":
        return {
          title: "Appointment Requests",
          subtitle: "Review incoming online booking requests."
        };
      case "/receptionist/patients":
        return {
          title: "Patient Directory",
          subtitle: "Directory of registered clinic patients."
        };
      case "/receptionist/notifications":
        return {
          title: "Notifications",
          subtitle: "View system notifications and booking updates."
        };
      case "/receptionist/profile":
        return {
          title: "Profile",
          subtitle: "Manage account details and preferences."
        };
      default:
        return {
          title: "Appointments",
          subtitle: "Manage appointments and patient schedules."
        };
    }
  };

  const headerInfo = getHeaderInfo();

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      authService.logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="h-[70px] w-full bg-white rounded-2xl border border-[#E5E7EB] px-4 sm:px-5 flex items-center justify-between gap-3 select-none relative z-20 flex-shrink-0 font-sans shadow-2xs">
      
      {/* 1. Left Column: Mobile Toggle, Title & Subtitle */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-[#F8FAFC] border border-[#E5E7EB] cursor-pointer outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col justify-center">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-none whitespace-nowrap">
            {headerInfo.title}
          </h1>
          <p className="text-[11px] text-slate-400 font-medium mt-1 leading-none hidden sm:block whitespace-nowrap">
            {headerInfo.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Center Column: Dynamic Flex Search Bar (Zero Overlap) */}
      <div className="hidden md:flex flex-1 min-w-0 justify-center px-2">
        <div className="relative w-full max-w-[220px] lg:max-w-[300px] xl:max-w-[380px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchValue || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search appointments..."
            className="h-9.5 w-full rounded-full border border-[#E5E7EB] bg-[#F8FAFC] pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#EFF6FF] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* 3. Right Column: Date/Time Card ↔ Notification ↔ Profile */}
      <div className="flex items-center justify-end gap-3 flex-shrink-0">
        
        {/* Compact Date & Time Card */}
        <div className="hidden lg:flex items-center gap-2 px-3 h-8.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-[11px] font-extrabold text-slate-700 shadow-2xs whitespace-nowrap flex-shrink-0">
          <span className="flex items-center gap-1.5 text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
            <span>{formattedDate}</span>
          </span>
          <span className="w-px h-3 bg-[#E5E7EB]" />
          <span className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
            <span>{formattedTime}</span>
          </span>
        </div>

        {/* Circular Notification Bell */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setNotifDropdownOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-all border border-[#E5E7EB] cursor-pointer relative outline-none active:scale-95 shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#DC2626] text-white text-[10px] font-extrabold shadow-xs min-w-[18px] text-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={notifDropdownOpen}
            onClose={() => setNotifDropdownOpen(false)}
            notifications={notifications}
            onMarkAllAsRead={markAllAsRead}
            onItemClick={(id) => markAsRead(id)}
          />
        </div>

        {/* Profile Trigger (ONLY Profile Name is Capitalized in Green #16A34A) */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 cursor-pointer outline-none text-left p-1 rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="w-8.5 h-8.5 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]/60 font-extrabold text-xs flex items-center justify-center shadow-2xs transition-transform active:scale-95 shrink-0">
              {initials}
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <div className="flex flex-col justify-center">
                <p className="text-xs font-black text-[#16A34A] uppercase tracking-wider whitespace-nowrap leading-tight">
                  {upperDisplayName}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 leading-none mt-0.5">
                  Receptionist
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </div>
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileDropdownOpen(false)}
              />

              <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-2 z-20 flex flex-col gap-0.5 animate-in fade-in duration-150">
                <div className="px-3.5 py-2.5 border-b border-[#E5E7EB] mb-1 bg-[#F8FAFC] rounded-xl">
                  <p className="text-xs font-black text-[#16A34A] uppercase tracking-wider truncate">{upperDisplayName}</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">Receptionist • {displayEmail}</p>
                </div>

                <Link
                  to="/receptionist/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-rose-50 transition-colors text-left cursor-pointer outline-none"
                >
                  <LogOut className="w-4 h-4 text-[#DC2626]" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>

    </header>
  );
}
