// src/receptionist/components/dashboard/CompactQuickActions.jsx

import React from "react";
import { PlusCircle, FileText, Search, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CompactQuickActions = ({ onNew, onSearchPatient }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.03)] space-y-3.5 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          Quick Actions
        </h3>
        <span className="text-[11px] font-bold text-slate-400">Reception Shortcuts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Action 1: New Appointment */}
        <button
          type="button"
          onClick={onNew}
          className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-[#0E2A6D] text-slate-800 hover:text-white border border-slate-100 hover:border-[#0E2A6D] transition-all duration-200 shadow-xs cursor-pointer active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center text-[#0E2A6D] group-hover:text-white transition-colors border border-slate-100 group-hover:border-transparent flex-shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold">New Appointment</div>
              <div className="text-[10px] text-slate-400 group-hover:text-white/80 font-medium">Schedule consultation</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white/90 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Action 2: Appointment Requests */}
        <button
          type="button"
          onClick={() => navigate("/receptionist/appointment-requests")}
          className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-[#0E2A6D] text-slate-800 hover:text-white border border-slate-100 hover:border-[#0E2A6D] transition-all duration-200 shadow-xs cursor-pointer active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center text-[#0E2A6D] group-hover:text-white transition-colors border border-slate-100 group-hover:border-transparent flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold">Appointment Requests</div>
              <div className="text-[10px] text-slate-400 group-hover:text-white/80 font-medium">Review web bookings</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white/90 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Action 3: Search Patient */}
        <button
          type="button"
          onClick={onSearchPatient}
          className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-[#0E2A6D] text-slate-800 hover:text-white border border-slate-100 hover:border-[#0E2A6D] transition-all duration-200 shadow-xs cursor-pointer active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center text-[#0E2A6D] group-hover:text-white transition-colors border border-slate-100 group-hover:border-transparent flex-shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold">Search Patient</div>
              <div className="text-[10px] text-slate-400 group-hover:text-white/80 font-medium">Lookup patient info</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white/90 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default CompactQuickActions;
