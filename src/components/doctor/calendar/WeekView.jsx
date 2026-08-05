// src/components/calendar/WeekView.jsx

import React from "react";
import { getLocalDateString } from "../../../utils/dateUtils";

export default function WeekView({
  currentDate,
  appointments = [],
  onSelectApt
}) {
  // Compute start of week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const hours = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  const todayStr = getLocalDateString(new Date());

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
    <div className="bg-white rounded-[24px] border border-slate-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-x-auto select-none">
      <div className="min-w-[800px]">
        {/* Header Row: 7 Days */}
        <div className="grid grid-cols-8 border-b border-slate-100 pb-3 mb-2 text-center text-xs">
          <div className="font-semibold text-slate-400 py-1">Time</div>
          {weekDays.map((d, i) => {
            const dateStr = getLocalDateString(d);
            const isToday = dateStr === todayStr;
            return (
              <div
                key={i}
                className={`py-1 font-semibold flex flex-col items-center justify-center rounded-xl ${
                  isToday ? "bg-[#0E2A6D] text-white" : "text-slate-700"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {d.toLocaleDateString("default", { weekday: "short" })}
                </span>
                <span className="text-sm font-extrabold">{d.getDate()}</span>
              </div>
            );
          })}
        </div>

        {/* Hour Rows */}
        <div className="divide-y divide-slate-100">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 min-h-[54px] text-xs">
              {/* Time Column */}
              <div className="py-3 px-2 font-mono text-[11px] text-slate-400 font-semibold border-r border-slate-100 flex items-start">
                {hour}
              </div>

              {/* 7 Days Slot Cells */}
              {weekDays.map((d, dayIdx) => {
                const dateStr = getLocalDateString(d);
                const matchingApts = appointments.filter(
                  (a) => a.date === dateStr && (a.time?.includes(hour.slice(0, 2)) || a.appointmentTime?.includes(hour.slice(0, 2)))
                );

                return (
                  <div
                    key={dayIdx}
                    className="p-1 border-r border-slate-100/60 hover:bg-slate-50/50 transition-colors relative"
                  >
                    {matchingApts.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => onSelectApt(apt)}
                        className={`p-1.5 rounded-xl border text-[10px] font-semibold transition-all cursor-pointer shadow-2xs ${getStatusBadgeClass(
                          apt.status
                        )}`}
                      >
                        <div className="font-bold truncate">{apt.patientName}</div>
                        <div className="text-[9px] text-slate-500 font-normal truncate">{apt.treatment}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
