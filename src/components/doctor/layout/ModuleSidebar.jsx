import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";
import authService from "../../../services/authService";

export default function ModuleSidebar({ items = [] }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  const isItemActive = (itemPath) => {
    const currentPath = location.pathname;
    if (itemPath === "/doctor/website-management/hero") {
      return (
        currentPath === "/doctor/website-management/hero" ||
        currentPath === "/doctor/website-management/homepage" ||
        currentPath === "/doctor/website-management" ||
        currentPath === "/doctor/website-management/"
      );
    }
    if (itemPath === "/doctor/appointment-management/appointments") {
      return (
        currentPath === "/doctor/appointment-management/appointments" ||
        currentPath === "/doctor/appointment-management/dashboard" ||
        currentPath === "/doctor/appointment-management" ||
        currentPath === "/doctor/appointment-management/"
      );
    }
    return currentPath === itemPath;
  };

  return (
    <aside className="w-[225px] min-w-[225px] h-[calc(100vh-175px)] bg-white border border-slate-200/90 rounded-[24px] shadow-[0_12px_36px_rgba(0,0,0,0.03)] flex flex-col justify-between select-none font-sans overflow-hidden flex-shrink-0">
      
      {/* 1. Main Navigation Items */}
      <div className="p-3.5 flex-1 overflow-y-auto space-y-1 custom-scrollbar">
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center justify-between px-3.5 h-10 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#0E2A6D] text-white shadow-xs font-extrabold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors flex-shrink-0 ${
                      active ? "text-white" : "text-slate-400 group-hover:text-[#0E2A6D]"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {active ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 2. Sidebar Footer (Fixed Log Out Button - Fully Visible at Viewport Bottom) */}
      <div className="p-3.5 border-t border-slate-100 flex-shrink-0 bg-white">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-10 rounded-xl border border-rose-200/90 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-100/70 text-rose-600 font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer outline-none shadow-2xs"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Log Out</span>
        </button>
      </div>

    </aside>
  );
}
