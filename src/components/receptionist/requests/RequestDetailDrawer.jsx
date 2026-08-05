// src/receptionist/components/requests/RequestDetailDrawer.jsx

import React from "react";
import { X, Check, Calendar, Globe, Phone, Mail, Clock, MessageSquare, AlertCircle } from "lucide-react";
import StatusBadge from "../appointments/StatusBadge";

export default function RequestDetailDrawer({
  isOpen,
  onClose,
  request,
  onAccept,
  onReschedule,
  onReject
}) {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Right Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-100 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Request Details
              </span>
              <h2 className="text-base font-semibold text-slate-900 mt-0.5">
                {request.patientName}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
            
            {/* Priority & Status Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Status:</span>
                <StatusBadge status={request.status} />
              </div>

              {request.priority && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  request.priority === "Urgent" ? "bg-red-50 text-red-600 border border-red-100" :
                  request.priority === "Today" ? "bg-amber-50 text-amber-700 border border-amber-200/60" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {request.priority}
                </span>
              )}
            </div>

            {/* Patient Info Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-3 shadow-2xs">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                Patient Contact Information
              </h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-mono">{request.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{request.email || "No email provided"}</span>
                </div>
              </div>
            </div>

            {/* Treatment & Schedule Details */}
            <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-3 shadow-2xs">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                Request Specifications
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Requested Treatment</span>
                  <span className="font-semibold text-slate-900">{request.treatment}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Booking Source</span>
                  <span className="font-medium text-slate-700 flex items-center gap-1 mt-0.5">
                    <Globe className="w-3 h-3 text-slate-400" />
                    {request.source || "Website"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Preferred Date</span>
                  <span className="font-semibold text-slate-900">{request.preferredDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Preferred Time</span>
                  <span className="font-semibold text-slate-900">{request.preferredTime || "10:00 AM"}</span>
                </div>
              </div>

              {request.patientNotes && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1 text-[10px]">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    <span>Patient Note:</span>
                  </div>
                  "{request.patientNotes}"
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Submitted:</span>
              <span className="font-medium text-slate-600">{request.timeAgo}</span>
            </div>

          </div>

          {/* Drawer Actions */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-2">
            {request.status === "Pending" && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onAccept) onAccept(request.id);
                    onClose();
                  }}
                  className="py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onReject) onReject(request.id);
                    onClose();
                  }}
                  className="py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors cursor-pointer"
            >
              Close Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
