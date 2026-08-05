// src/pages/doctor/WebsiteManagement/AppointmentCtaCMS.jsx

import React, { useState } from "react";
import { Calendar } from "lucide-react";

export default function AppointmentCtaCMS() {
  const [cta, setCta] = useState({
    heading: "Book Your Dental Appointment Today",
    description: "Experience expert dental care with advanced diagnostics and pain-free treatments.",
    primaryBtnText: "Book Appointment",
    secondaryBtnText: "Call Us Now"
  });

  const handleCtaChange = (field, val) => {
    setCta((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveAll = () => {
    alert("Appointment CTA updated successfully!");
  };

  return (
    <div className="space-y-4 font-sans select-none w-full max-w-[1280px] mx-auto pb-8">
      {/* DIRECT APPOINTMENT CTA EDITOR */}
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xs p-6 md:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-[#2563EB]" />
            Appointment CTA Content
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={handleSaveAll} className="px-4 h-9 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-[#F8FAFC] cursor-pointer transition-all duration-150 outline-none active:scale-98 shadow-2xs">
              Save Draft
            </button>
            <button onClick={handleSaveAll} className="px-5 h-9 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-2xs transition-all duration-200 cursor-pointer outline-none active:scale-98">
              Publish
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Heading *
            </label>
            <input
              type="text"
              value={cta.heading}
              onChange={(e) => handleCtaChange("heading", e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs font-extrabold text-slate-900 outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              value={cta.description}
              onChange={(e) => handleCtaChange("description", e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] p-3 text-xs font-medium text-slate-700 outline-none focus:border-[#2563EB] leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Primary Button Text *
              </label>
              <input
                type="text"
                value={cta.primaryBtnText}
                onChange={(e) => handleCtaChange("primaryBtnText", e.target.value)}
                className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Secondary Button Text *
              </label>
              <input
                type="text"
                value={cta.secondaryBtnText}
                onChange={(e) => handleCtaChange("secondaryBtnText", e.target.value)}
                className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={handleSaveAll} className="px-4 h-9.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-[#F8FAFC] cursor-pointer transition-all duration-150 outline-none active:scale-98 shadow-2xs">
            Save Draft
          </button>
          <button onClick={handleSaveAll} className="px-5 h-9.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-2xs transition-all duration-200 cursor-pointer outline-none active:scale-98">
            Publish
          </button>
        </div>
      </div>

    </div>
  );
}
