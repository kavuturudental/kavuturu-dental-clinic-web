// src/components/doctor/insights/DoctorInsightCards.jsx

import React from "react";
import { Users, Calendar, CheckCircle2, Award, UserPlus, UserCheck, TrendingUp, TrendingDown } from "lucide-react";

export default function DoctorInsightCards({ metrics = {} }) {
  const {
    totalPatients = 0,
    totalPatientsMonthIncrease = 0,
    totalPatientsTrend = 0,
    
    totalAppointments = 0,
    totalAppointmentsMonthIncrease = 0,
    totalAppointmentsTrend = 0,

    completedTreatments = 0,
    completionRate = 0,

    popularTreatmentName = "N/A",
    popularTreatmentCount = 0,
    popularTreatmentPercent = 0,

    newPatients = 0,
    newPatientsMonthIncrease = 0,

    returningPatients = 0,
    retentionRate = 0
  } = metrics;

  const isPatientTrendPositive = totalPatientsTrend >= 0;
  const isAptTrendPositive = totalAppointmentsTrend >= 0;

  const cards = [
    // 1. Total Patients
    {
      title: "Total Patients",
      count: totalPatients,
      badge: `${isPatientTrendPositive ? "+" : ""}${totalPatientsTrend}%`,
      badgeColor: isPatientTrendPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50",
      description: `This Month: +${totalPatientsMonthIncrease} patients`,
      icon: Users,
      iconColor: "text-purple-700 bg-purple-50"
    },
    // 2. Total Appointments
    {
      title: "Total Appointments",
      count: totalAppointments,
      badge: `${isAptTrendPositive ? "+" : ""}${totalAppointmentsTrend}%`,
      badgeColor: isAptTrendPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50",
      description: `This Month: +${totalAppointmentsMonthIncrease} bookings`,
      icon: Calendar,
      iconColor: "text-[#0E2A6D] bg-blue-50"
    },
    // 3. Completed Treatments
    {
      title: "Completed Treatments",
      count: completedTreatments,
      badge: `${completionRate}% Rate`,
      badgeColor: "text-emerald-700 bg-emerald-50",
      description: `Completion Rate: ${completionRate}% of total`,
      icon: CheckCircle2,
      iconColor: "text-emerald-700 bg-emerald-50"
    },
    // 4. Popular Treatment
    {
      title: "Popular Treatment",
      isPopularCard: true,
      treatmentName: (popularTreatmentName && popularTreatmentName !== "N/A") ? popularTreatmentName : "--",
      patientCount: popularTreatmentCount,
      percent: popularTreatmentPercent,
      hasData: Boolean(popularTreatmentName && popularTreatmentName !== "N/A"),
      icon: Award,
      iconColor: "text-indigo-700 bg-indigo-50"
    },
    // 5. New Patients
    {
      title: "New Patients",
      count: newPatients,
      badge: `+${newPatientsMonthIncrease}`,
      badgeColor: "text-sky-700 bg-sky-50",
      description: `First appointment visits`,
      icon: UserPlus,
      iconColor: "text-sky-700 bg-sky-50"
    },
    // 6. Returning Patients
    {
      title: "Returning Patients",
      count: returningPatients,
      badge: `${retentionRate}% Rate`,
      badgeColor: "text-teal-700 bg-teal-50",
      description: `Retention Rate: ${retentionRate}%`,
      icon: UserCheck,
      iconColor: "text-teal-700 bg-teal-50"
    }
  ];

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase">
          Key Performance Insights
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-[24px] border border-slate-100 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-200/90 transition-all min-w-0 min-h-[140px]"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold text-slate-500 tracking-tight truncate">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconColor}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              {card.isPopularCard ? (
                <div className="mt-2 flex flex-col justify-between flex-1">
                  <span
                    className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 font-sans leading-snug line-clamp-2 break-words min-h-[2.5rem] flex items-center"
                    title={card.treatmentName}
                  >
                    {card.treatmentName}
                  </span>
                  <div className="mt-1">
                    {card.hasData ? (
                      <>
                        <span className="text-xs font-bold text-slate-800 block">
                          {card.patientCount} Patients
                        </span>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal mt-0.5 leading-tight">
                          {card.percent}% of Total
                        </p>
                      </>
                    ) : (
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal leading-tight">
                        No Data
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                      {card.count}
                    </span>
                    {card.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal mt-1 leading-tight truncate">
                    {card.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
