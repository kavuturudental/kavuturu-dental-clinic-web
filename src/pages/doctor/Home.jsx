// src/pages/doctor/Home.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock as ClockIcon, Calendar, Globe, UserCheck } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Format full date: e.g. "Monday, 03 August 2026"
  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  // Format live clock: e.g. "10:45:28 AM"
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  // 3 Core Management Cards Data
  const managementCards = [
    {
      id: "appointment-management",
      title: "Appointment Management",
      description: "Manage appointments, schedules, patient visits, appointment requests, calendar and insights.",
      buttonText: "Open Appointments",
      path: "/doctor/appointment-management/dashboard",
      buttonBg: "bg-[#0E2A6D] hover:bg-[#16398b]",
      hoverBorder: "hover:border-[#0E2A6D]/30",
      illustration: (
        <svg className="w-full h-full max-h-[85px] transition-transform duration-300 group-hover:scale-[1.04]" viewBox="0 0 300 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="110" rx="14" fill="#F8FAFC" />
          <rect x="35" y="12" width="75" height="86" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="35" y="12" width="75" height="20" rx="10" fill="#0E2A6D" />
          <circle cx="48" cy="22" r="2.5" fill="#60A5FA" />
          <circle cx="58" cy="22" r="2.5" fill="#60A5FA" />
          <circle cx="68" cy="22" r="2.5" fill="#60A5FA" />
          <rect x="46" y="42" width="12" height="12" rx="3" fill="#EFF6FF" />
          <rect x="64" y="42" width="12" height="12" rx="3" fill="#EFF6FF" />
          <rect x="82" y="42" width="12" height="12" rx="3" fill="#0E2A6D" />
          <rect x="46" y="60" width="12" height="12" rx="3" fill="#EFF6FF" />
          <rect x="64" y="60" width="12" height="12" rx="3" fill="#3B82F6" />
          <rect x="82" y="60" width="12" height="12" rx="3" fill="#EFF6FF" />
          <g transform="translate(130, 15)">
            <rect width="135" height="78" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="38" cy="28" r="13" fill="#DBEAFE" />
            <path d="M38 19C34 19 30 22 30 26C30 30 34 33 38 33C42 33 46 30 46 26C46 22 42 19 38 19Z" fill="#1E40AF" />
            <path d="M24 54C24 45 30 39 38 39C46 39 52 45 52 54" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" />
            <path d="M68 42L73 42L77 34L82 50L88 27L93 42L96 42" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      )
    },
    {
      id: "website-management",
      title: "Website Management",
      description: "Manage homepage, treatments, gallery, testimonials, blogs, and public clinic contact information.",
      buttonText: "Open Website Management",
      path: "/doctor/website-management/hero",
      buttonBg: "bg-[#0E2A6D] hover:bg-[#16398b]",
      hoverBorder: "hover:border-[#0E2A6D]/30",
      illustration: (
        <svg className="w-full h-full max-h-[85px] transition-transform duration-300 group-hover:scale-[1.04]" viewBox="0 0 300 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="110" rx="14" fill="#F8FAFC" />
          <rect x="35" y="12" width="135" height="86" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="35" y="12" width="135" height="18" rx="10" fill="#0F172A" />
          <circle cx="47" cy="21" r="2.5" fill="#EF4444" />
          <circle cx="55" cy="21" r="2.5" fill="#F59E0B" />
          <circle cx="63" cy="21" r="2.5" fill="#10B981" />
          <rect x="76" y="17" width="76" height="8" rx="4" fill="#1E293B" />
          <rect x="46" y="38" width="48" height="22" rx="4" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
          <rect x="102" y="38" width="56" height="50" rx="4" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
          <rect x="46" y="66" width="48" height="22" rx="4" fill="#F1F5F9" opacity="0.8" />
          <g transform="translate(190, 20)">
            <circle cx="35" cy="35" r="26" fill="white" stroke="#10B981" strokeWidth="2" />
            <circle cx="35" cy="35" r="18" fill="#D1FAE5" opacity="0.6" />
            <path d="M35 15C46 15 55 24 55 35C55 46 46 55 35 55C24 55 15 46 15 35C15 24 24 15 35 15Z" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M15 35H55M35 15C40 21 42 28 42 35C42 42 40 49 35 55C30 49 28 42 28 35C28 28 30 21 35 15Z" stroke="#059669" strokeWidth="1" />
          </g>
        </svg>
      )
    },
    {
      id: "my-account",
      title: "My Account",
      description: "Manage doctor profile information, security, password change, and login activity.",
      buttonText: "Open My Account",
      path: "/doctor/profile",
      buttonBg: "bg-[#0E2A6D] hover:bg-[#16398b]",
      hoverBorder: "hover:border-[#0E2A6D]/30",
      illustration: (
        <svg className="w-full h-full max-h-[85px] transition-transform duration-300 group-hover:scale-[1.04]" viewBox="0 0 300 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="110" rx="14" fill="#F8FAFC" />
          <rect x="35" y="12" width="115" height="86" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="92" cy="40" r="15" fill="#F3E8FF" />
          <path d="M92 31C87 31 83 35 83 39C83 43 87 47 92 47C97 47 101 43 101 39C101 35 97 31 92 31Z" fill="#7E22CE" />
          <path d="M76 66C76 57 83 52 92 52C101 52 108 57 108 66" stroke="#7E22CE" strokeWidth="3" strokeLinecap="round" />
          <rect x="53" y="75" width="78" height="6" rx="3" fill="#E9D5FF" />
          <g transform="translate(170, 15)">
            <rect width="85" height="78" rx="10" fill="white" stroke="#C084FC" strokeWidth="1.5" />
            <path d="M57 20C57 20 42 14 42 14C42 14 27 20 27 20C27 42 27 52 42 64C57 52 57 42 57 20Z" fill="#7E22CE" />
            <path d="M37 37L40 40L47 33" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 select-none font-sans h-full flex flex-col justify-between py-2">
      
      {/* 1. HEADER & LIVE CLOCK SECTION (Matches Receptionist Page Title & Subtitle Scale) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-[#0E2A6D] bg-[#0E2A6D]/10 border border-[#0E2A6D]/20">
              Doctor Hub
            </span>
          </div>

          {/* Page Title: text-2xl font-extrabold text-slate-900 tracking-tight */}
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, <span className="text-[#0E2A6D]">Dr. K. Ravindra Babu</span>
          </h1>

          {/* Short Description: text-xs text-slate-500 font-medium mt-0.5 */}
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage appointments, website content, and your account from one centralized portal.
          </p>
        </div>

        {/* Live Date & Digital Clock Display */}
        <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-2xs flex-shrink-0">
          <ClockIcon className="w-4 h-4 text-[#0E2A6D] flex-shrink-0" />
          <div className="text-right">
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              {formattedDate}
            </span>
            <span className="font-mono text-[11px] font-semibold text-slate-500 block mt-0.5">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* 2. THREE CORE MODULE CARDS SIDE-BY-SIDE (Matches Receptionist Card Typography) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-auto py-3">
        {managementCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            onClick={() => navigate(card.path)}
            className={`bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all duration-200 relative overflow-hidden group h-[270px] ${card.hoverBorder}`}
          >
            {/* Compact Illustration */}
            <div className="relative z-10 flex items-center justify-center h-[85px] w-full">
              {card.illustration}
            </div>

            {/* Title & Short Description */}
            <div className="relative z-10 my-1 text-left space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-[#0E2A6D] transition-colors duration-200 truncate">
                {card.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                {card.description}
              </p>
            </div>

            {/* Primary Button */}
            <div className="relative z-10 pt-1 w-full mt-auto">
              <button
                type="button"
                className={`w-full h-9.5 px-4 rounded-xl ${card.buttonBg} text-white text-xs font-bold flex items-center justify-between transition-all duration-200 cursor-pointer outline-none shadow-2xs group-hover:shadow-xs`}
              >
                <span className="truncate">{card.buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
