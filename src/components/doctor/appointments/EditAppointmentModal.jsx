import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, Phone, Mail, FileText, Stethoscope } from "lucide-react";
import appointmentManagementService from "../../../services/appointmentManagementService";

export default function EditAppointmentModal({ appointment, isOpen, onClose, onSuccess }) {
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [treatment, setTreatment] = useState("Laser Root Canal");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Confirmed");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (appointment) {
      setPatientName(appointment.patientName || "");
      setPhoneNumber(appointment.phoneNumber || "");
      setEmail(appointment.email || "");
      setTreatment(appointment.treatment || "Laser Root Canal");
      setDate(appointment.date || "");
      setTime(appointment.time || "10:00 AM");
      setStatus(appointment.status || "Confirmed");
      setNotes(appointment.notes || "");
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    appointmentManagementService.updateAppointment(appointment.id, {
      patientName,
      phoneNumber,
      email,
      treatment,
      date,
      time,
      status,
      notes
    });

    if (onSuccess) onSuccess();
  };

  const treatmentOptions = [
    "Laser Root Canal",
    "Teeth Whitening",
    "Dental Implants",
    "Aesthetic Restoration",
    "Laser Gum Treatment",
    "Braces & Aligners",
    "Crowns & Bridges",
    "Single Tooth Filling",
    "General Consultation"
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
  ];

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
          className="relative bg-white w-full max-w-lg rounded-[28px] border border-slate-100 shadow-2xl p-6 md:p-8 select-none z-10 max-h-[90vh] overflow-y-auto"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer outline-none"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-6">
            <h3 className="text-lg font-extrabold text-[#0E2A6D] tracking-tight">Edit Appointment</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Update details for appointment ID <span className="font-bold text-slate-700">{appointment.id}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Treatment Procedure
              </label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
              >
                {treatmentOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>{ts}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Clinical Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-extrabold text-slate-500 cursor-pointer outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-10 rounded-xl text-white bg-[#0E2A6D] hover:bg-[#16398b] text-xs font-extrabold cursor-pointer shadow-md shadow-blue-900/5 outline-none"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
