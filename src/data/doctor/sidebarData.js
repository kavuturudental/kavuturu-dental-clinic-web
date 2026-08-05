// src/data/doctor/sidebarData.js

import { Calendar, Globe, User } from "lucide-react";

export const sidebarData = [
  {
    name: "Appointment Management",
    icon: Calendar,
    path: "/doctor/appointment-management",
  },
  {
    name: "Website Management",
    icon: Globe,
    path: "/doctor/website-management",
  },
  {
    name: "My Account",
    icon: User,
    path: "/doctor/profile",
  },
];
