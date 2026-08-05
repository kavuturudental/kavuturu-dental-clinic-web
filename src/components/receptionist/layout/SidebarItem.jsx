// src/receptionist/components/layout/SidebarItem.jsx

import React from "react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ name, path, icon: Icon, badge, onCloseMobile }) => {
  return (
    <NavLink
      to={path}
      onClick={onCloseMobile}
      className={({ isActive }) =>
        `group flex items-center justify-between px-4 py-3.5 rounded-[14px] text-[14px] tracking-tight transition-all duration-200 outline-none ${
          isActive
            ? "bg-[#0E2A6D] text-white shadow-sm font-extrabold"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3.5">
            <Icon
              className={`w-5 h-5 flex-shrink-0 transition-colors ${
                isActive ? "text-white" : "text-slate-400 group-hover:text-[#0E2A6D]"
              }`}
            />
            <span className="truncate">{name}</span>
          </div>

          {Boolean(badge) && Number(badge) > 0 && (
            <span
              className={`px-2.5 py-0.5 text-[11px] font-black rounded-full transition-colors ${
                isActive
                  ? "bg-white text-[#0E2A6D]"
                  : "bg-[#0E2A6D] text-white shadow-xs"
              }`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
