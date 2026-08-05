// src/components/bookAppointment/DatePickerPopover.jsx

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateDisplay } from "../../../data/appointment/appointmentData";

export const DatePickerPopover = ({ selectedDate, onDateChange, error, id = "date" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Initialize view month based on selectedDate or current date
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const [y, m, d] = selectedDate.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  });

  // Close calendar popover on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Keep viewDate synchronized if selectedDate changes from outside
  useEffect(() => {
    if (selectedDate) {
      const [y, m, d] = selectedDate.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        setViewDate(new Date(y, m - 1, d));
      }
    }
  }, [selectedDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  // Calendar math
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleSelectDay = (day) => {
    const monthStr = String(viewMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const formattedDate = `${viewYear}-${monthStr}-${dayStr}`;

    onDateChange(formattedDate);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full text-left" ref={containerRef}>
      {/* Clean Input Field */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full rounded-xl border bg-white px-3.5 h-10 sm:h-10.5 text-xs sm:text-sm text-left font-normal transition-all flex items-center justify-between cursor-pointer outline-none ${
          error
            ? "border-rose-400 text-slate-900"
            : isOpen
            ? "border-[#0E2A6D] ring-1 ring-[#0E2A6D] text-slate-900"
            : "border-slate-200 hover:border-slate-300 text-slate-900"
        }`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={selectedDate ? "text-slate-900 font-medium" : "text-slate-400 font-normal"}>
          {selectedDate ? formatDateDisplay(selectedDate) : "Select date"}
        </span>
        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Apple-Style Calendar Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 sm:left-0 sm:right-auto top-full mt-2 z-50 w-full sm:w-[300px] rounded-2xl bg-white p-3.5 shadow-xl border border-slate-200"
          >
            {/* Header: Month & Year + Controls */}
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {monthNames[viewMonth]} {viewYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1 text-center text-[10px] font-semibold text-slate-400 uppercase">
              {weekDays.map((d) => (
                <div key={d} className="py-0.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="h-7" />
              ))}

              {/* Days in month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const cellDate = new Date(viewYear, viewMonth, day);
                cellDate.setHours(0, 0, 0, 0);

                const isPast = cellDate < today;

                const monthStr = String(viewMonth + 1).padStart(2, "0");
                const dayStr = String(day).padStart(2, "0");
                const formattedCellDate = `${viewYear}-${monthStr}-${dayStr}`;

                const isSelected = selectedDate === formattedCellDate;
                const isTodayCell = cellDate.getTime() === today.getTime();

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleSelectDay(day)}
                    className={`h-7 w-full rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isPast
                        ? "text-slate-300 cursor-not-allowed"
                        : isSelected
                        ? "bg-[#0E2A6D] text-white font-bold"
                        : isTodayCell
                        ? "bg-slate-100 text-[#0E2A6D] font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePickerPopover;
