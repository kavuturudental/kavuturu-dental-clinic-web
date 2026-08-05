// src/receptionist/components/appointments/AppointmentRow.jsx

import React from "react";
import StatusBadge from "./StatusBadge";
import { Eye, Edit2, CheckCircle2, XCircle, UserCheck } from "lucide-react";
import { getLocalDateString } from "../../../utils/dateUtils";

export default function AppointmentRow({
  appointment,
  apt,
  userRole = "receptionist",
  onView,
  onEdit,
  onConfirm,
  onStatusChange,
  onCancel
}) {
  const item = appointment || apt || {};

  const getSourceBadgeStyle = (source) => {
    switch (source) {
      case "Receptionist":
        return "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]/60";
      case "Doctor":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Phone Call":
      case "Phone":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Walk-in":
        return "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]";
      case "Email":
        return "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]";
      case "Website":
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const sourceName = item.bookingSource || item.source || "Walk-in";
  const isReceptionist = userRole === "receptionist";
  const isDoctor = userRole === "doctor";

  // Check In button constraint: Appointment Date MUST be Today AND status MUST be Confirmed
  const todayStr = getLocalDateString();
  const rawDate = item.raw?.appointmentDate || item.date;
  let formattedAptDate = "";
  if (typeof rawDate === "string" && rawDate.length >= 10) {
    formattedAptDate = rawDate.split("T")[0];
  }
  const isToday =
    formattedAptDate === todayStr ||
    item.dateGroup === "Today" ||
    item.date === "Today" ||
    item.date === todayStr;

  const canCheckIn = isReceptionist && item.status === "Confirmed" && isToday;

  return (
    <tr className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors duration-150 text-xs">
      
      {/* 1. Time & Date */}
      <td className="px-6 py-5 whitespace-nowrap">
        <span className="font-mono font-semibold text-slate-900 block text-xs">
          {item.time}
        </span>
        <span className="text-[11px] font-normal text-slate-400 block mt-0.5">
          {item.date}
        </span>
      </td>

      {/* 2. Patient */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] font-semibold text-xs flex items-center justify-center flex-shrink-0">
            {item.patientName ? item.patientName.slice(0, 2).toUpperCase() : "PT"}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-xs">{item.patientName}</h4>
            <span className="text-[11px] font-mono text-slate-400 font-normal">{item.aptNumber || item.id}</span>
          </div>
        </div>
      </td>

      {/* 3. Phone */}
      <td className="px-6 py-5 font-mono text-slate-600 font-normal whitespace-nowrap">
        {item.phoneNumber}
      </td>

      {/* 4. Treatment */}
      <td className="px-6 py-5 font-normal text-slate-700 whitespace-nowrap">
        {item.treatment}
      </td>

      {/* 5. Doctor */}
      <td className="px-6 py-5 font-medium text-slate-800 whitespace-nowrap">
        {item.doctor || "Dr. Kavuturu"}
      </td>

      {/* 6. Status */}
      <td className="px-6 py-5 whitespace-nowrap">
        <StatusBadge status={item.status} />
      </td>

      {/* 7. Booking Source Badge */}
      <td className="px-6 py-5 whitespace-nowrap">
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${getSourceBadgeStyle(sourceName)}`}>
          {sourceName}
        </span>
      </td>

      {/* 8. Role-Based Lifecycle Actions */}
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          
          {/* Receptionist Only: "Check In" ONLY when Date = Today AND Status = Confirmed */}
          {canCheckIn && (
            <button
              type="button"
              onClick={() => onStatusChange && onStatusChange("Checked In")}
              className="px-3 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs outline-none active:scale-98"
              title="Check In Patient (Today Only)"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Check In</span>
            </button>
          )}

          {/* Doctor Only: "Mark as Completed" strictly ONLY when status === "Checked In" */}
          {isDoctor && item.status === "Checked In" && (
            <button
              type="button"
              onClick={() => onStatusChange && onStatusChange("Completed")}
              className="px-3 py-1.5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs outline-none active:scale-98"
              title="Mark Appointment Completed"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark as Completed</span>
            </button>
          )}

          {/* View Action */}
          <button
            type="button"
            onClick={() => onView && onView(item)}
            className="p-2 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 transition-all cursor-pointer outline-none"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Edit Action */}
          <button
            type="button"
            onClick={() => onEdit && onEdit(item)}
            className="p-2 rounded-full bg-slate-100/80 hover:bg-amber-100 text-slate-600 hover:text-[#D97706] transition-all cursor-pointer outline-none"
            title="Edit Appointment"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Cancel Action */}
          {item.status !== "Cancelled" && item.status !== "Completed" && (
            <button
              type="button"
              onClick={() => onCancel && onCancel(item)}
              className="p-2 rounded-full bg-red-50 hover:bg-[#DC2626] text-[#DC2626] hover:text-white transition-all cursor-pointer outline-none"
              title="Cancel Appointment"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>

    </tr>
  );
}
