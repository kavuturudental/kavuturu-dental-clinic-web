// src/components/common/CustomDialog.jsx

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  HelpCircle,
  X
} from "lucide-react";
const formatTreatmentName = (rawTreatment) => {
  if (!rawTreatment) return "General Dental Care";
  let formatted = rawTreatment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  if (!formatted.toLowerCase().includes("treatment") && !formatted.toLowerCase().includes("consultation")) {
    formatted += " Treatment";
  }
  return formatted;
};

const formatHumanDate = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.includes(",")) return dateStr; // Already formatted
  let cleanStr = String(dateStr).split("T")[0].split("GMT")[0].split("+")[0].split("05.30")[0].split("05:30")[0].trim();
  const [y, m, d] = cleanStr.split("-");
  if (y && m && d && y.length === 4) {
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }); // e.g. "Thu, 06 Aug 2026"
    }
  }
  return cleanStr;
};

export const CustomDialog = ({
  isOpen,
  type = "info", // success | warning | error | info | confirm | prompt
  title,
  message,
  confirmText,
  cancelText,
  defaultValue = "",
  placeholder = "",
  summaryData = null,
  emailSent = false,
  onConfirm,
  onCancel,
  onClose
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  if (!isOpen) return null;

  const getIconAndTheme = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
          badgeBg: "bg-emerald-50 ring-8 ring-emerald-50/60",
          primaryBtnBg: "bg-emerald-600 hover:bg-emerald-700 text-white"
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
          badgeBg: "bg-amber-50 ring-8 ring-amber-50/60",
          primaryBtnBg: "bg-[#0E2A6D] hover:bg-[#0A1F52] text-white"
        };
      case "error":
        return {
          icon: <XCircle className="w-8 h-8 text-rose-600" />,
          badgeBg: "bg-rose-50 ring-8 ring-rose-50/60",
          primaryBtnBg: "bg-rose-600 hover:bg-rose-700 text-white"
        };
      case "confirm":
        return {
          icon: <HelpCircle className="w-8 h-8 text-[#0E2A6D]" />,
          badgeBg: "bg-[#0E2A6D]/10 ring-8 ring-[#0E2A6D]/5",
          primaryBtnBg: "bg-[#0E2A6D] hover:bg-[#0A1F52] text-white"
        };
      case "prompt":
        return {
          icon: <HelpCircle className="w-8 h-8 text-[#0E2A6D]" />,
          badgeBg: "bg-[#0E2A6D]/10 ring-8 ring-[#0E2A6D]/5",
          primaryBtnBg: "bg-[#0E2A6D] hover:bg-[#0A1F52] text-white"
        };
      case "info":
      default:
        return {
          icon: <Info className="w-8 h-8 text-sky-600" />,
          badgeBg: "bg-sky-50 ring-8 ring-sky-50/60",
          primaryBtnBg: "bg-[#0E2A6D] hover:bg-[#0A1F52] text-white"
        };
    }
  };

  const theme = getIconAndTheme();

  const handleConfirm = () => {
    if (type === "prompt") {
      onConfirm && onConfirm(inputValue);
    } else {
      onConfirm && onConfirm();
    }
    onClose && onClose();
  };

  const handleCancel = () => {
    onCancel && onCancel();
    onClose && onClose();
  };

  const isDoubleButton = type === "confirm" || type === "prompt" || Boolean(cancelText);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-200 select-none font-sans">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100/80 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 cursor-pointer outline-none"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Status Icon */}
        <div className={`mb-5 p-3 rounded-full ${theme.badgeBg} flex items-center justify-center`}>
          {theme.icon}
        </div>

        {/* Title */}
        {title && (
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">
            {title}
          </h3>
        )}

        {/* Message */}
        {message && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 whitespace-pre-line">
            {message}
          </p>
        )}

        {/* Appointment Summary Card */}
        {summaryData && (
          <div className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 mb-4 text-left space-y-2.5 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
              <span>Appointment Summary</span>
            </h4>
            <div className="space-y-2 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2.5">
                <span className="text-sm flex-shrink-0">👤</span>
                <span className="font-semibold text-slate-900">{summaryData.patientName}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm flex-shrink-0">🦷</span>
                <span className="text-slate-800 font-medium">{formatTreatmentName(summaryData.treatment)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm flex-shrink-0">📅</span>
                <span className="text-slate-800 font-medium">{formatHumanDate(summaryData.date)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm flex-shrink-0">🕒</span>
                <span className="text-slate-800 font-medium">{summaryData.time}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Text */}
        {emailSent && (
          <p className="text-[11px] text-slate-500 font-normal mb-5 leading-snug">
            A confirmation email has been sent to your registered email address.
          </p>
        )}

        {/* Prompt Input */}
        {type === "prompt" && (
          <div className="w-full mb-6 text-left">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder || "Enter value..."}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium border border-slate-200 rounded-xl outline-none focus:border-[#0E2A6D] focus:ring-1 focus:ring-[#0E2A6D] transition-all"
              autoFocus
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex items-center justify-center gap-3">
          {isDoubleButton && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              {cancelText || "Cancel"}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${theme.primaryBtnBg}`}
          >
            {confirmText || (isDoubleButton ? "Continue" : "OK")}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CustomDialog;
