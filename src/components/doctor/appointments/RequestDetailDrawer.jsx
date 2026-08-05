// src/components/doctor/appointments/RequestDetailDrawer.jsx

import React from "react";
import { X, Calendar, Clock, Phone, Mail, Globe, Check, RefreshCw, AlertCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RequestDetailDrawer({ request, isOpen, onClose, onStatusChange, onReschedule }) {
  if (!isOpen || !request) return null;

  const getSourceBadgeStyle = (src) => {
    switch (src) {
      case "Website": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Walk-in": return "bg-purple-50 text-purple-700 border-purple-100";
      case "Phone Call": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Receptionist": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

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
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Request Details #{request.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{request.patientName}</h3>
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
              
              {/* Status & Source Badges */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-medium text-slate-400 block">Booking Source</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getSourceBadgeStyle(request.source || "Website")}`}>
                    {request.source || "Website"}
                  </span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-medium text-slate-400 block">Current Status</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {request.status}
                  </span>
                </div>
              </div>

              {/* Patient Contact Details */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient Contact</h4>
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Phone Number</span>
                      <span className="font-mono font-semibold text-slate-900">{request.phone || request.phoneNumber || "+91 98480 12345"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Email Address</span>
                      <span className="font-medium text-slate-800">{request.email || "patient@example.com"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requested Appointment Slots */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Booking Slot Details</h4>
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#0E2A6D] flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Treatment Procedure</span>
                      <span className="font-bold text-slate-900">{request.treatment}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Preferred Date</span>
                      <span className="font-semibold text-slate-800">{request.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Preferred Time</span>
                      <span className="font-mono font-semibold text-[#0E2A6D]">{request.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Message / Notes */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient Message / Notes</h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed text-xs">
                  "{request.patientNotes || request.notes || "Requesting early morning slot for consultation and routine checkup."}"
                </div>
              </div>

              {/* Requested On Timestamp */}
              <div className="text-slate-400 text-[11px] font-medium text-center">
                Submitted {request.timeAgo || "15 minutes ago"}
              </div>

            </div>

            {/* Drawer Footer Action Buttons */}
            <div className="p-5 border-t border-slate-100 bg-white flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onStatusChange(request.id, "Confirmed");
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Check className="w-4 h-4" />
                <span>Accept</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onReschedule) onReschedule(request);
                }}
                className="flex-1 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-blue-100"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reschedule</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onStatusChange(request.id, "Cancelled");
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-rose-100"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
