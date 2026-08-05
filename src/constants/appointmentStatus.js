// src/constants/appointmentStatus.js

export const APPOINTMENT_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
  RESCHEDULED: "Rescheduled"
};

export const STATUS_COLORS = {
  Pending: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  Confirmed: { text: "text-[#0E2A6D]", bg: "bg-[#0E2A6D]/10", border: "border-[#0E2A6D]/20" },
  Completed: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  Cancelled: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  Rejected: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  Rescheduled: { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" }
};

export default APPOINTMENT_STATUS;
