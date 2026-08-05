import React from "react";
import { Clock } from "lucide-react";

export default function WorkingHoursCard({ workingHours, onChange }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayChange = (day, field, value) => {
    const updatedDay = { ...workingHours[day], [field]: value };
    onChange("workingHours", { ...workingHours, [day]: updatedDay });
  };

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#0E2A6D] tracking-tight">
          Working Hours
        </h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Configure clinic opening and closing schedules using a compact table.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left border-collapse min-w-[480px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold text-[10px] tracking-wider uppercase">
              <th className="py-3 px-4">Day</th>
              <th className="py-3 px-4">Opening Time</th>
              <th className="py-3 px-4">Closing Time</th>
              <th className="py-3 px-4 text-center w-32">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
            {days.map((day) => {
              const config = workingHours[day] || { openTime: "09:00", closeTime: "18:00", isClosed: false };
              return (
                <tr 
                  key={day} 
                  className={`transition-colors duration-200 ${
                    config.isClosed ? "bg-slate-50/50 opacity-65" : "hover:bg-slate-50/30"
                  }`}
                >
                  {/* Day */}
                  <td className="py-3.5 px-4 font-bold text-slate-800">{day}</td>

                  {/* Opening */}
                  <td className="py-3.5 px-4">
                    <div className="relative inline-block">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="time"
                        disabled={config.isClosed}
                        value={config.openTime}
                        onChange={(e) => handleDayChange(day, "openTime", e.target.value)}
                        className="h-9 w-28 rounded-lg border border-slate-200 pl-8 pr-2 text-xs font-bold text-slate-700 outline-none focus:border-[#0E2A6D] focus:ring-2 focus:ring-[#0E2A6D]/5 disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                  </td>

                  {/* Closing */}
                  <td className="py-3.5 px-4">
                    <div className="relative inline-block">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="time"
                        disabled={config.isClosed}
                        value={config.closeTime}
                        onChange={(e) => handleDayChange(day, "closeTime", e.target.value)}
                        className="h-9 w-28 rounded-lg border border-slate-200 pl-8 pr-2 text-xs font-bold text-slate-700 outline-none focus:border-[#0E2A6D] focus:ring-2 focus:ring-[#0E2A6D]/5 disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                  </td>

                  {/* Status Closed Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.isClosed}
                        onChange={(e) => handleDayChange(day, "isClosed", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="relative w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-red-500"></div>
                      <span className={`text-[10px] font-extrabold tracking-wider uppercase w-12 ${config.isClosed ? "text-red-500" : "text-emerald-500"}`}>
                        {config.isClosed ? "Closed" : "Open"}
                      </span>
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
