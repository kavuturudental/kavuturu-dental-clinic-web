// src/components/calendar/MonthView.jsx

import React from "react";
import { getLocalDateString } from "../../../utils/dateUtils";

export default function MonthView({
  currentDate,
  appointments = [],
  selectedDateStr,
  onSelectDate,
  onSelectApt
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = getLocalDateString(new Date());

  // Helper to format YYYY-MM-DD
  const formatDateStr = (y, m, d) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  // Build grid days array
  const gridCells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateStr = formatDateStr(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, dayNum);
    gridCells.push({ dayNum, dateStr, currentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateStr(year, month, d);
    gridCells.push({ dayNum: d, dateStr, currentMonth: true });
  }

  // Next month leading days
  const remainingCells = (7 - (gridCells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const dateStr = formatDateStr(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, d);
    gridCells.push({ dayNum: d, dateStr, currentMonth: false });
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100/90 text-amber-900 border-amber-200";
      case "Confirmed":
        return "bg-blue-100/90 text-blue-900 border-blue-200";
      case "Completed":
        return "bg-emerald-100/90 text-emerald-900 border-emerald-200";
      case "Cancelled":
        return "bg-rose-100/90 text-rose-900 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden select-none">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-slate-100 pb-3 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {weekdays.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Cells */}
      <div className="grid grid-cols-7 gap-1">
        {gridCells.map((cell, idx) => {
          const dayApts = appointments.filter((a) => a.date === cell.dateStr);
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDateStr;

          return (
            <div
              key={idx}
              onClick={() => onSelectDate(cell.dateStr)}
              className={`min-h-[110px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                !cell.currentMonth
                  ? "bg-slate-50/40 border-slate-100 text-slate-400 opacity-60"
                  : isSelected
                  ? "bg-[#0E2A6D]/5 border-[#0E2A6D] shadow-2xs"
                  : isToday
                  ? "bg-blue-50/40 border-blue-200"
                  : "bg-white border-slate-100/80 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? "bg-[#0E2A6D] text-white"
                      : isSelected
                      ? "bg-slate-900 text-white"
                      : cell.currentMonth
                      ? "text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {cell.dayNum}
                </span>

                {dayApts.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {dayApts.length}
                  </span>
                )}
              </div>

              {/* Appointments List Pill Preview */}
              <div className="mt-1 space-y-1 overflow-y-auto max-h-[65px] custom-scrollbar">
                {dayApts.slice(0, 2).map((apt) => (
                  <div
                    key={apt.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectApt(apt);
                    }}
                    className={`px-2 py-1 rounded-xl text-[10px] font-semibold border truncate transition-transform hover:scale-[1.02] ${getStatusBadgeClass(
                      apt.status
                    )}`}
                    title={`${apt.time} - ${apt.patientName}`}
                  >
                    <span className="font-mono mr-1">{apt.time}</span>
                    <span>{apt.patientName}</span>
                  </div>
                ))}
                {dayApts.length > 2 && (
                  <div className="text-[9px] font-bold text-slate-500 text-center">
                    +{dayApts.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
