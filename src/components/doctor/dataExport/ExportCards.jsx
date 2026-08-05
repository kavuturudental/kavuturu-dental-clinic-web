// src/components/dataExport/ExportCards.jsx

import React from "react";
import { Database, Filter, Clock, FileSpreadsheet } from "lucide-react";

export default function ExportCards({ totalCount, filteredCount, lastExportTime }) {
  const cards = [
    {
      title: "Total Appointments",
      value: totalCount,
      icon: Database,
      color: "text-slate-700 bg-slate-100/80"
    },
    {
      title: "Filtered Results",
      value: filteredCount,
      icon: Filter,
      color: "text-amber-700 bg-amber-50"
    },
    {
      title: "Last Export",
      value: lastExportTime || "Never",
      isText: true,
      icon: Clock,
      color: "text-emerald-700 bg-emerald-50"
    },
    {
      title: "Available Formats",
      value: "CSV, Excel, PDF",
      isText: true,
      icon: FileSpreadsheet,
      color: "text-[#0E2A6D] bg-[#0E2A6D]/10"
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
              <span className={`tracking-tight font-semibold text-slate-900 font-sans ${card.isText ? "text-sm sm:text-base" : "text-2xl sm:text-3xl lg:text-4xl"}`}>
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
