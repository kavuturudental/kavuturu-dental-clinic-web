// src/components/calendar/AppointmentPopover.jsx

import React from "react";
import Modal from "../../common/Modal";
import Button from "../../common/Button";

export default function AppointmentPopover({ isOpen, onClose, appointment }) {
  if (!appointment) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "Confirmed":
        return "bg-blue-50 text-blue-800 border-blue-200/80";
      case "Completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
      case "Cancelled":
        return "bg-rose-50 text-rose-800 border-rose-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
    >
      <div className="space-y-4 font-sans select-none">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
              Appointment #
            </span>
            <span className="font-mono font-bold text-slate-900">
              {appointment.aptNumber || appointment.id || "APT-1001"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
              Patient Name
            </span>
            <span className="font-bold text-slate-900">
              {appointment.patientName || appointment.patient?.name || "Patient"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
              Phone Number
            </span>
            <span className="font-mono font-medium text-slate-700">
              {appointment.phoneNumber || appointment.patient?.phone || "N/A"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
              Treatment
            </span>
            <span className="font-medium text-slate-800">
              {appointment.treatment || "General Consultation"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
              Date & Time
            </span>
            <span className="font-semibold text-slate-900">
              {appointment.date || "Today"} at {appointment.time || appointment.appointmentTime || "10:00 AM"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
              Status
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${getStatusBadge(appointment.status)}`}>
              {appointment.status || "Pending"}
            </span>
          </div>
        </div>

        {appointment.notes && (
          <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl text-xs text-slate-600">
            <span className="font-semibold block text-slate-900 mb-0.5">Notes:</span>
            {appointment.notes}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
