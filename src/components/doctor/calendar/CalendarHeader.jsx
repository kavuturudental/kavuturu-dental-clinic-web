// src/components/calendar/CalendarHeader.jsx

import React from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function CalendarHeader({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
  searchQuery,
  onSearchChange
}) {
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Left: Prev/Next & Month Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            className="p-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-slate-600 transition-colors cursor-pointer outline-none active:scale-98"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="p-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-slate-600 transition-colors cursor-pointer outline-none active:scale-98"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight min-w-[160px]">{monthName}</h2>

        <button
          type="button"
          onClick={onToday}
          className="px-3.5 py-1.5 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]/60 text-xs font-bold transition-all cursor-pointer outline-none active:scale-98 shadow-2xs"
        >
          Today
        </button>
      </div>

      {/* Right: Search & View Mode Switcher */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-full md:w-56">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patient, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-full border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-4 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-2xs"
          />
        </div>

        <div className="bg-[#F8FAFC] p-1 rounded-full border border-[#E5E7EB] flex items-center gap-1 flex-shrink-0">
          {["month", "week", "day"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all duration-150 cursor-pointer outline-none ${
                viewMode === mode
                  ? "bg-[#2563EB] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
