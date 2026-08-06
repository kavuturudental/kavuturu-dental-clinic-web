// src/pages/doctor/WebsiteManagement/HeroCMS.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Sparkles, Globe, ShieldCheck, Heading, FileText, Check, BarChart3, Tag, Loader2, AlertCircle } from "lucide-react";
import heroService from "../../../services/website/heroService";

const DEFAULT_STATS = [
  { value: "20,000+", title: "RCTs Completed", subtitle: "" },
  { value: "14+", title: "Years of Clinical Experience", subtitle: "" },
  { value: "5★", title: "Google Rating", subtitle: "" },
  { value: "Trusted Dental Care", title: "in Tirupati", subtitle: "" }
];

export default function HeroCMS() {
  const { triggerToast, handlePreviewWebsite } = useOutletContext() || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [trustBadge, setTrustBadge] = useState("");
  const [heading, setHeading] = useState("");
  const [accentSubheading, setAccentSubheading] = useState("");
  const [description, setDescription] = useState("");
  
  // 4 Fixed Statistic Cards
  const [stats, setStats] = useState(DEFAULT_STATS);

  // Field validation error states
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await heroService.getHeroContent();
      const hero = response.data || {};

      setTrustBadge(hero.trustBadge || hero.badge || "");
      setHeading(hero.heading || hero.title || "");
      setAccentSubheading(hero.accentSubheading || "");
      setDescription(hero.description || hero.subtitle || "");
      
      if (Array.isArray(hero.stats) && hero.stats.length === 4) {
        setStats(hero.stats.map(s => ({
          value: s.value || "",
          title: s.title || "",
          subtitle: s.subtitle || ""
        })));
      } else {
        setStats(DEFAULT_STATS);
      }
    } catch (err) {
      console.error("Failed to fetch Hero content:", err);
      setLoadError("Failed to load Hero section content from backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatChange = (index, field, value) => {
    setStats((prevStats) => {
      const newStats = [...prevStats];
      newStats[index] = { ...newStats[index], [field]: value };
      return newStats;
    });

    // Clear validation error on change
    if (errors[`stat_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`stat_${index}_${field}`]: "" }));
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    const newErrors = {};

    // 1. Trim Inputs
    const trimmedBadge = trustBadge.trim();
    const trimmedHeading = heading.trim();
    const trimmedAccent = accentSubheading.trim();
    const trimmedDesc = description.trim();

    // 2. Validate Hero Content Fields
    if (!trimmedBadge) newErrors.trustBadge = "Trust Badge is required.";
    if (!trimmedHeading) newErrors.heading = "Hero Heading is required.";
    if (!trimmedAccent) newErrors.accentSubheading = "Accent Subheading is required.";
    if (!trimmedDesc) newErrors.description = "Hero Description is required.";

    // 3. Validate All 4 Hero Statistics
    const trimmedStats = [];
    for (let i = 0; i < 4; i++) {
      const val = (stats[i]?.value || "").trim();
      const ttl = (stats[i]?.title || "").trim();
      const sub = (stats[i]?.subtitle || "").trim();

      if (!val) newErrors[`stat_${i}_value`] = `Stat ${i + 1} Value is required.`;
      if (!ttl) newErrors[`stat_${i}_title`] = `Stat ${i + 1} Title is required.`;

      trimmedStats.push({
        value: val,
        title: ttl,
        subtitle: sub
      });
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
      trustBadge: trimmedBadge,
      heading: trimmedHeading,
      accentSubheading: trimmedAccent,
      description: trimmedDesc,
      stats: trimmedStats
    };

    try {
      await heroService.updateHeroContent(payload);
      if (triggerToast) triggerToast("Hero banner & Hero statistics updated successfully!", "success");
    } catch (err) {
      console.error("Save Hero API Error:", err);
      const errMsg = err.message || "Failed to update Hero content. Please try again.";
      if (triggerToast) triggerToast(errMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto py-16 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
        <span className="text-xs font-semibold">Loading Hero Section from backend...</span>
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
      <form onSubmit={handleSave} className="space-y-5">
        
        {/* HERO CONTENT CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Heading className="w-4 h-4 text-[#2563EB]" />
              Hero Content
            </h2>

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
          <p className="text-[11px] text-slate-500 font-normal mt-1">Edit the main headline, badge, and description.</p>

          {/* Two-Column Layout: Trust Badge & Accent Heading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                1. Trust Badge *
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={trustBadge}
                  onChange={(e) => {
                    setTrustBadge(e.target.value);
                    if (errors.trustBadge) setErrors(prev => ({ ...prev, trustBadge: "" }));
                  }}
                  required
                  placeholder="e.g. EXPERT CARE. ADVANCED TECHNOLOGY."
                  className={`h-9.5 w-full rounded-xl border ${errors.trustBadge ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-slate-50/60"} pl-10 pr-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white transition-all`}
                />
              </div>
              {errors.trustBadge && (
                <p className="text-[10px] font-semibold text-red-500 mt-1">{errors.trustBadge}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                3. Accent Heading *
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={accentSubheading}
                  onChange={(e) => {
                    setAccentSubheading(e.target.value);
                    if (errors.accentSubheading) setErrors(prev => ({ ...prev, accentSubheading: "" }));
                  }}
                  required
                  placeholder="e.g. for a Healthier, Happier Smile"
                  className={`h-9.5 w-full rounded-xl border ${errors.accentSubheading ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-slate-50/60"} pl-10 pr-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white transition-all`}
                />
              </div>
              {errors.accentSubheading && (
                <p className="text-[10px] font-semibold text-red-500 mt-1">{errors.accentSubheading}</p>
              )}
            </div>
          </div>

          {/* Main Heading (Full Width) */}
          <div className="text-xs">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              2. Main Heading *
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
                placeholder="e.g. Advanced Laser & Implant Dentistry"
                className={`h-9.5 w-full rounded-xl border ${errors.heading ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-slate-50/60"} pl-10 pr-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white transition-all`}
              />
            </div>
            {errors.heading && (
              <p className="text-[10px] font-semibold text-red-500 mt-1">{errors.heading}</p>
            )}
          </div>

          {/* Description (Multiline) */}
          <div className="text-xs">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              4. Description (Multiline) *
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={3}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: "" }));
                }}
                required
                placeholder="e.g. Painless treatments. Beautiful smiles.&#10;Personalized care for you and your family."
                className={`w-full rounded-xl border ${errors.description ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-slate-50/60"} pl-10 pr-3.5 pt-2.5 font-medium text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white leading-relaxed transition-all`}
              />
            </div>
            {errors.description && (
              <p className="text-[10px] font-semibold text-red-500 mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* 3. NEW SECTION: HERO STATISTICS (Fixed 4 Cards) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#0E2A6D]" />
              Hero Statistics
            </h2>
            <p className="text-[11px] text-slate-500 font-normal">
              Manage the 4 fixed website statistic cards displayed below the hero banner.
            </p>
          </div>

          {/* 4 Fixed Editable Statistic Cards (2x2 Grid on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-xs font-extrabold text-[#0E2A6D] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center text-[11px] font-black">
                      {index + 1}
                    </span>
                    Statistic {index + 1}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Value Input */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Value *
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(index, "value", e.target.value)}
                      required
                      placeholder="e.g. 20,000+ or 25+ Years"
                      className={`h-9 w-full rounded-lg border ${errors[`stat_${index}_value`] ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-white"} px-3 font-extrabold text-slate-900 outline-none focus:border-[#0E2A6D]`}
                    />
                    {errors[`stat_${index}_value`] && (
                      <p className="text-[10px] font-semibold text-red-500 mt-1">{errors[`stat_${index}_value`]}</p>
                    )}
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={stat.title}
                      onChange={(e) => handleStatChange(index, "title", e.target.value)}
                      required
                      placeholder="e.g. RCTs Completed or Google Rating"
                      className={`h-9 w-full rounded-lg border ${errors[`stat_${index}_title`] ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-white"} px-3 font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]`}
                    />
                    {errors[`stat_${index}_title`] && (
                      <p className="text-[10px] font-semibold text-red-500 mt-1">{errors[`stat_${index}_title`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </form>

    </div>
  );
}
