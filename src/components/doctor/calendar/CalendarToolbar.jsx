// src/components/calendar/CalendarToolbar.jsx

import React from "react";

export default function CalendarToolbar({
  activeFilter,
  onFilterChange,
  statusFilter,
  onStatusFilterChange
}) {
  const quickFilters = ["All", "Today", "Tomorrow", "This Week", "This Month"];
  const statusFilters = [
    { label: "All Statuses", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Confirmed", value: "Confirmed" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" }
  ];

  return (
    <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 select-none">
      {/* Quick Date Range Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
        {quickFilters.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onFilterChange(tab)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer outline-none whitespace-nowrap border ${
              activeFilter === tab
                ? "bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-2xs"
                : "bg-[#F8FAFC] hover:bg-slate-100 border-[#E5E7EB] text-slate-600 font-medium"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
        {statusFilters.map((st) => (
          <button
            key={st.value}
            type="button"
            onClick={() => onStatusFilterChange(st.value)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer outline-none whitespace-nowrap border ${
              statusFilter === st.value
                ? "bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-2xs"
                : "bg-white hover:bg-[#F8FAFC] border-[#E5E7EB] text-slate-700 font-medium"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>
    </div>
  );
}
