// src/components/doctor/appointments/AppointmentSidebar.jsx

import React from "react";
import {
  CalendarDays,
  Inbox,
  Users,
  Bell
} from "lucide-react";
import ModuleSidebar from "../layout/ModuleSidebar";

export default function AppointmentSidebar() {
  const appointmentItems = [
    { name: "Appointments", path: "/doctor/appointment-management/appointments", icon: CalendarDays },
    { name: "Appointment Requests", path: "/doctor/appointment-management/requests", icon: Inbox },
    { name: "Patients", path: "/doctor/appointment-management/patients", icon: Users },
    { name: "Notifications", path: "/doctor/appointment-management/notifications", icon: Bell }
  ];

  return <ModuleSidebar items={appointmentItems} />;
}
