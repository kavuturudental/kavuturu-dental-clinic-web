// src/pages/doctor/WebsiteManagement/About.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Info, Globe, Heading, FileText, Check, Loader2, AlertCircle } from "lucide-react";
import aboutService from "../../../services/website/aboutService";

export default function AboutCMS() {
  const { triggerToast, handlePreviewWebsite } = useOutletContext() || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await aboutService.getAboutContent();
      const about = response.data || {};

      setHeading(about.heading || about.title || "");
      setDescription(about.description || about.subtitle || "");
    } catch (err) {
      console.error("Failed to fetch About content:", err);
      setLoadError("Failed to load About section content from backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    const newErrors = {};
    const trimmedHeading = heading.trim();
    const trimmedDesc = description.trim();

    if (!trimmedHeading) {
      newErrors.heading = "About Heading is required.";
    }

    if (!trimmedDesc) {
      newErrors.description = "About Description is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      if (triggerToast) triggerToast(firstError, "error");
      return;
    }

    setErrors({});
    setSaving(true);

    const payload = {
      heading: trimmedHeading,
      description: trimmedDesc
    };

    try {
      await aboutService.updateAboutContent(payload);
      if (triggerToast) triggerToast("About section updated successfully!", "success");
    } catch (err) {
      console.error("Save About API Error:", err);
      const errMsg = err.message || "Failed to update About section. Please try again.";
      if (triggerToast) triggerToast(errMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto py-16 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
        <span className="text-xs font-semibold">Loading About Section from backend...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full max-w-[1280px] mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-sm font-bold text-red-900">{loadError}</h3>
          <button
            type="button"
            onClick={loadData}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 select-none font-sans w-full max-w-[1280px] mx-auto pb-8">
      {/* ABOUT CONTENT CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#2563EB]" />
              About Content
            </h2>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">Manage heading and description for About section.</p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4.5 h-9 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400" />
            )}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Heading */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Heading *
            </label>
            <div className="relative">
              <Heading className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={heading}
                onChange={(e) => {
                  setHeading(e.target.value);
                  if (errors.heading) setErrors(prev => ({ ...prev, heading: "" }));
                }}
                required
                placeholder="e.g. Creating Healthy, Confident Smiles Every Day"
                className={`h-9.5 w-full rounded-xl border ${errors.heading ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-slate-50/60"} pl-10 pr-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white transition-all`}
              />
            </div>
            {errors.heading && (
              <p className="text-[10px] font-semibold text-red-500 mt-1">{errors.heading}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: "" }));
                }}
                required
                placeholder="At Kavuturu Dental Clinic, we are committed to providing advanced, comfortable, and personalized dental care for every patient..."
                className={`w-full rounded-xl border ${errors.description ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-slate-50/60"} pl-10 pr-3.5 pt-2.5 font-medium text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white leading-relaxed transition-all`}
              />
            </div>
            {errors.description && (
              <p className="text-[10px] font-semibold text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

        </form>
      </div>

    </div>
  );
}
