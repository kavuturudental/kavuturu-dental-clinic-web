// src/components/insights/TreatmentChart.jsx

import React from "react";

export default function TreatmentChart({ data = [] }) {
  const maxCount = Math.max(...data.map(d => d.count || 0), 5);

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Top Treatments
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Most requested clinical dental procedures
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {data.length === 0 ? (
          <div className="text-xs text-slate-400 text-center py-6">No treatment data available.</div>
        ) : (
          data.map((item, idx) => {
            const pct = Math.round(((item.count || 0) / maxCount) * 100);
            return (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold truncate max-w-[200px]">{item.name}</span>
                  <span className="font-mono font-bold text-slate-900">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-[#0E2A6D] rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
