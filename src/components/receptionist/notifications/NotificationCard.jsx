import React from "react";
import { Check, Trash2, MailOpen, Mail } from "lucide-react";
import clsx from "clsx";

const NotificationCard = ({ notification, onMarkRead, onDelete, onSelect }) => {
  return (
    <div
      className={clsx(
        "p-4 sm:p-5 rounded-[20px] border transition-all duration-200 flex items-start justify-between gap-4 select-none",
        {
          "bg-[#0E2A6D]/3 border-[#0E2A6D]/10 hover:bg-[#0E2A6D]/5": !notification.read,
          "bg-white border-slate-100 hover:border-slate-200/60": notification.read
        }
      )}
    >
      {/* Content */}
      <div className="flex-1 min-w-0 flex gap-3 cursor-pointer" onClick={() => onSelect(notification)}>
        {/* Unread Status Dot */}
        <div className="pt-1.5">
          <div
            className={clsx("w-2 h-2 rounded-full", {
              "bg-[#0E2A6D]": !notification.read,
              "bg-slate-200": notification.read
            })}
          />
        </div>

        <div className="space-y-1">
          <h4
            className={clsx("text-xs sm:text-sm font-bold tracking-wide", {
              "text-slate-800": !notification.read,
              "text-slate-600": notification.read
            })}
          >
            {notification.title}
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
            {notification.message}
          </p>
          <span className="text-[10px] text-slate-400 font-bold block pt-1 uppercase tracking-wider">
            {notification.date}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {!notification.read && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-[#0E2A6D]/5 hover:text-[#0E2A6D] cursor-pointer active:scale-90 outline-none"
            title="Mark as read"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer active:scale-90 outline-none"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
