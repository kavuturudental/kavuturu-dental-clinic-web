// src/components/doctor/website/SectionCardHeader.jsx

import React from "react";
import { Clock, User, CheckCircle2, Save, Sparkles, Upload } from "lucide-react";

export default function SectionCardHeader({
  icon: Icon,
  sectionName,
  description,
  status = "Published",
  lastUpdated = "29 Jul 2026 • 08:15 AM",
  updatedBy = "Dr. K. Ravindra Babu",
  latestActivity = "Updated section content & media",
  onSave,
  isSaving = false
}) {
  const getStatusStyle = (st) => {
    switch (st) {
      case "Published":
        return "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]";
      case "Updated Today":
        return "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]";
      case "Recently Modified":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Draft":
        return "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]";
      default:
        return "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]";
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold flex-shrink-0 border border-[#BFDBFE]">
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">{sectionName}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getStatusStyle(status)}`}>
                {status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">{description}</p>
          </div>
        </div>

        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="h-9.5 px-4 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-98 transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-2xs flex-shrink-0 outline-none disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : `Save ${sectionName}`}</span>
          </button>
        )}
      </div>

      {/* Metadata & Activity Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
        <div className="flex items-center gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E5E7EB]">
          <Clock className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
          <div className="truncate">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">Last Updated</span>
            <span className="font-extrabold text-slate-700 leading-tight block">{lastUpdated}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E5E7EB]">
          <User className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
          <div className="truncate">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">Updated By</span>
            <span className="font-extrabold text-slate-700 leading-tight block">{updatedBy}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E5E7EB]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <div className="truncate">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">Latest Activity</span>
            <span className="font-semibold text-slate-600 leading-tight block truncate">{latestActivity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
