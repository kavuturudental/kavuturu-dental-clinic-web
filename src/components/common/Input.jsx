// src/components/common/Input.jsx

import React from "react";
import clsx from "clsx";

export const Input = ({ label, id, className, type = "text", error, required, ...props }) => {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={clsx(
          "h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#0E2A6D] focus:bg-white disabled:bg-slate-100 disabled:opacity-75 disabled:cursor-not-allowed",
          {
            "border-rose-500 focus:border-rose-500 bg-rose-50/20": error
          },
          className
        )}
        {...props}
      />
      {error && <span className="text-[11px] font-medium text-rose-500 block">{error}</span>}
    </div>
  );
};

export default Input;
