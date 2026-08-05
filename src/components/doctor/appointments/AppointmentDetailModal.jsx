import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, Phone, Mail, Stethoscope, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function AppointmentDetailModal({ appointment, onClose, onStatusChange, onEdit }) {
  if (!appointment) return null;

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[28px] border border-slate-100 shadow-2xl p-6 md:p-8 select-none z-10 space-y-6"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer outline-none"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header info */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#0E2A6D]/10 text-[#0E2A6D] font-extrabold flex items-center justify-center text-lg flex-shrink-0">
              {appointment.patientName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{appointment.patientName}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getStatusBadge(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Appointment ID: <span className="text-slate-700 font-bold">{appointment.id}</span></p>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Treatment Procedure</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Stethoscope className="w-3.5 h-3.5 text-[#0E2A6D]" />
                <span>{appointment.treatment}</span>
              </div>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Assigned Doctor</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <User className="w-3.5 h-3.5 text-[#0E2A6D]" />
                <span>{appointment.doctor}</span>
              </div>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date & Time</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{appointment.date} @ {appointment.time}</span>
              </div>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Booking Source</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="px-2 py-0.5 rounded-md bg-blue-100/60 text-blue-800 text-[10px]">{appointment.source}</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-xs font-semibold text-slate-600 bg-slate-50/40 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
              </span>
              <span className="text-slate-800 font-bold">{appointment.phoneNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
              </span>
              <span className="text-slate-800 font-bold">{appointment.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-400">
                <User className="w-3.5 h-3.5 text-slate-400" /> Demographics:
              </span>
              <span className="text-slate-800 font-bold">{appointment.age} yrs • {appointment.gender}</span>
            </div>
          </div>

          {/* Clinical Notes */}
          {appointment.notes && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" /> Notes
              </span>
              <p className="text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                {appointment.notes}
              </p>
            </div>
          )}

          {/* Quick Action Controls */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Update Status</span>
            <div className="flex items-center gap-2 flex-wrap">
              {appointment.status !== "In Progress" && appointment.status !== "Completed" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(appointment.id, "In Progress")}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold transition-all cursor-pointer"
                >
                  🟢 Check In
                </button>
              )}
              {appointment.status !== "Completed" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(appointment.id, "Completed")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all cursor-pointer"
                >
                  ✅ Mark Completed
                </button>
              )}
              {appointment.status !== "Cancelled" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(appointment.id, "Cancelled")}
                  className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer"
                >
                  🚫 Cancel Appointment
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => { onClose(); onEdit(appointment); }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer ml-auto"
                >
                  ✏️ Edit
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
