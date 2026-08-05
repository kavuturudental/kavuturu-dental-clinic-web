// src/components/doctor/insights/FilterToolbar.jsx

import React from "react";
import { RefreshCw } from "lucide-react";

export default function FilterToolbar({
  activeRange,
  onRangeChange,
  customRange,
  onCustomRangeChange,
  onRefresh,
  isRefreshing
}) {
  const ranges = ["This Week", "This Month", "Last Month", "This Year", "Custom"];

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Filter Range Pills */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
        {ranges.map((range) => (
          <button
            key={range}
            type="button"
            onClick={() => onRangeChange(range)}
            className={`px-3.5 h-8.5 rounded-full text-xs transition-all duration-150 cursor-pointer outline-none whitespace-nowrap border ${
              activeRange === range
                ? "bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-2xs"
                : "bg-[#F8FAFC] hover:bg-slate-100 border-[#E5E7EB] text-slate-600 font-medium"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Custom Date Inputs & Refresh Trigger */}
      <div className="flex items-center gap-3 flex-wrap">
        {activeRange === "Custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customRange.startDate || ""}
              onChange={(e) => onCustomRangeChange("startDate", e.target.value)}
              className="h-8.5 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-slate-700 outline-none font-mono focus:border-[#2563EB]"
            />
            <span className="text-xs text-slate-400 font-medium">to</span>
            <input
              type="date"
              value={customRange.endDate || ""}
              onChange={(e) => onCustomRangeChange("endDate", e.target.value)}
              className="h-8.5 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-slate-700 outline-none font-mono focus:border-[#2563EB]"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-full bg-[#F8FAFC] hover:bg-slate-100 border border-[#E5E7EB] text-slate-600 transition-all cursor-pointer outline-none flex items-center justify-center disabled:opacity-50"
          title="Refresh Analytics"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#2563EB]" : ""}`} />
        </button>
      </div>
    </div>
  );
}
