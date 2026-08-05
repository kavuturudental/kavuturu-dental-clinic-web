// src/components/doctor/website/SectionEditorDrawer.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Sparkles,
  Upload,
  Trash2,
  Plus,
  GripVertical,
  Star
} from "lucide-react";

// Safe string formatter preventing object rendering errors inside inputs
const safeVal = (val, fallback = "") => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          if (item.day || item.time) return `${item.day || ""}: ${item.time || ""}`.trim();
          return JSON.stringify(item);
        }
        return String(item);
      })
      .filter(Boolean)
      .join(" | ");
  }
  if (typeof val === "object") {
    if (val.day || val.time) return `${val.day || ""}: ${val.time || ""}`.trim();
    return Object.entries(val)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" | ");
  }
  return fallback;
};

export default function SectionEditorDrawer({
  isOpen,
  onClose,
  section,
  data,
  onChange,
  onSave,
  onSaveDraft,
  onPublish
}) {
  if (!isOpen || !section) return null;

  const hero = data.hero || {};
  const stats = data.stats || {};
  const aboutPreview = data.aboutPreview || {};
  const ctaSection = data.ctaSection || {};
  const treatments = Array.isArray(data.treatments) ? data.treatments : [];
  const doctors = Array.isArray(data.doctors) ? data.doctors : [];
  const beforeAfter = Array.isArray(data.beforeAfter) ? data.beforeAfter : [];
  const testimonials = Array.isArray(data.testimonials) ? data.testimonials : [];
  const gallery = Array.isArray(data.gallery) ? data.gallery : [];
  const blogs = Array.isArray(data.blogs) ? data.blogs : [];
  const contact = data.contact || {};
  const footer = data.footer || {};

  const handleSimulatedImageUpload = (category, field) => {
    const fakeImages = [
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500",
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500"
    ];
    const randomImg = fakeImages[Math.floor(Math.random() * fakeImages.length)];
    if (category && field) {
      onChange(category, field, randomImg);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, x: 450 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 450 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] font-sans"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0E2A6D] text-white flex items-center justify-center font-bold shadow-md shadow-[#0E2A6D]/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                  Edit {section.name}
                </h3>
                <p className="text-[11px] font-medium text-slate-400">
                  {section.description}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

            {/* 1. HERO SECTION EDITOR */}
            {section.id === "hero" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0E2A6D] border-b pb-1.5 border-slate-100">
                    Banner Content
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Trust Badge Text
                    </label>
                    <input
                      type="text"
                      value={safeVal(hero.trustBadge)}
                      onChange={(e) => onChange("hero", "trustBadge", e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 focus:border-[#0E2A6D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Main Heading
                    </label>
                    <textarea
                      rows={2}
                      value={safeVal(hero.title)}
                      onChange={(e) => onChange("hero", "title", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-900 focus:border-[#0E2A6D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={safeVal(hero.subtitle)}
                      onChange={(e) => onChange("hero", "subtitle", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 focus:border-[#0E2A6D] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-extrabold text-[#0E2A6D] uppercase tracking-wider block">
                        Primary CTA Button
                      </span>
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={safeVal(hero.primaryCtaText)}
                        onChange={(e) => onChange("hero", "primaryCtaText", e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 px-2.5 text-xs font-bold text-slate-800 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Link URL"
                        value={safeVal(hero.primaryCtaLink)}
                        onChange={(e) => onChange("hero", "primaryCtaLink", e.target.value)}
                        className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-[11px] font-medium text-slate-500 outline-none"
                      />
                    </div>

                    <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                        Secondary CTA Button
                      </span>
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={safeVal(hero.secondaryCtaText)}
                        onChange={(e) => onChange("hero", "secondaryCtaText", e.target.value)}
                        className="w-full h-9 rounded-lg border border-slate-200 px-2.5 text-xs font-bold text-slate-800 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Link URL"
                        value={safeVal(hero.secondaryCtaLink)}
                        onChange={(e) => onChange("hero", "secondaryCtaLink", e.target.value)}
                        className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-[11px] font-medium text-slate-500 outline-none"
                      />
                    </div>
                  </div>
                </div>


                {/* Display Settings Toggles */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0E2A6D] border-b pb-1.5 border-slate-100">
                    Display Settings
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-bold text-slate-800">Show / Hide Trust Badge</span>
                      <button
                        type="button"
                        onClick={() => onChange("hero", "showTrustBadge", !hero.showTrustBadge)}
                        className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                          hero.showTrustBadge !== false ? "bg-[#16A34A] text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {hero.showTrustBadge !== false ? "VISIBLE" : "HIDDEN"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-bold text-slate-800">Show / Hide Hero Stats</span>
                      <button
                        type="button"
                        onClick={() => onChange("hero", "showStats", !hero.showStats)}
                        className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                          hero.showStats !== false ? "bg-[#16A34A] text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {hero.showStats !== false ? "VISIBLE" : "HIDDEN"}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. ABOUT PREVIEW EDITOR */}
            {section.id === "about" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={safeVal(aboutPreview.heading || aboutPreview.title)}
                    onChange={(e) => onChange("aboutPreview", "heading", e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-900 focus:border-[#0E2A6D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={4}
                    value={safeVal(aboutPreview.description)}
                    onChange={(e) => onChange("aboutPreview", "description", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 focus:border-[#0E2A6D] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={safeVal(aboutPreview.buttonText)}
                      onChange={(e) => onChange("aboutPreview", "buttonText", e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={safeVal(aboutPreview.buttonLink, "/about")}
                      onChange={(e) => onChange("aboutPreview", "buttonLink", e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. FEATURED TREATMENTS EDITOR */}
            {section.id === "treatments" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0E2A6D]">
                    Featured Treatments ({treatments.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newTrt = {
                        id: `trt-${Date.now()}`,
                        name: "New Dental Service",
                        shortDesc: "Comprehensive laser treatment procedure.",
                        image: "/assets/images/treatments/laser-root-canal.webp",
                        order: treatments.length + 1
                      };
                      onChange("treatments", null, [...treatments, newTrt]);
                    }}
                    className="px-3 h-8 rounded-xl bg-[#0E2A6D] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Treatment</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {treatments.map((trt, idx) => (
                    <div
                      key={trt.id || idx}
                      className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                          <input
                            type="text"
                            value={safeVal(trt.name)}
                            onChange={(e) => {
                              const updated = treatments.map((t) =>
                                t.id === trt.id ? { ...t, name: e.target.value } : t
                              );
                              onChange("treatments", null, updated);
                            }}
                            className="h-8 rounded-lg border border-slate-200 px-2 text-xs font-bold text-slate-900 outline-none focus:border-[#0E2A6D]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const filtered = treatments.filter((t) => t.id !== trt.id);
                            onChange("treatments", null, filtered);
                          }}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={safeVal(trt.shortDesc)}
                        onChange={(e) => {
                          const updated = treatments.map((t) =>
                            t.id === trt.id ? { ...t, shortDesc: e.target.value } : t
                          );
                          onChange("treatments", null, updated);
                        }}
                        className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-700 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. CONTACT EDITOR */}
            {section.id === "contact" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Clinic Address
                  </label>
                  <input
                    type="text"
                    value={safeVal(contact.address)}
                    onChange={(e) => onChange("contact", "address", e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={safeVal(contact.phone)}
                    onChange={(e) => onChange("contact", "phone", e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={safeVal(contact.email)}
                    onChange={(e) => onChange("contact", "email", e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={safeVal(contact.workingHours)}
                    onChange={(e) => onChange("contact", "workingHours", e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>
            )}

            {/* 10. FOOTER EDITOR */}
            {section.id === "footer" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Clinic Short Description
                  </label>
                  <textarea
                    rows={3}
                    value={safeVal(footer.shortDesc)}
                    onChange={(e) => onChange("footer", "shortDesc", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Copyright Text
                  </label>
                  <input
                    type="text"
                    value={safeVal(footer.copyrightText)}
                    onChange={(e) => onChange("footer", "copyrightText", e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 border-t border-[#E5E7EB] bg-slate-50/80 flex items-center justify-between gap-3">
            <button
              onClick={() => onSaveDraft(section.id)}
              className="px-3.5 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Save Draft
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onSave();
                  onClose();
                }}
                className="px-5 h-10 rounded-xl bg-[#0E2A6D] hover:bg-[#16398b] text-white text-xs font-bold transition-all shadow-md shadow-[#0E2A6D]/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Publish Section</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
