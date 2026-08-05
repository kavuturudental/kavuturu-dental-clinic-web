// src/components/common/DashboardSummaryCards.jsx

import React from "react";
import { Calendar, Clock, UserCheck, CheckCircle2 } from "lucide-react";
import useDashboardSummary from "../../hooks/useDashboardSummary";
import useAppointmentRequests from "../../hooks/useAppointmentRequests";

export default function DashboardSummaryCards({ summaryData }) {
  const { summary: hookSummary, loading } = useDashboardSummary();
  const { requests } = useAppointmentRequests();
  const summary = summaryData || hookSummary || {};

  // 1. Today's Appointments
  const todaysAppointmentsCount = summary.todaysAppointments ?? summary.todaysSchedule ?? 0;

  // 2. Pending Requests: Always prioritize live requests context if available
  const liveRequestsCount = Array.isArray(requests)
    ? requests.filter((r) => (r.status || "").toLowerCase() === "pending").length
    : undefined;

  const pendingRequestsCount = liveRequestsCount !== undefined
    ? liveRequestsCount
    : (summary.pendingRequests ?? summary.pendingApprovals ?? 0);

  // 3. Next Appointment
  const nextAppointment = summary.nextAppointment ?? null;

  // 4. Remaining Today
  const remainingTodayCount = summary.remainingToday ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 w-full">
      {/* 1. Today's Appointments - Primary #2563EB */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 shadow-2xs flex flex-col justify-between transition-all duration-200 hover:border-slate-300 select-none">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 tracking-tight">
            Today's Appointments
          </span>
          <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE]/60 flex-shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            {loading && !summaryData ? "..." : todaysAppointmentsCount}
          </span>
        </div>
      </div>

      {/* 2. Pending Requests - Warning #F59E0B */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 shadow-2xs flex flex-col justify-between transition-all duration-200 hover:border-slate-300 select-none">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 tracking-tight">
            Pending Requests
          </span>
          <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-[#F59E0B] bg-[#FEF3C7] border border-[#FDE68A]/70 flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            {loading && !summaryData ? "..." : pendingRequestsCount}
          </span>
        </div>
      </div>

      {/* 3. Next Appointment - Primary Accent */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 shadow-2xs flex flex-col justify-between transition-all duration-200 hover:border-slate-300 select-none">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 tracking-tight">
            Next Appointment
          </span>
          <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE]/60 flex-shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 min-h-[32px] flex flex-col justify-center">
          {loading && !summaryData ? (
            <span className="text-xl font-bold text-slate-400">...</span>
          ) : nextAppointment ? (
            <div className="space-y-0.5">
              <h4 className="text-xs font-extrabold text-slate-900 truncate">
                {nextAppointment.patientName || nextAppointment.name}
              </h4>
              <p className="text-[11px] font-bold text-[#2563EB] font-mono">
                {nextAppointment.time || nextAppointment.appointmentTime}
              </p>
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-400 leading-snug">
              No More Appointments Today
            </span>
          )}
        </div>
      </div>

      {/* 4. Remaining Today - Success #16A34A */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 shadow-2xs flex flex-col justify-between transition-all duration-200 hover:border-slate-300 select-none">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 tracking-tight">
            Remaining Today
          </span>
          <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between gap-2">
          <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            {loading && !summaryData ? "..." : remainingTodayCount}
          </span>
          {remainingTodayCount === 0 && !loading && (
            <span className="text-[10px] font-extrabold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
              All Done Today
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
