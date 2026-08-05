// src/components/doctor/layout/Sidebar.jsx

import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import authService from "../../../services/authService";
import {
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Globe,
  Image as ImageIcon,
  MessageSquare,
  BookOpen,
  Award,
  Sparkles,
  Info,
  Layers,
  UserCheck,
  LayoutDashboard,
  Settings
} from "lucide-react";
import logo from "../../../assets/images/logos/logo.png";

const doctorNavigationBase = [
  {
    category: "Website Management CMS",
    icon: Globe,
    basePath: "/doctor/website-management",
    items: [
      { name: "Hero Section", icon: Sparkles, path: "/doctor/website-management/hero" },
      { name: "About Clinic", icon: Info, path: "/doctor/website-management/about" },
      { name: "Treatments", icon: Layers, path: "/doctor/website-management/treatments" },
      { name: "Doctors", icon: Award, path: "/doctor/website-management/doctors" },
      { name: "Before & After", icon: ImageIcon, path: "/doctor/website-management/before-after" },
      { name: "Gallery", icon: ImageIcon, path: "/doctor/website-management/gallery" },
      { name: "Testimonials & Reviews", icon: MessageSquare, path: "/doctor/website-management/testimonials" },
      { name: "Blogs & Articles", icon: BookOpen, path: "/doctor/website-management/blogs" },
      { name: "Contact & Location", icon: Info, path: "/doctor/website-management/contact" }
    ]
  },
  {
    category: "My Account",
    icon: User,
    basePath: "/doctor/profile",
    items: [
      { name: "Doctor Profile", icon: User, path: "/doctor/profile" }
    ]
  }
];

export default function Sidebar({ className = "", onCloseMobile, onLogoutClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  // State to track expanded sections
  const [expandedCategories, setExpandedCategories] = useState({
    "Website Management CMS": true,
    "My Account": location.pathname.startsWith("/doctor/profile")
  });

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

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

          {/* Success Green Doctor CMS Portal Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] shadow-2xs">
            <UserCheck className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
            <span className="text-[11px] font-black tracking-wider uppercase">
              Doctor CMS Admin
            </span>
          </div>
        </div>

        {/* Navigation Categories & Sub-Items */}
        <nav className="p-3 space-y-3 overflow-y-auto custom-scrollbar flex-1">
          {doctorNavigationBase.map((group) => {
            const isGroupActive = location.pathname.startsWith(group.basePath);
            const isExpanded = expandedCategories[group.category];
            const GroupIcon = group.icon;

            return (
              <div key={group.category} className="space-y-1">
                {/* Category Header Button */}
                <button
                  type="button"
                  onClick={() => toggleCategory(group.category)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isGroupActive ? "text-[#2563EB] bg-[#EFF6FF]" : "text-slate-500 hover:text-slate-900 hover:bg-[#F8FAFC]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GroupIcon className="w-4 h-4 text-[#2563EB]" />
                    <span className="uppercase text-[10px] tracking-wider font-extrabold">{group.category}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>

                {/* Sub-Items List */}
                {isExpanded && (
                  <div className="pl-1 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <NavLink
                          key={item.name}
                          to={item.path}
                          onClick={onCloseMobile}
                          className={`group flex items-center justify-between px-3.5 h-[38px] rounded-xl text-xs transition-all duration-200 outline-none ${
                            isActive
                              ? "bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#BFDBFE]/60"
                              : "text-slate-600 hover:bg-[#F8FAFC] hover:text-[#2563EB] font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                                isActive ? "text-[#2563EB]" : "text-slate-400 group-hover:text-[#2563EB]"
                              }`}
                            />
                            <span className="truncate">{item.name}</span>
                          </div>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
