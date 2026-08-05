import React from "react";
import * as Icons from "lucide-react";
import clsx from "clsx";

const DashboardStatsCard = ({ title, value, description, iconName, type }) => {
  const Icon = Icons[iconName] || Icons.Calendar;

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-slate-100 shadow-[0_12px_36px_rgba(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300 select-none flex items-center justify-between gap-4">
      {/* Text Details */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
          {value}
        </h3>
        <p className="text-[11px] font-medium text-slate-400 truncate max-w-[160px]">
          {description}
        </p>
      </div>

      {/* Icon Badge */}
      <div
        className={clsx(
          "w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors",
          {
            "bg-[#0E2A6D]/5 text-[#0E2A6D] border-[#0E2A6D]/15": type === "primary",
            "bg-[#F59E0B]/5 text-[#F59E0B] border-[#F59E0B]/15": type === "warning",
            "bg-[#16A34A]/5 text-[#16A34A] border-[#16A34A]/15": type === "success",
            "bg-[#EF4444]/5 text-[#EF4444] border-[#EF4444]/15": type === "danger",
          }
        )}
      >
        <Icon className="w-5.5 h-5.5" />
      </div>
    </div>
  );
};

export default DashboardStatsCard;
