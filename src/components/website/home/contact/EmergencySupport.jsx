// src/components/home/contact/EmergencySupport.jsx

import React from "react";
import { HeartPulse, PhoneCall } from "lucide-react";
import { contactData } from "../../../../data/website/contactData";

export const EmergencySupport = () => {
  const { emergency } = contactData;

  return (
    <div className="overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50/40 via-white to-rose-50/10 p-6 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.05)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        
        {/* Left Side Info */}
        <div className="flex items-start gap-4 text-left">
          {/* Heart/Pulse Badge */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md shadow-rose-500/20">
            <HeartPulse size={24} className="animate-pulse" />
          </div>
          <div>
            <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700">
              {emergency.badge}
            </span>
            <h3 className="mt-2 text-lg font-extrabold text-slate-900 font-outfit">
              Need Immediate Assistance?
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-xl leading-relaxed">
              Our team is here to help you with appointments and dental emergencies during clinic hours.
            </p>
          </div>
        </div>

        {/* Right Side CTA Button */}
        <div className="flex-shrink-0">
          <a
            href={contactData.callUrl}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-650 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-rose-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 active:translate-y-0 cursor-pointer"
          >
            <PhoneCall size={16} />
            <span>Call Support Line</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default EmergencySupport;
