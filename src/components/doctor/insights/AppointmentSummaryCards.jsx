// src/components/doctor/insights/AppointmentSummaryCards.jsx

import React from "react";
import { Calendar, CheckCircle2, XCircle, Clock, Percent } from "lucide-react";

export default function AppointmentSummaryCards({ appointmentInsights = {} }) {
  const {
    totalAppointments = 0,
    completed = 0,
    cancelled = 0,
    pending = 0,
    completionRate = 0
  } = appointmentInsights;

  const cards = [
    {
      title: "Total Appointments",
      count: totalAppointments,
      icon: Calendar,
      iconColor: "text-slate-700 bg-slate-100"
    },
    {
      title: "Completed",
      count: completed,
      icon: CheckCircle2,
      iconColor: "text-emerald-700 bg-emerald-50"
    },
    {
      title: "Cancelled",
      count: cancelled,
      icon: XCircle,
      iconColor: "text-rose-700 bg-rose-50"
    },
    {
      title: "Pending",
      count: pending,
      icon: Clock,
      iconColor: "text-amber-700 bg-amber-50"
    },
    {
      title: "Completion Rate",
      count: `${completionRate}%`,
      icon: Percent,
      iconColor: "text-blue-700 bg-blue-50"
    }
  ];

  return (
    <div className="space-y-3 select-none">
      <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase">
        Appointment Insights
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-[24px] border border-slate-100 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-200/90 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-tight">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                  {card.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
