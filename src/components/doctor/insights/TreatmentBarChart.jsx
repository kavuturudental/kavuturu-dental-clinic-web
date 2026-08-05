// src/components/doctor/insights/TreatmentBarChart.jsx

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";

export default function TreatmentBarChart({ treatmentDistribution = [] }) {
  const colors = ["#0E2A6D", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"];

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Most Popular Treatments (Top 5)
        </h3>
        <p className="text-xs text-slate-400 font-normal mt-0.5">
          Distribution of completed & booked clinical procedures
        </p>
      </div>

      <div className="h-64 w-full pt-1 relative">
        {treatmentDistribution.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="text-xs font-bold text-slate-400 bg-white/90 px-3 py-1.5 rounded-full border border-slate-100 shadow-2xs">
              No Data Available
            </span>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={treatmentDistribution.length > 0 ? treatmentDistribution : [{ treatment: "--", count: 0 }]}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="treatment"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#334155", fontSize: 11, fontWeight: 700 }}
              width={140}
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
            <Bar dataKey="count" radius={[0, 12, 12, 0]} barSize={20}>
              {treatmentDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
