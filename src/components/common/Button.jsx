// src/components/common/Button.jsx

import React from "react";
import clsx from "clsx";

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 font-bold tracking-wide transition-all duration-200 select-none cursor-pointer active:scale-[0.98] outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        {
          // Sizes
          "h-8 px-3 text-xs rounded-xl": size === "sm",
          "h-9.5 px-4 text-xs rounded-xl": size === "md",
          "h-11 px-5 text-xs sm:text-sm rounded-xl": size === "lg",
          
          // Variants
          "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-2xs": variant === "primary",
          "bg-white text-slate-700 hover:bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs": variant === "secondary",
          "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-2xs": variant === "danger",
          "bg-[#16A34A] text-white hover:bg-[#15803D] shadow-2xs": variant === "success",
          "bg-transparent text-slate-600 hover:bg-slate-100": variant === "ghost"
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
