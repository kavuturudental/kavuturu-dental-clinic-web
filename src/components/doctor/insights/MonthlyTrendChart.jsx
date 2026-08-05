// src/components/doctor/insights/MonthlyTrendChart.jsx

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList
} from "recharts";

export default function MonthlyTrendChart({
  monthlyTrend = [],
  filterYear = "This Year",
  onYearFilterChange
}) {
  const totalCount = monthlyTrend.reduce((acc, curr) => acc + (curr.appointmentCount || 0), 0);

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Monthly Appointment Trend
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Total appointments booked each month (Jan – Dec)
          </p>
        </div>

        {/* This Year / Last Year Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onYearFilterChange && onYearFilterChange("This Year")}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              filterYear === "This Year"
                ? "bg-[#0E2A6D] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            This Year
          </button>
          <button
            type="button"
            onClick={() => onYearFilterChange && onYearFilterChange("Last Year")}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              filterYear === "Last Year"
                ? "bg-[#0E2A6D] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Last Year
          </button>
        </div>
      </div>

      {/* Recharts Vertical Bar Chart */}
      <div className="h-72 w-full pt-2 relative">
        {totalCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="text-xs font-bold text-slate-400 bg-white/90 px-3 py-1.5 rounded-full border border-slate-100 shadow-2xs">
              No Data Available
            </span>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyTrend} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="month"
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
              cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #F1F5F9",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
                fontSize: "12px",
                fontWeight: 600
              }}
            />
            <Bar
              dataKey="appointmentCount"
              name="Appointment Count"
              fill="#0E2A6D"
              radius={[8, 8, 0, 0]}
              barSize={24}
              animationDuration={800}
            >
              <LabelList
                dataKey="appointmentCount"
                position="top"
                fill="#0E2A6D"
                fontSize={11}
                fontWeight={700}
                offset={6}
                formatter={(val) => (val > 0 ? val : "")}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
