// src/components/doctor/appointments/PatientDetailDrawer.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, MapPin, Calendar, Stethoscope, Plus, Activity, Clock, FileText, Paperclip, AlertCircle } from "lucide-react";

export default function PatientDetailDrawer({ patient, isOpen, onClose, onBookAppointment }) {
  const [activeTab, setActiveTab] = useState("treatment"); // treatment, appointments, reports, internal

  if (!isOpen || !patient) return null;

  const getInitials = (name) => {
    if (!name) return "PT";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "In Chair":
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const dummyReports = [
    { id: "REP-1", title: "Digital RVG X-Ray Tooth #36", type: "Digital Radiograph", date: "2026-06-15", size: "2.4 MB" },
    { id: "REP-2", title: "3D CBCT Maxillary Jaw Scan", type: "3D Volumetric Scan", date: "2026-07-10", size: "18.5 MB" },
    { id: "REP-3", title: "Full Mouth Intraoral Photography", type: "High-Res Clinical Images", date: "2026-07-29", size: "5.1 MB" }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden select-none">
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
            className="w-screen max-w-lg bg-white border-l border-slate-100 shadow-2xl flex flex-col"
          >
            {/* Drawer Top Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#0E2A6D]/10 text-[#0E2A6D] font-extrabold flex items-center justify-center text-xl shadow-xs border border-[#0E2A6D]/10 flex-shrink-0">
                  {getInitials(patient.fullName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{patient.fullName}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-extrabold uppercase">
                      {patient.status || "Active"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Patient ID: <span className="text-slate-700 font-bold">{patient.id}</span></p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{patient.age} yrs • {patient.gender} • Blood Group: <span className="text-[#0E2A6D] font-bold">{patient.bloodGroup || "O+"}</span></p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-colors cursor-pointer border border-slate-100 outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact & Bio Cards */}
            <div className="p-5 border-b border-slate-100 bg-white grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-semibold bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 truncate">
                <Phone className="w-3.5 h-3.5 text-[#0E2A6D] flex-shrink-0" />
                <span className="truncate">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-semibold bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 truncate">
                <Mail className="w-3.5 h-3.5 text-[#0E2A6D] flex-shrink-0" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-slate-600 font-semibold bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{patient.address || "Hyderabad, Telangana"}</span>
              </div>
            </div>

            {/* Sub Nav Tabs & Book Action */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-100">
                {[
                  { key: "treatment", label: `Treatments (${patient.treatmentHistory?.length || 0})` },
                  { key: "appointments", label: "Appointments" },
                  { key: "reports", label: "Reports" },
                  { key: "internal", label: "Internal Notes" }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === t.key ? "bg-[#0E2A6D] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onBookAppointment && onBookAppointment(patient)}
                className="h-8 px-3 rounded-lg text-xs font-bold text-white bg-[#0E2A6D] hover:bg-[#16398b] active:scale-98 transition-all cursor-pointer flex items-center gap-1 shadow-sm flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === "treatment" && (
                /* Treatment History Tab */
                patient.treatmentHistory && patient.treatmentHistory.length > 0 ? (
                  patient.treatmentHistory.map((record) => (
                    <div key={record.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                        <span className="text-xs font-extrabold text-[#0E2A6D] flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5" />
                          {record.treatment}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{record.date}</span>
                      </div>
                      
                      <div className="text-xs font-semibold text-slate-700 space-y-1 pt-1">
                        <p><span className="text-slate-400 font-bold">Doctor:</span> {record.doctor}</p>
                        <p><span className="text-slate-400 font-bold">Diagnosis:</span> {record.diagnosis}</p>
                        <p><span className="text-slate-400 font-bold">Clinical Notes:</span> {record.notes}</p>
                        {record.prescription && (
                          <div className="mt-2 bg-blue-50/60 border border-blue-100 p-2.5 rounded-xl text-blue-900 text-xs font-medium">
                            <span className="font-bold block text-[10px] uppercase text-blue-700 mb-0.5">Rx Prescribed:</span>
                            {record.prescription}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center text-slate-400 space-y-2">
                    <Activity className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold">No treatment records logged yet.</p>
                  </div>
                )
              )}

              {activeTab === "appointments" && (
                <div className="space-y-3">
                  <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#0E2A6D]">Next Appointment</p>
                      <p className="text-slate-600 font-semibold mt-0.5">{patient.nextAppointment ? `${patient.nextAppointment} @ 10:30 AM` : "Not scheduled"}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#0E2A6D] text-white">Confirmed</span>
                  </div>

                  <div className="bg-slate-50/60 rounded-xl border border-slate-100 p-3 space-y-1 text-xs font-semibold text-slate-700">
                    <div className="flex items-center justify-between text-[#0E2A6D] font-extrabold">
                      <span>Primary Treatment: {patient.treatment}</span>
                      <span>Total Visits: {patient.totalVisits || 1}</span>
                    </div>
                    <p className="text-slate-500">Last Clinic Visit: {patient.lastVisit || "N/A"}</p>
                  </div>
                </div>
              )}

              {activeTab === "reports" && (
                <div className="space-y-3">
                  {dummyReports.map((rep) => (
                    <div key={rep.id} className="bg-white rounded-xl border border-slate-100 p-3.5 shadow-xs flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800">{rep.title}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{rep.type} • {rep.date} • {rep.size}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#0E2A6D] hover:underline cursor-pointer">View</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "internal" && (
                <div className="bg-amber-50/60 rounded-2xl border border-amber-100 p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-800 font-extrabold">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Internal Clinical & Preference Notes</span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    • Patient prefers morning appointments.<br />
                    • Highly cooperative during RCT procedures.<br />
                    • Allergic to Penicillin - alternative prescribed: Erythromycin 500mg.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
