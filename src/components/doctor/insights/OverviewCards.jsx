// src/components/insights/OverviewCards.jsx

import React from "react";
import { TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function OverviewCards({ metrics = {} }) {
  const cards = [
    {
      title: "Total Volume",
      value: metrics.totalAppointments || 0,
      subtext: `${metrics.avgPerDay || 0} avg per day`,
      icon: TrendingUp,
      color: "text-[#0E2A6D] bg-[#0E2A6D]/10"
    },
    {
      title: "Completion Rate",
      value: `${metrics.completionRate || 0}%`,
      subtext: `${metrics.completed || 0} completed`,
      icon: CheckCircle2,
      color: "text-emerald-700 bg-emerald-50"
    },
    {
      title: "Confirmation Rate",
      value: `${metrics.confirmationRate || 0}%`,
      subtext: `${metrics.confirmed || 0} confirmed`,
      icon: Clock,
      color: "text-blue-700 bg-blue-50"
    },
    {
      title: "Cancellation Rate",
      value: `${metrics.cancellationRate || 0}%`,
      subtext: `${metrics.cancelled || 0} cancelled`,
      icon: XCircle,
      color: "text-rose-700 bg-rose-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 w-full select-none">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-[24px] border border-slate-100 p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-200 hover:border-slate-200/90"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 tracking-tight">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 sm:mt-4">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 font-sans">
                {card.value}
              </span>
              <span className="text-[11px] font-normal text-slate-400 block mt-0.5">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
