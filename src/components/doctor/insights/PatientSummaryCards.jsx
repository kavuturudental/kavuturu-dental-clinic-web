// src/components/doctor/insights/PatientSummaryCards.jsx

import React from "react";
import { UserPlus, UserCheck, Users, TrendingUp, TrendingDown } from "lucide-react";

export default function PatientSummaryCards({ patientInsights = {} }) {
  const { newPatients = 0, returningPatients = 0, totalPatients = 0, patientGrowth = 0 } = patientInsights;

  const isPositiveGrowth = patientGrowth >= 0;

  const cards = [
    {
      title: "New Patients",
      count: newPatients,
      description: "First-time clinic visitors in selected period",
      icon: UserPlus,
      iconColor: "text-blue-700 bg-blue-50"
    },
    {
      title: "Returning Patients",
      count: returningPatients,
      description: "Patients with >1 confirmed/completed visits",
      icon: UserCheck,
      iconColor: "text-emerald-700 bg-emerald-50"
    },
    {
      title: "Total Patients",
      count: totalPatients,
      description: "Total patient records in clinic database",
      icon: Users,
      iconColor: "text-purple-700 bg-purple-50"
    },
    {
      title: "Patient Growth",
      count: `${patientGrowth > 0 ? "+" : ""}${patientGrowth}%`,
      description: "Growth vs previous comparison period",
      icon: isPositiveGrowth ? TrendingUp : TrendingDown,
      iconColor: isPositiveGrowth ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
    }
  ];

  return (
    <div className="space-y-3 select-none">
      <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase">
        Patient Insights
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-200/90 transition-all"
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
                <p className="text-[11px] text-slate-400 font-normal mt-1 leading-tight">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
