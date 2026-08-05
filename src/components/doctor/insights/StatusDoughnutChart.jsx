// src/components/doctor/insights/StatusDoughnutChart.jsx

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

export default function StatusDoughnutChart({ appointmentStatus = [] }) {
  const statusColorMap = {
    Confirmed: "#3B82F6",    // Blue
    "Checked In": "#8B5CF6", // Purple
    Completed: "#10B981",    // Emerald/Green
    Cancelled: "#EF4444"     // Red
  };

  const filteredItems = appointmentStatus.filter(
    (item) => item.status && !["pending", "pending requests", "pending approvals"].includes(item.status.toLowerCase())
  );

  const total = filteredItems.reduce((acc, curr) => acc + (curr.count || 0), 0);

  const formattedData = filteredItems.map((item) => {
    const val = item.count || 0;
    const pct = total > 0 ? Math.round((val / total) * 100) : 0;
    return {
      name: `${item.status} (${pct}%)`,
      value: val,
      color: statusColorMap[item.status] || "#94A3B8"
    };
  });

  const doughnutData = total === 0 ? [{ name: "No Data", value: 1, color: "#E2E8F0" }] : formattedData;

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Appointment Status Breakdown
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Doughnut distribution across appointment states
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {total} Total
        </span>
      </div>

      <div className="h-64 w-full pt-1 relative">
        {total === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="text-xs font-bold text-slate-400">
              No Data
            </span>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={doughnutData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={total === 0 ? 0 : 4}
              dataKey="value"
            >
              {doughnutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {total > 0 && (
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
            )}
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingTop: "10px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
