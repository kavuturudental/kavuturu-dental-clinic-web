// src/components/doctor/layout/Breadcrumb.jsx

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home, Clock } from "lucide-react";

export default function Breadcrumb() {
  const location = useLocation();
  const path = location.pathname;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Date & Time formatting (inline text, no floating card)
  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const getBreadcrumbItems = () => {
    // Hide breadcrumb on main Doctor Hub dashboard home
    if (path === "/doctor/home" || path === "/doctor" || path === "/doctor/") {
      return null;
    }

    const items = [
      { label: "Doctor Portal", path: "/doctor/appointment-management/dashboard", isLast: false }
    ];

    if (path.startsWith("/doctor/website-management")) {
      let sectionName = "Hero";
      if (path.includes("/hero")) sectionName = "Hero";
      else if (path.includes("/about")) sectionName = "About Preview";
      else if (path.includes("/treatments")) sectionName = "Treatments";
      else if (path.includes("/doctors")) sectionName = "Doctor";
      else if (path.includes("/before-after")) sectionName = "Before & After";
      else if (path.includes("/testimonials")) sectionName = "Reviews";
      else if (path.includes("/gallery")) sectionName = "Gallery";
      else if (path.includes("/blogs")) sectionName = "Blogs";
      else if (path.includes("/clinic-info")) sectionName = "Contact Information";

      items.push({
        label: "Website Management",
        path: "/doctor/website-management/hero",
        isLast: false
      });
      items.push({
        label: sectionName,
        path: path,
        isLast: true
      });
      return items;
    }

    if (path.startsWith("/doctor/appointment-management")) {
      let sectionName = "Appointments";
      if (path.includes("/requests")) sectionName = "Appointment Requests";
      else if (path.includes("/patients")) sectionName = "Patients";
      else if (path.includes("/calendar")) sectionName = "Calendar";
      else if (path.includes("/data-export")) sectionName = "Data Export";
      else if (path.includes("/insights")) sectionName = "Insights";
      else if (path.includes("/notifications")) sectionName = "Notifications";

      items.push({
        label: "Appointment Management",
        path: "/doctor/appointment-management/dashboard",
        isLast: false
      });
      items.push({
        label: sectionName,
        path: path,
        isLast: true
      });
      return items;
    }

    if (path === "/doctor/profile") {
      items.push({
        label: "My Account",
        path: "/doctor/profile",
        isLast: true
      });
      return items;
    }

    return items;
  };

  const items = getBreadcrumbItems();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="w-full bg-white border-b border-slate-100 py-2.5 flex-shrink-0 select-none">
      <div className="max-w-[1280px] w-full mx-auto px-6 sm:px-8 flex items-center justify-between gap-4 text-xs font-sans">
        
        {/* Left Side: Breadcrumb Links */}
        <div className="flex items-center gap-2 flex-wrap">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              )}
              {item.isLast ? (
                <span className="text-[#0E2A6D] font-semibold tracking-tight flex items-center gap-1.5">
                  {index === 0 && <Home className="w-3.5 h-3.5 text-[#0E2A6D]" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-slate-500 hover:text-[#0E2A6D] font-medium transition-colors flex items-center gap-1.5"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5 text-slate-400" />}
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right Side: Compact Inline Date & Live Ticking Clock (No Floating Card) */}
        <div className="flex items-center gap-2 text-slate-600 font-medium text-xs flex-shrink-0">
          <Clock className="w-3.5 h-3.5 text-[#0E2A6D]" />
          <span>{formattedDate}</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-slate-900 font-semibold">{formattedTime}</span>
        </div>

      </div>
    </nav>
  );
}
