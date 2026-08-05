// src/components/common/EmptyState.jsx

import React from "react";
import { Inbox } from "lucide-react";
import Button from "./Button";

export const EmptyState = ({
  icon: Icon = Inbox,
  title = "No data available",
  description = "There are no records to display at this time.",
  actionText,
  onAction
}) => {
  return (
    <div className="py-12 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-400 font-medium mt-0.5">{description}</p>
      </div>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
