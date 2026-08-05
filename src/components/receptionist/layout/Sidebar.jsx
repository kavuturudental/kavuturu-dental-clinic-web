// src/components/receptionist/layout/Sidebar.jsx

import React from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import authService from "../../../services/authService";
import useAppointmentRequests from "../../../hooks/useAppointmentRequests";
import useNotifications from "../../../hooks/useNotifications";
import {
  Calendar,
  FileText,
  Users,
  Bell,
  User,
  LogOut,
  UserCheck
} from "lucide-react";
import logo from "../../../assets/images/logos/logo.png";

const navigationGroups = [
  {
    title: "CLINIC MANAGEMENT",
    items: [
      { name: "Appointments", icon: Calendar, path: "/receptionist/appointments" },
      { name: "Appointment Requests", icon: FileText, path: "/receptionist/appointment-requests" }
    ]
  },
  {
    title: "PATIENTS",
    items: [
      { name: "Patients", icon: Users, path: "/receptionist/patients" }
    ]
  },
  {
    title: "ACCOUNT",
    items: [
      { name: "Notifications", icon: Bell, path: "/receptionist/notifications" },
      { name: "Profile", icon: User, path: "/receptionist/profile" }
    ]
  }
];

export default function Sidebar({ className = "", onCloseMobile, onLogoutClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { requests } = useAppointmentRequests();
  const { notifications } = useNotifications();

  const pendingRequestsCount = Array.isArray(requests)
    ? requests.filter((r) => (r.status || "").toLowerCase() === "pending").length
    : 0;

  const unreadNotificationsCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read && !n.isRead).length
    : 0;

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      authService.logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className={`w-[260px] min-w-[260px] flex-shrink-0 bg-white rounded-2xl border border-[#E5E7EB] flex flex-col h-full z-30 select-none font-sans justify-between shadow-2xs ${className}`}>
      
      {/* Top Header & Navigation Container */}
      <div className="flex flex-col min-h-0 flex-1">
        
        {/* Dedicated Logo Header Area */}
        <div className="p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-3 flex-shrink-0">
          <div className="p-3 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs flex items-center justify-center w-full transition-all">
            <img
              src={logo}
              alt="Kavuturu Dental Clinic Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Success Green Receptionist Portal Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] shadow-2xs">
            <UserCheck className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
            <span className="text-[11px] font-black tracking-wider uppercase">
              Receptionist Portal
            </span>
          </div>
        </div>

        {/* Grouped Navigation List with Light Blue #EFF6FF & Blue #2563EB Active Item Styling */}
        <nav className="py-2 overflow-y-auto custom-scrollbar flex-1 space-y-3.5">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-5 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                {group.title}
              </div>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isAppointments = item.path === "/receptionist/appointments" && 
                  (location.pathname === "/receptionist" || location.pathname === "/receptionist/dashboard" || location.pathname === "/receptionist/appointments");
                const isActive = isAppointments || location.pathname === item.path;

                let badgeValue = 0;
                let badgeColorClass = "";

                if (item.name === "Appointment Requests") {
                  badgeValue = pendingRequestsCount;
                  badgeColorClass = "bg-[#F59E0B] text-white";
                } else if (item.name === "Notifications") {
                  badgeValue = unreadNotificationsCount;
                  badgeColorClass = "bg-[#DC2626] text-white";
                }

                return (
                  <div key={item.name} className="px-3">
                    <NavLink
                      to={item.path}
                      onClick={onCloseMobile}
                      className={`group flex items-center justify-between px-3.5 h-[38px] rounded-xl text-xs transition-all duration-200 outline-none ${
                        isActive
                          ? "bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#BFDBFE]/60"
                          : "text-slate-600 hover:bg-[#F8FAFC] hover:text-[#2563EB] font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 transition-colors ${
                            isActive ? "text-[#2563EB]" : "text-slate-400 group-hover:text-[#2563EB]"
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {badgeValue > 0 && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors shadow-2xs ${badgeColorClass}`}
                        >
                          {badgeValue}
                        </span>
                      )}
                    </NavLink>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Bottom: Dedicated Centered Logout Section */}
      <div className="p-3 pb-4 flex-shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-9.5 flex items-center justify-center gap-2 px-3 rounded-xl border border-[#E5E7EB] hover:border-rose-200 text-slate-600 hover:text-[#DC2626] hover:bg-rose-50/70 text-xs font-bold transition-all duration-200 cursor-pointer outline-none active:scale-98 shadow-2xs"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-[#DC2626]" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}
