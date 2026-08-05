// src/components/insights/PeakHoursChart.jsx

import React from "react";

export default function PeakHoursChart({ data = [] }) {
  const maxVal = Math.max(...data.map(d => d.appointments || 0), 5);

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Peak Booking Hours
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Busiest time slots during clinic operating hours
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-xs text-slate-400 text-center py-6">No peak hour data available.</div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-4 items-end h-36 border-b border-slate-100 pb-2">
          {data.map((item, idx) => {
            const heightPct = Math.round(((item.appointments || 0) / maxVal) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-1 group h-full justify-end">
                <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.appointments}
                </span>
                <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-amber-500 rounded-t-lg transition-all group-hover:bg-amber-600"
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-400 truncate w-full text-center mt-1">
                  {item.hour ? item.hour.replace(":00", "") : `H${idx}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
