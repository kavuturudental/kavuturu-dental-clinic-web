// src/pages/doctor/AppointmentManagement/FollowUps.jsx

import React, { useState } from "react";
import { Clock, Calendar, CheckCircle2, User, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function FollowUps() {
  const [followUps, setFollowUps] = useState([]);

  const handleMarkComplete = (id) => {
    setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, status: "Completed" } : f)));
    toast.success("Follow-up marked as completed!");
  };

  return (
    <div className="space-y-6 select-none font-sans w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Patient Follow-ups
          </h1>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Track scheduled follow-up visits and post-treatment reviews.
          </p>
        </div>
      </div>

      {followUps.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-slate-100 p-12 text-center text-slate-400 text-xs font-medium shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          No scheduled follow-up reviews found in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followUps.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{item.patientName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{item.phone}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    item.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-1 bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
                <p className="font-semibold text-slate-900">{item.treatment}</p>
                <p className="text-slate-500 font-normal">{item.notes}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.scheduledDate}</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400 ml-1" />
                  <span>{item.scheduledTime}</span>
                </div>

                {item.status !== "Completed" && (
                  <button
                    onClick={() => handleMarkComplete(item.id)}
                    className="text-xs font-semibold text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
