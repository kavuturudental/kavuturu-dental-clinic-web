// src/components/home/contact/ContactCard.jsx

import React from "react";

export const ContactCard = ({ icon: Icon, title, description, children, colorClass = "bg-sky-50 text-sky-600 border-sky-100" }) => {
  return (
    <div className="flex gap-4 rounded-3xl border border-slate-200/80 bg-white p-5.5 shadow-[0_8px_30px_rgba(14,42,109,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(14,42,109,0.08)] hover:border-sky-300">
      {/* Icon Container badge */}
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border ${colorClass}`}>
        <Icon size={18} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0 flex-1">
        {/* Card Title */}
        <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </h3>

        {/* Main content slot */}
        <div className="mt-1.5 text-[14px] font-semibold text-slate-800 leading-relaxed break-words">
          {children}
        </div>

        {/* Muted supporting information */}
        {description && (
          <p className="mt-1.5 text-[11px] font-medium text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
