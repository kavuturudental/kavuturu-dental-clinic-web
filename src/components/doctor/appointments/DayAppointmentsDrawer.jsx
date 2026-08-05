import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, Phone, Stethoscope, Plus } from "lucide-react";

export default function DayAppointmentsDrawer({ dateStr, appointments, isOpen, onClose, onSelectAppointment, onStatusChange, onBookForDate }) {
  if (!isOpen) return null;

  const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Drawer Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white border-l border-slate-100 shadow-2xl flex flex-col select-none"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0E2A6D]">
                  <Calendar className="w-4 h-4" />
                  <span>Daily Schedule</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-800 mt-1">{formattedDate}</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{appointments.length} Appointments Scheduled</p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-colors cursor-pointer border border-slate-100 outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Day View Schedule</span>
              <button
                onClick={() => onBookForDate && onBookForDate(dateStr)}
                className="h-8 px-3 rounded-lg text-xs font-bold text-white bg-[#0E2A6D] hover:bg-[#16398b] active:scale-98 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Slot</span>
              </button>
            </div>

            {/* Appointments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {appointments.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-50 mx-auto flex items-center justify-center text-slate-300 border border-slate-100">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold">No appointments scheduled for this date.</p>
                </div>
              ) : (
                appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs hover:border-slate-200 transition-all space-y-3 cursor-pointer"
                    onClick={() => onSelectAppointment && onSelectAppointment(apt)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-[#0E2A6D]" />
                        <span>{apt.time}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${getStatusBadge(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-sm">{apt.patientName}</h4>
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{apt.treatment}</span>
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span>{apt.phoneNumber}</span>
                      </p>
                    </div>

                    {/* Action buttons inside drawer item */}
                    <div 
                      className="pt-2 border-t border-slate-50 flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {apt.status !== "Completed" && (
                        <button
                          onClick={() => onStatusChange && onStatusChange(apt.id, "Completed")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold transition-all"
                        >
                          Complete
                        </button>
                      )}
                      {apt.status !== "Cancelled" && (
                        <button
                          onClick={() => onStatusChange && onStatusChange(apt.id, "Cancelled")}
                          className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
