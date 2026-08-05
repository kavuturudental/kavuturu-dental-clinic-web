// src/components/insights/TrendChart.jsx

import React from "react";

export default function TrendChart({ data = [] }) {
  const maxVal = Math.max(...data.map(d => d.Total || 0), 10);

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Appointment Booking Trend
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Daily appointment volume & completion tracking
          </p>
        </div>
        <span className="text-xs font-bold text-[#0E2A6D] bg-[#0E2A6D]/10 px-2.5 py-0.5 rounded-full">
          Volume Trend
        </span>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-400 text-xs italic">
          No trend data available for this range.
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {/* Responsive Bar Graphic Chart Representation */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100">
            {data.slice(-7).map((item, idx) => {
              const heightPct = Math.round(((item.Total || 0) / maxVal) * 100);
              const completedPct = Math.round(((item.Completed || 0) / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
                  <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.Total}
                  </div>
                  <div className="w-full max-w-[28px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full transition-all group-hover:bg-slate-200">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-[#0E2A6D] rounded-t-xl transition-all relative flex flex-col justify-end"
                    >
                      <div
                        style={{ height: `${completedPct}%` }}
                        className="w-full bg-emerald-500 transition-all rounded-t-xl"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 truncate w-full text-center mt-1">
                    {item.date ? item.date.slice(5) : `Day ${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0E2A6D]" />
              <span>Total Appointments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Completed Visits</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
