// src/components/receptionist/appointments/AppointmentFilters.jsx

import React from "react";

const filterOptions = ["All", "Today", "Upcoming", "Completed", "Cancelled"];

export default function AppointmentFilters({
  activeFilter = "All",
  onChangeFilter,
  counts = {}
}) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto custom-scrollbar py-0.5 select-none">
      {filterOptions.map((filter) => {
        const isActive = activeFilter === filter;
        const count = counts[filter] ?? 0;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChangeFilter && onChangeFilter(filter)}
            className={`px-4 h-9.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-150 cursor-pointer outline-none whitespace-nowrap border ${
              isActive
                ? "bg-[#2563EB] text-white border-[#2563EB] shadow-2xs font-bold"
                : "bg-[#F8FAFC] hover:bg-slate-100 border-[#E5E7EB] text-slate-600 font-medium"
            }`}
          >
            <span>{filter}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-slate-200/80 text-slate-600"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
