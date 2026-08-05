// src/receptionist/components/dashboard/NextAppointmentCard.jsx

import React from "react";
import { User, Stethoscope, Clock, Timer, ArrowRight, CheckCircle2 } from "lucide-react";

export const NextAppointmentCard = ({ appointment, onViewDetails }) => {
  // Default fallback data if no appointment passed
  const nextApt = appointment || {
    id: "apt-5",
    patientName: "K. Venkatesh",
    treatment: "Laser Gum Treatment",
    time: "11:00 AM",
    phoneNumber: "+91 99890 54321",
    status: "Confirmed",
    countdown: "Starts in 18 minutes"
  };

  return (
    <div className="bg-gradient-to-br from-white via-white to-sky-50/50 rounded-[24px] p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.03)] border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none relative overflow-hidden">
      {/* Background Accent Decorative Radial Glow */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#0E2A6D]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Main Info Section */}
      <div className="space-y-3 z-10 flex-1">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E2A6D] bg-[#0E2A6D]/10 border border-[#0E2A6D]/15 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-[#0E2A6D] animate-pulse" />
            <span>Next Appointment</span>
          </span>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{nextApt.countdown || "Starts in 18 minutes"}</span>
          </span>
        </div>

        {/* Details Grid */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1">
          {/* Patient Name */}
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-sky-100/70 border border-sky-200/80 flex items-center justify-center text-[#0E2A6D]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Name</span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-850 tracking-tight leading-tight">
                {nextApt.patientName}
              </h3>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-[1px] bg-slate-200/80" />

          {/* Treatment */}
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-center text-slate-600">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Treatment</span>
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {nextApt.treatment}
              </p>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-[1px] bg-slate-200/80" />

          {/* Time */}
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-center text-slate-600">
              <Clock className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Appointment Time</span>
              <p className="text-sm font-extrabold text-[#0E2A6D] leading-tight">
                {nextApt.time}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="z-10 pt-2 sm:pt-0">
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(nextApt)}
          className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#0E2A6D] hover:bg-[#16398b] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-900/10 cursor-pointer active:scale-98"
        >
          <span>View Patient Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NextAppointmentCard;
