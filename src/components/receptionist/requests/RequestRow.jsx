// src/receptionist/components/requests/RequestRow.jsx

import React from "react";
import StatusBadge from "../appointments/StatusBadge";
import { formatShortDate } from "../../../utils/receptionist/helpers";
import { Check, X, Calendar, Eye } from "lucide-react";

export default function RequestRow({
  request,
  onAccept,
  onReschedule,
  onReject,
  onView
}) {
  const isPending = request.status === "Pending";
  const reqDisplayNumber = request.reqNumber || request.requestNumber || (request.id ? `REQ-${String(request.id).slice(-4).toUpperCase()}` : "REQ-1001");

  const getSourceBadgeStyle = (src) => {
    switch (src) {
      case "Website":
        return "bg-slate-100 text-slate-700 font-medium";
      case "WhatsApp":
        return "bg-[#F0FDF4] text-[#16A34A] font-medium border border-[#BBF7D0]";
      case "Phone":
        return "bg-slate-100 text-slate-700 font-medium";
      case "Referral":
        return "bg-purple-50 text-purple-700 font-medium border border-purple-100";
      default:
        return "bg-slate-100 text-slate-600 font-medium";
    }
  };

  return (
    <tr className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors duration-150 text-xs">
      
      {/* 1. Patient & Request Number */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] font-semibold text-xs flex items-center justify-center flex-shrink-0">
            {request.patientName ? request.patientName.slice(0, 2).toUpperCase() : "PT"}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-xs">{request.patientName}</h4>
            <span className="text-[11px] font-mono text-slate-500 font-bold block">{reqDisplayNumber}</span>
          </div>
        </div>
      </td>

      {/* 2. Requested Treatment */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-normal text-slate-800 text-xs">{request.treatment}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${getSourceBadgeStyle(request.source)}`}>
              {request.source || "Website"}
            </span>
          </div>
          {request.patientNotes && (
            <p className="text-[11px] font-normal text-slate-400 truncate max-w-[200px]">
              "{request.patientNotes}"
            </p>
          )}
        </div>
      </td>

      {/* 3. Preferred Date & Time */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div>
            <span className="font-semibold text-slate-900 block">{formatShortDate(request.preferredDate)}</span>
            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{request.preferredTime || "10:00 AM"}</span>
          </div>
          {request.priority && request.priority !== "Normal" && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              request.priority === "Urgent" ? "bg-red-50 text-[#DC2626] border border-red-100" : "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
            }`}>
              {request.priority}
            </span>
          )}
        </div>
      </td>

      {/* 4. Phone Number */}
      <td className="px-6 py-5 font-mono text-slate-600 font-normal whitespace-nowrap">
        {request.phoneNumber || request.phone}
      </td>

      {/* 5. Submitted */}
      <td className="px-6 py-5 text-slate-500 font-normal whitespace-nowrap">
        {request.timeAgo || request.submittedAt || "Recent"}
      </td>

      {/* 6. Status */}
      <td className="px-6 py-5 whitespace-nowrap">
        <StatusBadge status={request.status} />
      </td>

      {/* 7. Actions */}
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          {isPending && (
            <>
              {/* Accept */}
              <button
                type="button"
                onClick={() => onAccept(request.id)}
                className="px-3 py-1.5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs outline-none active:scale-98"
                title="Accept Request"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept</span>
              </button>

              {/* Reject */}
              <button
                type="button"
                onClick={() => onReject(request.id)}
                className="px-3 py-1.5 rounded-full bg-red-50 hover:bg-[#DC2626] text-[#DC2626] hover:text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer outline-none active:scale-98"
                title="Reject Request"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </>
          )}

          {/* View Details */}
          <button
            type="button"
            onClick={() => onView && onView(request)}
            className="p-2 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 transition-all cursor-pointer outline-none"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>

    </tr>
  );
}
