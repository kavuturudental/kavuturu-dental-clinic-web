// src/receptionist/components/appointments/QuickActionButtons.jsx

import React from "react";
import { Plus, Trash2 } from "lucide-react";

const QuickActionButtons = ({ onNew, onCancel }) => {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Hero "+ New Appointment" Button */}
      <button
        type="button"
        onClick={onNew}
        className="h-11 px-4 sm:px-5 rounded-2xl bg-[#0E2A6D] hover:bg-[#16398b] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-900/12 hover:shadow-lg hover:shadow-blue-900/20 active:scale-98 transition-all duration-200 cursor-pointer outline-none"
      >
        <span className="w-5 h-5 rounded-lg bg-white/15 flex items-center justify-center">
          <Plus className="w-3.5 h-3.5 text-white stroke-[3]" />
        </span>
        <span>New Appointment</span>
      </button>

      {/* Secondary Actions */}
      <button
        type="button"
        onClick={onCancel}
        className="h-11 px-3.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-98 outline-none shadow-2xs"
        title="Cancel Appointment"
      >
        <Trash2 className="w-4 h-4 text-rose-500" />
        <span className="hidden sm:inline">Cancel</span>
      </button>
    </div>
  );
};

export default QuickActionButtons;
