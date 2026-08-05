// src/receptionist/components/appointments/AppointmentStats.jsx

import React from "react";
import { appointmentsData } from "../../../data/receptionist/appointmentsData";
import { Calendar, CheckCircle2, UserCheck, Stethoscope } from "lucide-react";

const AppointmentStats = () => {
  const totalScheduled = appointmentsData.length;
  const confirmedCount = appointmentsData.filter((apt) => apt.status === "Confirmed").length;
  const checkedInCount = appointmentsData.filter((apt) => apt.status === "Checked In").length;
  const inTreatmentCount = appointmentsData.filter((apt) => apt.status === "In Treatment").length;

  const stats = [
    {
      title: "Total Scheduled",
      count: totalScheduled,
      icon: Calendar,
      color: "text-[#0E2A6D] bg-[#0E2A6D]/5 border-[#0E2A6D]/15"
    },
    {
      title: "Confirmed",
      count: confirmedCount,
      icon: CheckCircle2,
      color: "text-sky-600 bg-sky-50 border-sky-200/80"
    },
    {
      title: "Checked In",
      count: checkedInCount,
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200/80"
    },
    {
      title: "In Treatment",
      count: inTreatmentCount,
      icon: Stethoscope,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200/80"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 select-none">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-[24px] p-5 sm:p-6 border border-slate-100 shadow-[0_12px_36px_rgba(0,0,0,0.02)] flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {stat.title}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
                {stat.count}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stat.color}`}>
              <Icon className="w-5.5 h-5.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentStats;
