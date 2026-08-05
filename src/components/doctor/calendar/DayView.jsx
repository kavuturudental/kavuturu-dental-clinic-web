// src/components/calendar/DayView.jsx

import React from "react";
import { getLocalDateString } from "../../../utils/dateUtils";

export default function DayView({
  currentDate,
  appointments = [],
  onSelectApt
}) {
  const dateStr = getLocalDateString(currentDate);
  const formattedDate = currentDate.toLocaleDateString("default", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const dayApts = appointments.filter((a) => a.date === dateStr);

  const hours = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-900 border-amber-200";
      case "Confirmed":
        return "bg-blue-50 text-blue-900 border-blue-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-900 border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-900 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6 select-none">
      {/* Day View Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Daily Timeline - {formattedDate}
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            {dayApts.length} appointment{dayApts.length === 1 ? "" : "s"} scheduled for this date.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          {dayApts.length} Total
        </span>
      </div>

      {/* Hourly Timeline Grid */}
      <div className="divide-y divide-slate-100">
        {hours.map((hour) => {
          const matchingApts = dayApts.filter(
            (a) => a.time?.includes(hour.slice(0, 2)) || a.appointmentTime?.includes(hour.slice(0, 2))
          );

          return (
            <div key={hour} className="py-3 flex items-start gap-4 min-h-[64px]">
              {/* Hour Label */}
              <div className="w-24 font-mono text-xs text-slate-400 font-bold flex-shrink-0 pt-1">
                {hour}
              </div>

              {/* Slot Items */}
              <div className="flex-1 space-y-2">
                {matchingApts.length === 0 ? (
                  <div className="h-6 border-b border-dashed border-slate-100 text-[11px] text-slate-300 italic pt-1">
                    No bookings
                  </div>
                ) : (
                  matchingApts.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => onSelectApt(apt)}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer shadow-2xs ${getStatusBadgeClass(
                        apt.status
                      )}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold">{apt.time}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{apt.patientName}</h4>
                          <span className="text-[11px] font-normal text-slate-500">{apt.treatment}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200 inline-block">
                          {apt.status}
                        </span>
                        {apt.phoneNumber && (
                          <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{apt.phoneNumber}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
