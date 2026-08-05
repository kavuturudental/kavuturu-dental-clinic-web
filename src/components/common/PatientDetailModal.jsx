// src/components/common/PatientDetailModal.jsx

import React, { useState } from "react";
import { X, Phone, Mail, Calendar, Clock, Sparkles } from "lucide-react";
import StatusBadge from "../receptionist/appointments/StatusBadge";
import EmptyState from "../receptionist/common/EmptyState";
import { treatmentOptions } from "../../data/appointment/treatments";

const formatTreatmentName = (rawTreatment) => {
  if (!rawTreatment) return "General Consultation";
  const matched = treatmentOptions.find(
    (opt) => opt.value === rawTreatment || opt.label.toLowerCase() === rawTreatment.toLowerCase()
  );
  if (matched) return matched.label;

  let formatted = rawTreatment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  if (!formatted.toLowerCase().includes("treatment") && !formatted.toLowerCase().includes("consultation")) {
    formatted += " Treatment";
  }
  return formatted;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "N/A";
  if (String(dateStr).includes(",")) return dateStr;
  let cleanStr = String(dateStr).split("T")[0].split("GMT")[0].split("+")[0].split("05.30")[0].split("05:30")[0].trim();
  const [y, m, d] = cleanStr.split("-");
  if (y && m && d && y.length === 4) {
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }
  }
  return cleanStr;
};

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const match = String(timeStr).match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3] ? match[3].toUpperCase() : "";
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export default function PatientDetailModal({ patient, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'completed' | 'cancelled'

  if (!isOpen || !patient) return null;

  const rawHistory = patient.appointmentHistory || [];

  // Deduplicate and sort newest appointment date & time first
  const sortedHistory = [...rawHistory].sort((a, b) => {
    const dateA = (a.appointmentDate || a.date || "").slice(0, 10);
    const dateB = (b.appointmentDate || b.date || "").slice(0, 10);
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return parseTimeToMinutes(b.appointmentTime || b.time) - parseTimeToMinutes(a.appointmentTime || a.time);
  });

  const completed = sortedHistory.filter((a) => a.status === "Completed");
  const cancelled = sortedHistory.filter((a) => a.status === "Cancelled" || a.status === "Rejected");

  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingApts = sortedHistory
    .filter((a) => {
      const d = (a.appointmentDate || a.date || "").slice(0, 10);
      return d >= todayStr && a.status !== "Completed" && a.status !== "Cancelled" && a.status !== "Rejected";
    })
    .sort((a, b) => {
      const dateA = (a.appointmentDate || a.date || "").slice(0, 10);
      const dateB = (b.appointmentDate || b.date || "").slice(0, 10);
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      return parseTimeToMinutes(a.appointmentTime || a.time) - parseTimeToMinutes(b.appointmentTime || b.time);
    });

  const upcoming = upcomingApts.length > 0 ? upcomingApts[0] : (patient.upcomingAppointment || null);

  const displayList =
    activeTab === "completed" ? completed : activeTab === "cancelled" ? cancelled : sortedHistory;

  const totalVisitsCount = patient.totalVisits ?? sortedHistory.filter((a) => a.status !== "Cancelled" && a.status !== "Rejected").length;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-200 select-none font-sans">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100/80 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0E2A6D]/10 text-[#0E2A6D] font-extrabold flex items-center justify-center text-xl flex-shrink-0 border border-[#0E2A6D]/10">
              {patient.name ? patient.name.slice(0, 2).toUpperCase() : "PT"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{patient.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
                  {patient.currentStatus || "Active"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {patient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {patient.email || "No email provided"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-100/50 border-b border-slate-100 flex-shrink-0 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Visits</span>
            <span className="text-base font-extrabold text-[#0E2A6D]">{totalVisitsCount}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">First Visit</span>
            <span className="text-xs font-bold text-slate-800">{formatDisplayDate(patient.firstVisitDate)}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Latest Visit</span>
            <span className="text-xs font-bold text-slate-800">{formatDisplayDate(patient.latestAppointmentDate || patient.latestVisitDate)}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Current Status</span>
            <span className="text-xs font-bold text-slate-800">{patient.currentStatus || "Active"}</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          {/* Upcoming Appointment Section */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-[#0E2A6D] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0E2A6D]" />
              <span>Upcoming Appointment</span>
            </h4>
            {upcoming ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-xl border border-blue-100 text-xs shadow-2xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">{formatTreatmentName(upcoming.treatment)}</span>
                  <div className="flex items-center gap-3 text-slate-500 font-medium text-[11px]">
                    <span>📅 {formatDisplayDate(upcoming.appointmentDate || upcoming.date)}</span>
                    <span>🕒 {upcoming.appointmentTime || upcoming.time}</span>
                  </div>
                </div>
                <StatusBadge status={upcoming.status || "Confirmed"} />
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-medium italic">No Upcoming Appointment</p>
            )}
          </div>

          {/* History Sub-tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">Appointment History</h4>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === "all" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                All ({sortedHistory.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("completed")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === "completed" ? "bg-white text-emerald-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Completed ({completed.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cancelled")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === "cancelled" ? "bg-white text-rose-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Cancelled ({cancelled.length})
              </button>
            </div>
          </div>

          {/* Patient Timeline / Appointment History List */}
          {displayList.length === 0 ? (
            <EmptyState
              title={
                activeTab === "completed"
                  ? "No Completed Treatments"
                  : activeTab === "cancelled"
                  ? "No Cancelled Appointments"
                  : "No Appointments Recorded"
              }
              description={
                activeTab === "completed"
                  ? "This patient has no completed treatment records yet."
                  : activeTab === "cancelled"
                  ? "This patient has no cancelled or rejected appointments."
                  : "No appointment history is recorded for this patient yet."
              }
            />
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-6 py-2">
              {displayList.map((apt, index) => {
                const visitNumber = displayList.length - index;
                const statusStr = apt.status || "Confirmed";
                const isCompleted = statusStr === "Completed";
                const isCancelled = statusStr === "Cancelled" || statusStr === "Rejected";

                return (
                  <div key={apt._id || apt.id || index} className="relative group">
                    {/* Timeline Node Bullet */}
                    <div
                      className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                        isCompleted
                          ? "border-emerald-500 text-emerald-500 shadow-xs"
                          : isCancelled
                          ? "border-rose-500 text-rose-500 shadow-xs"
                          : "border-blue-500 text-blue-500 shadow-xs"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCompleted ? "bg-emerald-500" : isCancelled ? "bg-rose-500" : "bg-blue-500"
                        }`}
                      />
                    </div>

                    {/* Timeline Content Card */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-100/90 shadow-2xs hover:border-slate-200 transition-all space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                            Visit {visitNumber}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">
                            {formatTreatmentName(apt.treatment)}
                          </span>
                        </div>
                        <StatusBadge status={statusStr} />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 font-medium text-[11px] pt-2 border-t border-slate-50">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Date</span>
                          <span className="font-semibold text-slate-800">{formatDisplayDate(apt.appointmentDate || apt.date)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Time</span>
                          <span className="font-semibold text-slate-800">{apt.appointmentTime || apt.time}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Doctor</span>
                          <span className="font-semibold text-slate-800">{apt.doctor || "Dr. K. Ravindra Babu"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Created Date</span>
                          <span className="font-semibold text-slate-800">{formatDisplayDate(apt.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-98"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
