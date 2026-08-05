// src/receptionist/components/dashboard/LiveTimeCard.jsx

import React, { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";

const LiveTimeCard = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format 12-hour time with AM/PM (e.g. 11:42 AM)
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // Format full weekday and date (e.g. Wednesday, 29 July 2026)
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between select-none h-full min-h-[160px]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Time & Date
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E2A6D]/5 text-[#0E2A6D] border border-[#0E2A6D]/10">
          <Clock className="w-5 h-5 text-[#0E2A6D]" />
        </div>
      </div>

      {/* Live Time & Date Display */}
      <div className="space-y-1 mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#0E2A6D] tracking-tight flex items-baseline gap-2">
          <span>🕘</span>
          <span>{formatTime(now)}</span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-1.5 pt-0.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(now)}</span>
        </p>
      </div>
    </div>
  );
};

export default LiveTimeCard;
