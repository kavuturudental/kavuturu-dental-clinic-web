// src/components/doctor/insights/NewVsReturningChart.jsx

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function NewVsReturningChart({
  newVsReturningData = [],
  filterYear = "This Year",
  onYearFilterChange
}) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            New vs Returning Patients
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Monthly acquisition of first-time vs repeat returning patients
          </p>
        </div>

        {/* Filter Toggle */}
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

      {/* Recharts Grouped Bar Chart */}
      <div className="h-72 w-full pt-2 relative">
        {newVsReturningData.reduce((acc, curr) => acc + (curr.newPatients || 0) + (curr.returningPatients || 0), 0) === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="text-xs font-bold text-slate-400 bg-white/90 px-3 py-1.5 rounded-full border border-slate-100 shadow-2xs">
              No Data Available
            </span>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={newVsReturningData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 600 }}
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
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: "12px", fontWeight: 600, paddingBottom: "10px" }}
            />
            <Bar dataKey="newPatients" name="New Patients" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={16} />
            <Bar dataKey="returningPatients" name="Returning Patients" fill="#10B981" radius={[6, 6, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
