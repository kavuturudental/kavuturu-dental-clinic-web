// src/components/doctor/website/WebsiteSidebar.jsx

import React from "react";
import {
  Sparkles,
  Info,
  Stethoscope,
  UserCheck,
  Split,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Phone
} from "lucide-react";
import ModuleSidebar from "../layout/ModuleSidebar";

export default function WebsiteSidebar() {
  const websiteItems = [
    { name: "Hero", path: "/doctor/website-management/hero", icon: Sparkles },
    { name: "About Preview", path: "/doctor/website-management/about", icon: Info },
    { name: "Treatments", path: "/doctor/website-management/treatments", icon: Stethoscope },
    { name: "Doctor", path: "/doctor/website-management/doctors", icon: UserCheck },
    { name: "Before & After", path: "/doctor/website-management/before-after", icon: Split },
    { name: "Reviews", path: "/doctor/website-management/testimonials", icon: MessageSquare },
    { name: "Gallery", path: "/doctor/website-management/gallery", icon: ImageIcon },
    { name: "Blogs", path: "/doctor/website-management/blogs", icon: FileText },
    { name: "Contact Information", path: "/doctor/website-management/clinic-info", icon: Phone }
  ];

  return <ModuleSidebar items={websiteItems} />;
}
