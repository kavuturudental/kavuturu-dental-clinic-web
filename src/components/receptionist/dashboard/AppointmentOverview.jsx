import React from "react";
import { appointmentsData } from "../../../data/receptionist/appointmentsData";
import { Clock, User, ArrowRight } from "lucide-react";
import StatusBadge from "../appointments/StatusBadge";

const AppointmentOverview = () => {
  // Get first 3 appointments of Today
  const todayApts = appointmentsData
    .filter((apt) => apt.dateGroup === "Today")
    .slice(0, 3);

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.02)] space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
          Next Appointments
        </h3>
        <a
          href="/receptionist/appointments"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-3">
        {todayApts.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium">No appointments scheduled for today.</p>
        ) : (
          todayApts.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200/60 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{apt.patientName}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{apt.treatment}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">{apt.time}</span>
                <StatusBadge status={apt.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentOverview;
