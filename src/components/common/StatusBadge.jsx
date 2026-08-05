// src/components/common/StatusBadge.jsx

import React from "react";
import clsx from "clsx";
import { STATUS_COLORS } from "../../constants/appointmentStatus";

export const StatusBadge = ({ status = "Pending", className }) => {
  const styles = STATUS_COLORS[status] || STATUS_COLORS.Pending;

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
        styles.text,
        styles.bg,
        styles.border,
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
