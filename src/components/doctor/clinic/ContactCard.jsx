import React from "react";
import { Phone, Mail, MessageSquare } from "lucide-react";

export default function ContactCard({ contact, onChange, errors }) {
  const handleNestedChange = (field, value) => {
    onChange("contact", { ...contact, [field]: value });
  };

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#0E2A6D] tracking-tight">
          Contact Information
        </h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Update the clinic's contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Primary Mobile */}
        <div className="space-y-1.5">
          <label htmlFor="primaryPhone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Primary Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="primaryPhone"
              type="text"
              placeholder="e.g. 9876543210"
              value={contact.primaryPhone || ""}
              onChange={(e) => handleNestedChange("primaryPhone", e.target.value)}
              className={`h-11 w-full rounded-xl border pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
                errors?.primaryPhone ? "border-red-400 bg-red-50/20" : "border-slate-200"
              }`}
            />
          </div>
          {errors?.primaryPhone && (
            <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.primaryPhone}</p>
          )}
        </div>

        {/* Alternate Mobile */}
        <div className="space-y-1.5">
          <label htmlFor="alternatePhone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Alternate Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 opacity-60" />
            <input
              id="alternatePhone"
              type="text"
              placeholder="e.g. 8765432109"
              value={contact.alternatePhone || ""}
              onChange={(e) => handleNestedChange("alternatePhone", e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="clinicEmail" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="clinicEmail"
              type="email"
              placeholder="e.g. info@kavuturudental.com"
              value={contact.email || ""}
              onChange={(e) => handleNestedChange("email", e.target.value)}
              className={`h-11 w-full rounded-xl border pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
                errors?.email ? "border-red-400 bg-red-50/20" : "border-slate-200"
              }`}
            />
          </div>
          {errors?.email && (
            <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.email}</p>
          )}
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-1.5">
          <label htmlFor="clinicWhatsapp" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="clinicWhatsapp"
              type="text"
              placeholder="e.g. 9876543210"
              value={contact.whatsapp || ""}
              onChange={(e) => handleNestedChange("whatsapp", e.target.value)}
              className={`h-11 w-full rounded-xl border pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
                errors?.whatsapp ? "border-red-400 bg-red-50/20" : "border-slate-200"
              }`}
            />
          </div>
          {errors?.whatsapp && (
            <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.whatsapp}</p>
          )}
        </div>
      </div>
    </div>
  );
}
