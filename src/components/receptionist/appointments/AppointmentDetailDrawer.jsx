// src/receptionist/components/appointments/AppointmentDetailDrawer.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  Stethoscope,
  Calendar,
  Clock,
  Globe,
  History,
  FileText,
  UserCheck,
  Pencil,
  CalendarClock,
  XCircle,
  PhoneCall
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatShortDate } from "../../../utils/receptionist/helpers";
import toast from "react-hot-toast";

export const AppointmentDetailDrawer = ({
  isOpen,
  onClose,
  appointment,
  onCheckIn,
  onEdit,
  onReschedule,
  onCancel
}) => {
  if (!isOpen || !appointment) return null;

  const handleCallPatient = () => {
    toast.success(`Initiating call to ${appointment.phoneNumber}...`);
    window.location.href = `tel:${appointment.phoneNumber.replace(/\s+/g, "")}`;
  };

  const isToday =
    appointment.dateGroup === "Today" ||
    appointment.date === new Date().toISOString().split("T")[0];

  const canCheckIn =
    isToday &&
    appointment.status !== "Checked In" &&
    appointment.status !== "Completed" &&
    appointment.status !== "Cancelled" &&
    appointment.status !== "In Treatment";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end select-none">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Right-Side Sliding Drawer */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          className="relative w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl z-50 flex flex-col justify-between overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
                Appointment Summary
              </span>
              <h2 className="text-lg font-extrabold text-slate-850 tracking-tight">
                Patient Details
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none border border-slate-200/60"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Header Patient Card Highlight */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-sky-50/30 border border-slate-100 flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#0E2A6D]/10 border border-[#0E2A6D]/15 flex items-center justify-center text-[#0E2A6D] text-lg font-extrabold flex-shrink-0">
                {appointment.patientName
                  ? appointment.patientName.charAt(0).toUpperCase()
                  : "P"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-extrabold text-slate-850 truncate">
                    {appointment.patientName}
                  </h3>
                  <StatusBadge status={appointment.status} />
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{appointment.phoneNumber}</span>
                </p>
              </div>
            </div>

            {/* Patient Information Section */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                Appointment Info
              </h4>
              <div className="grid grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> Full Name
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {appointment.patientName}
                  </span>
                </div>

                {/* Phone Number */}
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Phone Number
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {appointment.phoneNumber}
                  </span>
                </div>

                {/* Treatment */}
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-slate-400" /> Treatment
                  </span>
                  <span className="text-xs font-bold text-[#0E2A6D]">
                    {appointment.treatment}
                  </span>
                </div>

                {/* Source */}
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" /> Source
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {appointment.source || "Website"}
                  </span>
                </div>

                {/* Appointment Date */}
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Date
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {formatShortDate(appointment.date)}
                  </span>
                </div>

                {/* Appointment Time */}
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Time Slot
                  </span>
                  <span className="text-xs font-bold text-sky-700">
                    {appointment.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Previous Visits */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-slate-400" /> Previous Visits
              </span>
              <p className="text-xs font-bold text-slate-800">
                {appointment.previousVisits || "3 past visits (Last: 14 May 2026)"}
              </p>
            </div>

            {/* Internal Notes */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Internal Notes
              </span>
              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                {appointment.notes ||
                  "Patient requested Dr. K. Ravindra Babu for laser precision. Reported mild sensitivity in upper molar."}
              </p>
            </div>

            {/* Quick Actions Header */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                Quick Actions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* ✓ Check In */}
                {canCheckIn && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onCheckIn) onCheckIn(appointment);
                    }}
                    className="h-11 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/90 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <UserCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>✓ Check In</span>
                  </button>
                )}

                {/* ✏ Edit Appointment */}
                <button
                  type="button"
                  onClick={() => {
                    if (onEdit) onEdit(appointment);
                  }}
                  className="h-11 px-4 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <Pencil className="w-4 h-4" />
                  <span>✏ Edit Appointment</span>
                </button>

                {/* 📅 Reschedule */}
                <button
                  type="button"
                  onClick={() => {
                    if (onReschedule) onReschedule(appointment);
                  }}
                  className="h-11 px-4 rounded-xl bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border border-amber-200/90 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <CalendarClock className="w-4 h-4" />
                  <span>📅 Reschedule</span>
                </button>

                {/* ❌ Cancel Appointment */}
                <button
                  type="button"
                  onClick={() => {
                    if (onCancel) onCancel(appointment);
                  }}
                  className="h-11 px-4 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200/90 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <XCircle className="w-4 h-4" />
                  <span>❌ Cancel</span>
                </button>

                {/* 📞 Call Patient */}
                <button
                  type="button"
                  onClick={handleCallPatient}
                  className="h-11 px-4 rounded-xl bg-[#0E2A6D] hover:bg-[#16398b] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-900/15 cursor-pointer active:scale-98 col-span-1 sm:col-span-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>📞 Call Patient</span>
                </button>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-10 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer outline-none"
            >
              Close Panel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AppointmentDetailDrawer;
