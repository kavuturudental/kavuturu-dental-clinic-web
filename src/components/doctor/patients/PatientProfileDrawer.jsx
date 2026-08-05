// src/components/doctor/patients/PatientProfileDrawer.jsx

import React from "react";
import { X, User, Phone, Mail, Calendar, Clock, Stethoscope, FileText, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PatientProfileDrawer({ patient, isOpen, onClose }) {
  if (!isOpen || !patient) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Sliding Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white border-l border-slate-100 shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0E2A6D] text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {patient.name ? patient.name.slice(0, 2).toUpperCase() : "P"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{patient.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">ID: {patient.id || "PAT-108"}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-200/70 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Personal Information */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Personal Information</h4>
                <div className="space-y-2.5 p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Age & Gender:</span>
                    <span className="font-semibold text-slate-900">{patient.age || "34 Yrs"} • {patient.gender || "Male"}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-medium">Phone Number:</span>
                    <span className="font-mono font-semibold text-slate-900">{patient.phone || "+91 98480 12345"}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-medium">Email Address:</span>
                    <span className="font-medium text-slate-800">{patient.email || "patient@example.com"}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-medium">Total Visits:</span>
                    <span className="font-bold text-[#0E2A6D]">{patient.totalVisits || 4} Visits</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointment */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Appointment</h4>
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#0E2A6D]">
                    <span>{patient.upcomingAppointment || "12 Aug 2026 @ 10:00 AM"}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800">Booked</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">Procedure: Laser Root Canal</p>
                </div>
              </div>

              {/* Appointment History */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Appointment History</h4>
                <div className="space-y-2">
                  {[
                    { date: patient.lastAppointment || "01 Aug 2026", treatment: "Laser Root Canal (Session 1)", status: "Completed" },
                    { date: "15 Jul 2026", treatment: "Consultation & Diagnostics", status: "Completed" },
                    { date: "10 Feb 2026", treatment: "Teeth Whitening", status: "Completed" }
                  ].map((hist, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-slate-900">{hist.treatment}</h5>
                        <span className="text-[10px] text-slate-400">{hist.date}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {hist.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor Notes */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doctor Notes</h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed text-xs">
                  "{patient.doctorNotes || "Patient reports mild sensitivity on lower molar. Diagnostic X-ray shows good bone density post-procedure."}"
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider block">Quick Contact</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${patient.phone || "+919848012345"}`}
                    className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Patient</span>
                  </a>
                  <a
                    href={`mailto:${patient.email || "patient@example.com"}`}
                    className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Patient</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold text-xs cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Close Profile
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
