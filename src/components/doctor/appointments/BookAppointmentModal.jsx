// src/components/doctor/appointments/BookAppointmentModal.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, Mail, FileText, Stethoscope, Globe } from "lucide-react";
import appointmentManagementService from "../../../services/appointmentManagementService";
import TimeSlotPicker from "../../common/TimeSlotPicker";

export default function BookAppointmentModal({ isOpen, onClose, onSuccess }) {
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [treatment, setTreatment] = useState("Laser Root Canal");
  const [source, setSource] = useState("Walk-in");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00 AM");
  const [status, setStatus] = useState("Confirmed");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempErrors = {};

    if (!patientName.trim()) tempErrors.patientName = "Patient name is required";
    
    if (!phoneNumber || phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      tempErrors.phoneNumber = "Please enter a valid 10-digit mobile number.";
    }

    if (!date) tempErrors.date = "Appointment date is required";
    if (!time) tempErrors.time = "Time slot is required";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    appointmentManagementService.createAppointment({
      patientName: patientName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      treatment,
      doctor: "Dr. K. Ravindra Babu",
      date,
      time,
      status,
      source,
      notes: notes.trim()
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

  const sourceOptions = [
    "Walk-in",
    "Website",
    "Phone Call",
    "WhatsApp",
    "Referral",
    "Follow-up Visit"
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-slate-100 shadow-2xl p-5 md:p-6 select-none z-10 custom-scrollbar"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer outline-none"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-4">
            <h3 className="text-base font-extrabold text-[#0E2A6D] tracking-tight">Book New Appointment</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Schedule a patient consultation or dental procedure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Row 1: Patient Name & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={patientName}
                    onChange={(e) => {
                      setPatientName(e.target.value);
                      if (errors.patientName) setErrors({ ...errors, patientName: "" });
                    }}
                    className={`h-9 w-full rounded-xl border pl-9 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0E2A6D] ${
                      errors.patientName ? "border-red-400 bg-red-50/10" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.patientName && <p className="text-[9px] font-bold text-red-500 mt-0.5">{errors.patientName}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhoneNumber(onlyNums);
                      if (onlyNums.length > 0 && onlyNums.length < 10) {
                        setErrors((prev) => ({ ...prev, phoneNumber: "Please enter a valid 10-digit mobile number." }));
                      } else {
                        setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                      }
                    }}
                    className={`h-9 w-full rounded-xl border pl-9 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0E2A6D] ${
                      errors.phoneNumber ? "border-red-400 bg-red-50/10" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.phoneNumber && <p className="text-[9px] font-bold text-red-500 mt-0.5">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Row 2: Email & Treatment Procedure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0E2A6D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Treatment Procedure *
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D] cursor-pointer"
                  >
                    {treatmentOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Source & Initial Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Source *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D] cursor-pointer"
                    required
                  >
                    {sourceOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D] cursor-pointer"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Row 4: Appointment Date & Reusable TimeSlotPicker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Appointment Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Time Slot *
                </label>
                <TimeSlotPicker
                  selectedDate={date}
                  selectedTimeSlot={time}
                  onSelectTimeSlot={setTime}
                  error={errors.time}
                />
              </div>
            </div>

            {/* Row 5: Notes */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Clinical Notes / Symptoms
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <textarea
                  rows={2}
                  placeholder="Enter patient symptoms or special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
                />
              </div>
            </div>

            {/* Row 6: Actions */}
            <div className="flex items-center gap-3 pt-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-extrabold text-slate-500 transition-all cursor-pointer outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 rounded-xl text-white bg-[#0E2A6D] hover:bg-[#16398b] text-xs font-extrabold transition-all cursor-pointer shadow-sm outline-none"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
