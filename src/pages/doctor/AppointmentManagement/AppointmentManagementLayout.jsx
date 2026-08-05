// src/pages/doctor/AppointmentManagement/AppointmentManagementLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";

export default function AppointmentManagementLayout() {
  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-0 select-none">
      <Outlet />
    </div>
  );
}
