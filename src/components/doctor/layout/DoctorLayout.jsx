// src/components/doctor/layout/DoctorLayout.jsx

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "./Topbar";
import Breadcrumb from "./Breadcrumb";

export default function DoctorLayout() {
  const location = useLocation();

  const isWebsiteManagement = location.pathname.startsWith("/doctor/website-management");
  const isAppointmentManagement = location.pathname.startsWith("/doctor/appointment-management");
  const isModuleWithSidebar = isWebsiteManagement || isAppointmentManagement;
  const isHome = location.pathname === "/doctor/home" || location.pathname === "/doctor" || location.pathname === "/doctor/";

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] flex flex-col overflow-hidden font-sans select-none relative text-slate-800">
      {/* 1. Fixed Top Bar */}
      <Topbar />

      {/* 2. Page Container Below Top Bar */}
      <div className="pt-20 h-screen w-full flex flex-col overflow-hidden bg-[#F8FAFC]">
        {/* 3. Reusable Breadcrumb Banner */}
        <Breadcrumb />

        {/* 4. Workspace Area */}
        {isModuleWithSidebar ? (
          <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
            <Outlet />
          </div>
        ) : isHome ? (
          <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-8 flex-1 flex flex-col justify-between overflow-hidden py-4">
            <Outlet />
          </div>
        ) : (
          <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-8 flex-1 flex flex-col overflow-y-auto pt-6 pb-12">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}
