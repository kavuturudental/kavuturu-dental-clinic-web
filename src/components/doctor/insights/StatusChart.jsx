// src/components/insights/StatusChart.jsx

import React from "react";

export default function StatusChart({ data = [] }) {
  const total = data.reduce((acc, curr) => acc + (curr.value || 0), 0) || 1;

  const getColorClass = (name) => {
    switch (name) {
      case "Confirmed":
        return "bg-blue-500 text-blue-900";
      case "Completed":
        return "bg-emerald-500 text-emerald-900";
      case "Pending":
        return "bg-amber-500 text-amber-900";
      case "Cancelled":
        return "bg-rose-500 text-rose-900";
      default:
        return "bg-slate-400 text-slate-900";
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Status Breakdown
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Distribution by current appointment state
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {/* Multi-segment progress bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {data.map((item, idx) => {
            const pct = Math.round(((item.value || 0) / total) * 100);
            if (pct === 0) return null;
            return (
              <div
                key={idx}
                style={{ width: `${pct}%` }}
                className={`h-full transition-all ${getColorClass(item.name).split(" ")[0]}`}
                title={`${item.name}: ${item.value} (${pct}%)`}
              />
            );
          })}
        </div>

        {/* Legend List */}
        <div className="space-y-2 pt-2">
          {data.map((item, idx) => {
            const pct = Math.round(((item.value || 0) / total) * 100);
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${getColorClass(item.name).split(" ")[0]}`} />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{item.value}</span>
                  <span className="text-slate-400 font-normal">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
