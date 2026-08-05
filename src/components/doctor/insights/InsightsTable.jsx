// src/components/insights/InsightsTable.jsx

import React from "react";
import { Activity, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function InsightsTable({ activity = [] }) {
  const getBadgeClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-50 text-blue-800 border-blue-200/80";
      case "Completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "Cancelled":
        return "bg-rose-50 text-rose-800 border-rose-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Recent Patient Activity Log
          </h3>
        </div>
        <span className="text-xs text-slate-400">Latest updates</span>
      </div>

      {activity.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-medium">
          No recent activity logged for this filter.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {activity.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                  {item.patientName ? item.patientName.slice(0, 2).toUpperCase() : "PT"}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.patientName}</h4>
                  <span className="text-[11px] text-slate-500 font-normal">{item.treatment}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${getBadgeClass(item.status)}`}>
                  {item.status}
                </span>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  {item.time} ({item.date})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
