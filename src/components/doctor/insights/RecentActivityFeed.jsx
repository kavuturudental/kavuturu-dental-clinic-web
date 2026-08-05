// src/components/doctor/insights/RecentActivityFeed.jsx

import React from "react";
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Calendar,
  UserPlus,
  Bell,
  Activity
} from "lucide-react";

export default function RecentActivityFeed({ recentActivity = [] }) {
  const getStyleForType = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("request")) {
      return { icon: Inbox, bg: "bg-amber-50 text-amber-600 border-amber-200/80" };
    }
    if (t.includes("approved") || t.includes("accept")) {
      return { icon: CheckCircle2, bg: "bg-emerald-50 text-emerald-600 border-emerald-200/80" };
    }
    if (t.includes("cancelled") || t.includes("rejected")) {
      return { icon: XCircle, bg: "bg-rose-50 text-rose-600 border-rose-200/80" };
    }
    if (t.includes("rescheduled")) {
      return { icon: Calendar, bg: "bg-blue-50 text-blue-600 border-blue-200/80" };
    }
    if (t.includes("patient")) {
      return { icon: UserPlus, bg: "bg-purple-50 text-purple-600 border-purple-200/80" };
    }
    return { icon: Bell, bg: "bg-slate-50 text-slate-600 border-slate-200/80" };
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#0E2A6D]" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Recent Clinic Activity Log
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Newest first</span>
      </div>

      {recentActivity.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 font-medium">
          No recent activity logs recorded in database.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recentActivity.map((item) => {
            const { icon: ItemIcon, bg } = getStyleForType(item.type);
            return (
              <div key={item.id} className="py-3 flex items-start gap-3.5 hover:bg-slate-50/50 transition-colors rounded-xl px-2">
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center border flex-shrink-0 mt-0.5 ${bg}`}>
                  <ItemIcon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono font-medium flex-shrink-0">
                      {item.timeAgo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
