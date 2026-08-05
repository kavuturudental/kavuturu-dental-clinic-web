import React from "react";
import { MapPin, Navigation } from "lucide-react";

export default function AddressCard({ address, onChange, errors }) {
  const handleNestedChange = (field, value) => {
    onChange("address", { ...address, [field]: value });
  };

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#0E2A6D] tracking-tight">
          Clinic Location
        </h3>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Update the clinic address and map information.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Address Line */}
        <div className="space-y-1.5 lg:col-span-8">
          <label htmlFor="addressLine" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            id="addressLine"
            type="text"
            placeholder="e.g. 1-123 Main Road, Near Clock Tower"
            value={address.line || ""}
            onChange={(e) => handleNestedChange("line", e.target.value)}
            className={`h-11 w-full rounded-xl border px-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
              errors?.line ? "border-red-400 bg-red-50/20" : "border-slate-200"
            }`}
          />
          {errors?.line && (
            <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.line}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-1.5 lg:col-span-4">
          <label htmlFor="addressCity" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="addressCity"
            type="text"
            placeholder="e.g. Kavuturu"
            value={address.city || ""}
            onChange={(e) => handleNestedChange("city", e.target.value)}
            className={`h-11 w-full rounded-xl border px-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
              errors?.city ? "border-red-400 bg-red-50/20" : "border-slate-200"
            }`}
          />
          {errors?.city && (
            <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div className="space-y-1.5 lg:col-span-6">
          <label htmlFor="addressState" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            State <span className="text-red-500">*</span>
          </label>
          <input
            id="addressState"
            type="text"
            placeholder="e.g. Andhra Pradesh"
            value={address.state || ""}
            onChange={(e) => handleNestedChange("state", e.target.value)}
            className={`h-11 w-full rounded-xl border px-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
              errors?.state ? "border-red-400 bg-red-50/20" : "border-slate-200"
            }`}
          />
          {errors?.state && (
            <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.state}</p>
          )}
        </div>

        {/* PIN Code */}
        <div className="space-y-1.5 lg:col-span-6">
          <label htmlFor="addressPin" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            PIN Code <span className="text-red-500">*</span>
          </label>
          <input
            id="addressPin"
            type="text"
            placeholder="e.g. 521343"
            value={address.pinCode || ""}
            onChange={(e) => handleNestedChange("pinCode", e.target.value)}
            className={`h-11 w-full rounded-xl border px-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5 ${
              errors?.pinCode ? "border-red-400 bg-red-50/20" : "border-slate-200"
            }`}
          />
          {errors?.pinCode && (
            <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.pinCode}</p>
          )}
        </div>

        {/* Maps Embed Link */}
        <div className="space-y-1.5 lg:col-span-12">
          <label htmlFor="addressMaps" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Google Maps Embed Link
          </label>
          <div className="relative">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="addressMaps"
              type="text"
              placeholder="e.g. https://maps.google.com/..."
              value={address.googleMapsLink || ""}
              onChange={(e) => handleNestedChange("googleMapsLink", e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none text-xs font-semibold transition-all focus:border-[#0E2A6D] focus:ring-4 focus:ring-[#0E2A6D]/5"
            />
          </div>
        </div>
      </div>

      {/* Map Preview Placeholder */}
      <div className="space-y-1.5 mt-2">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Google Maps Preview
        </span>
        <div className="h-36 w-full rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0e2a6d_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none"></div>
          <div className="absolute inset-x-0 top-1/3 h-[2px] bg-slate-200/60 rotate-6 pointer-events-none"></div>
          <div className="absolute inset-x-0 top-2/3 h-[2px] bg-slate-200/60 -rotate-12 pointer-events-none"></div>
          <div className="absolute left-1/3 inset-y-0 w-[2px] bg-slate-200/60 rotate-45 pointer-events-none"></div>
          <div className="absolute left-2/3 inset-y-0 w-[2px] bg-slate-200/60 -rotate-3 pointer-events-none"></div>
          
          <div className="flex flex-col items-center gap-1 z-10 transition-transform group-hover:scale-105 duration-300">
            <div className="w-8 h-8 rounded-full bg-[#0E2A6D]/10 flex items-center justify-center border border-[#0E2A6D]/20 animate-pulse">
              <MapPin className="w-4 h-4 text-[#0E2A6D]" />
            </div>
            <span className="text-[9px] font-bold text-[#0E2A6D] tracking-wide uppercase bg-white/90 border border-slate-100 px-2 py-0.5 rounded-lg shadow-sm">
              Kavuturu (AP)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
