// src/receptionist/components/appointments/StatusBadge.jsx

import React from "react";

export default function StatusBadge({ status }) {
  const getBadgeStyle = () => {
    switch (status) {
      case "Confirmed":
        return "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]/60 font-semibold";
      case "Checked In":
        return "bg-[#2563EB] text-white font-semibold shadow-2xs";
      case "Completed":
        return "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] font-semibold";
      case "Pending":
        return "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] font-semibold";
      case "Cancelled":
        return "bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] font-semibold";
      case "Rescheduled":
        return "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] font-semibold";
      case "Rejected":
        return "bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] font-semibold";
      default:
        return "bg-slate-100 text-slate-600 font-medium";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] inline-block tracking-tight ${getBadgeStyle()}`}>
      {status}
    </span>
  );
}
