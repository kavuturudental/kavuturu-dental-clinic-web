// src/pages/doctor/WebsiteManagement/Settings.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Settings, Save, ShieldCheck } from "lucide-react";
import websiteService from "../../../services/websiteService";
import SectionCardHeader from "../../../components/doctor/website/SectionCardHeader";

export default function SettingsCMS() {
  const { triggerToast } = useOutletContext() || {};
  const [data, setData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const content = websiteService.getSettings();
    setData(JSON.parse(JSON.stringify(content)));
  }, []);

  if (!data) return null;

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      websiteService.saveSettings(data);
      setIsSaving(false);
      if (triggerToast) triggerToast("Website global settings saved successfully!", "success");
    }, 500);
  };

  return (
    <div className="space-y-6 select-none w-full pb-12">
      
      {/* Section Header Card */}
      <SectionCardHeader
        icon={Settings}
        sectionName="Website Settings"
        description="Global clinic branding, site title, Google SEO metadata & footer copyright text"
        status="Published"
        lastUpdated="29 Jul 2026 • 08:00 AM"
        updatedBy="Dr. K. Ravindra Babu"
        latestActivity="Updated SEO meta title, keywords & clinic logo asset path"
        onSave={handleSaveAll}
        isSaving={isSaving}
      />

      {/* Branding Card */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.02)] space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#0E2A6D]" />
            Branding & Logos
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Clinic display title, header logo and favicon</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Official Clinic Name</label>
            <input type="text" value={data.branding.clinicName} onChange={(e) => setData({ ...data, branding: { ...data.branding, clinicName: e.target.value } })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#0E2A6D]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Logo Asset Path</label>
              <input type="text" value={data.branding.logoUrl} onChange={(e) => setData({ ...data, branding: { ...data.branding, logoUrl: e.target.value } })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#0E2A6D]" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Favicon Asset Path</label>
              <input type="text" value={data.branding.faviconUrl} onChange={(e) => setData({ ...data, branding: { ...data.branding, faviconUrl: e.target.value } })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#0E2A6D]" />
            </div>
          </div>
        </div>
      </div>

      {/* SEO Configuration Card */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.02)] space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0E2A6D]" />
            Search Engine Optimization (SEO)
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Global Google search engine meta tags and description</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Meta Title</label>
            <input type="text" value={data.seo.metaTitle} onChange={(e) => setData({ ...data, seo: { ...data.seo, metaTitle: e.target.value } })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#0E2A6D]" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Meta Description</label>
            <textarea rows={3} value={data.seo.metaDescription} onChange={(e) => setData({ ...data, seo: { ...data.seo, metaDescription: e.target.value } })} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#0E2A6D]" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Keywords (Comma Separated)</label>
            <input type="text" value={data.seo.metaKeywords} onChange={(e) => setData({ ...data, seo: { ...data.seo, metaKeywords: e.target.value } })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#0E2A6D]" />
          </div>
        </div>
      </div>

      {/* Footer Settings Card */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.02)] space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Footer Settings</h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Copyright notice and footer tagline notes</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Copyright Notice</label>
            <input type="text" value={data.footer.copyrightText} onChange={(e) => setData({ ...data, footer: { ...data.footer, copyrightText: e.target.value } })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#0E2A6D]" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Emergency Help Note</label>
            <input type="text" value={data.footer.emergencyNote} onChange={(e) => setData({ ...data, footer: { ...data.footer, emergencyNote: e.target.value } })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-[#0E2A6D]" />
          </div>
        </div>
      </div>
    </div>
  );
}
