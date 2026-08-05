// src/components/receptionist/common/EmptyState.jsx

import React from "react";
import { CalendarDays, Sparkles } from "lucide-react";

const EmptyState = ({
  title = "No appointments scheduled today.",
  description = "Your daily clinic schedule is clear. You can schedule a new patient appointment manually or review upcoming requests.",
  onNew,
  actionLabel = "+ New Appointment",
  icon: CustomIcon
}) => {
  const IconComponent = CustomIcon || CalendarDays;

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 sm:py-12 px-6 sm:px-12 rounded-[22px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] select-none">
      {/* Premium Healthcare Vector Illustration Emblem - Moved Slightly Upward */}
      <div className="relative -mt-2 mb-4 flex items-center justify-center">
        {/* Soft Background Radial Glow */}
        <div className="absolute w-20 h-20 rounded-full bg-[#0E2A6D]/5 blur-xl pointer-events-none" />

        {/* Outer Ring Accent Container */}
        <div className="relative h-18 w-18 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-slate-50 border border-sky-100 flex items-center justify-center shadow-xs">
          {/* Inner Emblem Icon Box */}
          <div className="h-11 w-11 rounded-xl bg-[#0E2A6D]/10 border border-[#0E2A6D]/15 flex items-center justify-center text-[#0E2A6D]">
            <IconComponent className="w-5.5 h-5.5 stroke-[1.8]" />
          </div>

          {/* Decorative Sparkle Badge */}
          <span className="absolute -top-1 -right-1 h-4.5 w-4.5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Heading with Increased Spacing */}
      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-1 mb-2">
        {title}
      </h3>

      {/* Supporting Text with Increased Spacing */}
      <p className="text-xs sm:text-[13px] text-slate-400 font-medium max-w-sm leading-relaxed mb-5">
        {description}
      </p>

      {/* Primary Action Button (+ New Appointment) */}
      {onNew && (
        <button
          type="button"
          onClick={onNew}
          className="h-10 px-5 rounded-xl bg-[#0E2A6D] hover:bg-[#16398b] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
