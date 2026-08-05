// src/components/doctor/insights/WeeklyActivityChart.jsx

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function WeeklyActivityChart({ weeklyActivity = [] }) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Weekly Clinic Activity
        </h3>
        <p className="text-xs text-slate-400 font-normal mt-0.5">
          Appointment volume grouped by weekday (Monday – Sunday)
        </p>
      </div>

      <div className="h-64 w-full pt-1 relative">
        {weeklyActivity.reduce((acc, curr) => acc + (curr.count || 0), 0) === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="text-xs font-bold text-slate-400 bg-white/90 px-3 py-1.5 rounded-full border border-slate-100 shadow-2xs">
              No Data Available
            </span>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #F1F5F9",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
                fontSize: "12px",
                fontWeight: 600
              }}
            />
            <Bar dataKey="count" fill="#0E2A6D" radius={[8, 8, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
