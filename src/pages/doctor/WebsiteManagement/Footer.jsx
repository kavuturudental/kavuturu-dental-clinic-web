// src/pages/doctor/WebsiteManagement/Footer.jsx

import React, { useState } from "react";

export default function FooterCMS() {
  const [data, setData] = useState({
    shortDesc: "Kavuturu Dental Clinic provides compassionate, world-class endodontic and general dental treatments in Tirupati.",
    contactInfo: {
      address: "Gandhi Road, Near RTC Bus Stand, Tirupati",
      phone: "+91 98765 43210",
      email: "contact@kavuturudental.com"
    },
    socialLinks: {
      facebook: "https://facebook.com/kavuturudental",
      instagram: "https://instagram.com/kavuturudental"
    },
    copyrightText: "© 2026 Kavuturu Dental Clinic. All Rights Reserved.",
    privacyPolicyUrl: "/privacy-policy",
    termsConditionsUrl: "/terms-and-conditions"
  });

  const handleSaveAll = () => {
    alert("Footer content saved successfully!");
  };

  return (
    <div className="space-y-4 font-sans select-none w-full max-w-[1280px] mx-auto pb-8">
      {/* DIRECT FOOTER EDITOR */}
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xs p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-sm font-extrabold text-slate-900">Footer Settings</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleSaveAll} className="px-4 h-9 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-slate-700 hover:bg-[#F8FAFC] cursor-pointer transition-all duration-150 outline-none active:scale-98 shadow-2xs">
              Save Draft
            </button>
            <button onClick={handleSaveAll} className="px-5 h-9 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-2xs hover:bg-[#1D4ED8] cursor-pointer transition-all duration-200 outline-none active:scale-98">
              Publish
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Footer Description *
          </label>
          <textarea
            rows={3}
            value={data.shortDesc}
            onChange={(e) => setData({ ...data, shortDesc: e.target.value })}
            className="w-full rounded-xl border border-[#E5E7EB] p-3 text-xs font-medium text-slate-700 outline-none focus:border-[#2563EB] leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Contact Details (Address / Phone / Email)
            </label>
            <input
              type="text"
              value={data.contactInfo?.address || ""}
              onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, address: e.target.value } })}
              className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Social Media Links (Facebook / Instagram)
            </label>
            <input
              type="text"
              value={data.socialLinks?.facebook || ""}
              onChange={(e) => setData({ ...data, socialLinks: { ...data.socialLinks, facebook: e.target.value } })}
              className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Copyright *
            </label>
            <input
              type="text"
              value={data.copyrightText}
              onChange={(e) => setData({ ...data, copyrightText: e.target.value })}
              className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Privacy Policy Link
            </label>
            <input
              type="text"
              value={data.privacyPolicyUrl || ""}
              onChange={(e) => setData({ ...data, privacyPolicyUrl: e.target.value })}
              className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Terms & Conditions Link
            </label>
            <input
              type="text"
              value={data.termsConditionsUrl || ""}
              onChange={(e) => setData({ ...data, termsConditionsUrl: e.target.value })}
              className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={handleSaveAll} className="px-4 h-9.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-slate-700 hover:bg-[#F8FAFC] cursor-pointer transition-all duration-150 outline-none active:scale-98 shadow-2xs">
            Save Draft
          </button>
          <button onClick={handleSaveAll} className="px-5 h-9.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-2xs hover:bg-[#1D4ED8] cursor-pointer transition-all duration-200 outline-none active:scale-98">
            Publish
          </button>
        </div>
      </div>

    </div>
  );
}
