// src/components/doctor/layout/Topbar.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import authService from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Calendar,
  Clock
} from "lucide-react";
import doctorImage from "../../../assets/images/doctors/dr-ravindra-babu.webp";
import NotificationDropdown from "../../receptionist/layout/NotificationDropdown";
import useNotifications from "../../../hooks/useNotifications";

export default function Topbar({ onToggleSidebar, onLogoutClick, onSearchChange, searchValue }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // ONLY Profile Name is Capitalized in Green #16A34A
  const rawName = user?.name || "Dr. K. Ravindra Babu";
  const upperDisplayName = String(rawName).toUpperCase();
  const designation = user?.qualification || "Chief Dental Surgeon & Specialist";

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
    const p = location.pathname;
    if (p.includes("/website-management/hero")) return { title: "Hero Section", subtitle: "Manage homepage hero content and badges." };
    if (p.includes("/website-management/about")) return { title: "About Clinic", subtitle: "Manage clinic biography and overview." };
    if (p.includes("/website-management/treatments")) return { title: "Treatments CMS", subtitle: "Manage dental services listed on website." };
    if (p.includes("/website-management/doctors")) return { title: "Doctors CMS", subtitle: "Manage chief doctor & associate profiles." };
    if (p.includes("/website-management/before-after")) return { title: "Before & After", subtitle: "Manage clinical case transformations." };
    if (p.includes("/website-management/gallery")) return { title: "Gallery CMS", subtitle: "Manage website photo gallery." };
    if (p.includes("/website-management/testimonials")) return { title: "Reviews CMS", subtitle: "Manage patient testimonials." };
    if (p.includes("/website-management/blogs")) return { title: "Blogs CMS", subtitle: "Manage dental articles and news." };
    if (p.includes("/website-management/clinic-info")) return { title: "Contact Information", subtitle: "Manage public contact details and hours." };
    
    if (p.includes("/appointment-management/dashboard")) return { title: "Dashboard Overview", subtitle: "Real-time summary of appointments & metrics." };
    if (p.includes("/appointment-management/appointments")) return { title: "Appointments", subtitle: "Manage patient schedules and visits." };
    if (p.includes("/appointment-management/requests")) return { title: "Appointment Requests", subtitle: "Review incoming online booking requests." };
    if (p.includes("/appointment-management/patients")) return { title: "Patient Directory", subtitle: "Directory of registered clinic patients." };
    if (p.includes("/appointment-management/calendar")) return { title: "Calendar Schedule", subtitle: "Visual calendar view of bookings." };
    if (p.includes("/appointment-management/data-export")) return { title: "Data Export", subtitle: "Export appointment & patient reports." };
    if (p.includes("/appointment-management/insights")) return { title: "Insights & Reports", subtitle: "Clinical analytics and revenue reports." };
    if (p.includes("/appointment-management/notifications")) return { title: "Notifications", subtitle: "System alerts and booking updates." };

    if (p.includes("/doctor/profile")) return { title: "Doctor Profile", subtitle: "Manage your professional details & account." };

    return { title: "Doctor Portal", subtitle: "Kavuturu Dental Clinic Management" };
  };

  const headerInfo = getHeaderInfo();

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
            placeholder="Search portal..."
            className="h-9.5 w-full rounded-full border border-[#E5E7EB] bg-[#F8FAFC] pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#EFF6FF] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* 3. Right Column: Date/Time Card ↔ Notification ↔ Doctor Profile */}
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
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 cursor-pointer outline-none text-left p-1 rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="relative flex-shrink-0">
              <img
                src={doctorImage}
                alt="Doctor Profile"
                className="w-8.5 h-8.5 rounded-xl object-cover border border-[#E5E7EB] shadow-2xs"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#16A34A] rounded-full ring-2 ring-white"></span>
            </div>

            <div className="hidden sm:flex items-center gap-1">
              <div className="flex flex-col justify-center">
                <p className="text-xs font-black text-[#16A34A] uppercase tracking-wider whitespace-nowrap leading-tight">
                  {upperDisplayName}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 leading-none mt-0.5 max-w-[180px] truncate">
                  {designation}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </div>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />

              <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-2 z-20 flex flex-col gap-0.5 animate-in fade-in duration-150">
                <div className="px-3.5 py-2.5 border-b border-[#E5E7EB] mb-1 bg-[#F8FAFC] rounded-xl">
                  <p className="text-xs font-black text-[#16A34A] uppercase tracking-wider truncate">{upperDisplayName}</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">{designation}</p>
                </div>

                <Link
                  to="/doctor/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
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
