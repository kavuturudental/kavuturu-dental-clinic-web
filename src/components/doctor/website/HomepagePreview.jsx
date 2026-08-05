// src/components/doctor/website/HomepagePreview.jsx

import React, { useRef, useEffect } from "react";
import SafeImage from "./SafeImage";
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Lock,
  RotateCw,
  X,
  ChevronRight,
  Star,
  Sparkles,
  PhoneCall,
  Calendar,
  MapPin,
  Clock,
  Stethoscope,
  Users,
  Award,
  Image as ImageIcon,
  FileText,
  Mail
} from "lucide-react";

// Safe text helper
const safeText = (val, fallback = "") => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string" || typeof val === "number") return String(val);
  return fallback;
};

// Render matching icon for stat card
const renderStatIcon = (iconName) => {
  switch (iconName) {
    case "users":
      return <Users className="w-4 h-4 text-[#0E2A6D]" />;
    case "calendar":
      return <Calendar className="w-4 h-4 text-[#0E2A6D]" />;
    case "award":
      return <Award className="w-4 h-4 text-[#16A34A]" />;
    case "star":
      return <Star className="w-4 h-4 fill-amber-400 text-amber-400" />;
    case "stethoscope":
      return <Stethoscope className="w-4 h-4 text-[#0E2A6D]" />;
    case "sparkles":
    default:
      return <Sparkles className="w-4 h-4 text-[#0E2A6D]" />;
  }
};

export default function HomepagePreview({
  isOpen,
  onClose,
  previewMode,
  setPreviewMode,
  selectedSectionId,
  homepageData
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen && selectedSectionId && containerRef.current) {
      setTimeout(() => {
        const targetElement = containerRef.current.querySelector(
          `[data-section-id="${selectedSectionId}"]`
        );
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [isOpen, selectedSectionId]);

  if (!isOpen) return null;

  const getContainerWidthClass = () => {
    switch (previewMode) {
      case "mobile":
        return "w-[375px]";
      case "tablet":
        return "w-[768px]";
      case "desktop":
      default:
        return "w-full max-w-[1280px]";
    }
  };

  const hero = homepageData?.hero || {};
  const statCards = Array.isArray(homepageData?.statCards)
    ? homepageData.statCards.filter((s) => s && s.enabled !== false)
    : [];
  const aboutPreview = homepageData?.aboutPreview || {};
  const appointmentCta = homepageData?.appointmentCta || {};
  const treatments = Array.isArray(homepageData?.treatments) ? homepageData.treatments : [];
  const doctors = Array.isArray(homepageData?.doctors)
    ? homepageData.doctors.filter((d) => d && d.displayOnHomepage !== false)
    : [];
  const beforeAfter = Array.isArray(homepageData?.beforeAfter)
    ? homepageData.beforeAfter.filter((ba) => ba && ba.displayOnHomepage !== false)
    : [];
  const testimonials = Array.isArray(homepageData?.testimonials)
    ? homepageData.testimonials.filter((t) => t && t.displayOnHomepage !== false)
    : [];
  const gallery = Array.isArray(homepageData?.gallery)
    ? homepageData.gallery.filter((g) => g && g.displayOnHomepage !== false)
    : [];
  const blogs = Array.isArray(homepageData?.blogs)
    ? homepageData.blogs.slice(0, 2)
    : [];
  const contact = homepageData?.contact || {};
  const footer = homepageData?.footer || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col font-sans select-none animate-fade-in">
      
      {/* Top Controls */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span className="text-sm font-extrabold tracking-tight">Live Website Preview</span>
          
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1 text-[11px] text-slate-300 font-mono">
            <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span>https://kavuturudental.com</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === "desktop" ? "bg-white text-[#0E2A6D] shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Desktop</span>
            </button>

            <button
              onClick={() => setPreviewMode("tablet")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === "tablet" ? "bg-white text-[#0E2A6D] shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Tablet</span>
            </button>

            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === "mobile" ? "bg-white text-[#0E2A6D] shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Mobile</span>
            </button>
          </div>

          <div className="w-px h-5 bg-slate-700 mx-1"></div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 flex justify-center bg-slate-950/60 custom-scrollbar">
        <div
          ref={containerRef}
          className={`${getContainerWidthClass()} transition-all duration-300 bg-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-full flex flex-col`}
        >
          {/* Public Navbar */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0E2A6D] text-white flex items-center justify-center font-black text-sm">
                K
              </div>
              <div>
                <span className="font-extrabold text-sm text-[#0E2A6D] block leading-tight">
                  Kavuturu Dental
                </span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest block">
                  Laser Center
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
              <span className="text-[#0E2A6D] font-bold">Home</span>
              <span>About</span>
              <span>Treatments</span>
              <span>Doctors</span>
              <span>Gallery</span>
              <span>Contact</span>
            </nav>

            <button className="px-3.5 py-1.5 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-xs">
              Book Appointment
            </button>
          </header>

          {/* 1. HERO SECTION & DYNAMIC STAT CARDS */}
          <section data-section-id="hero" className={`p-8 md:p-12 border-b border-slate-100 ${selectedSectionId === "hero" ? "bg-[#0E2A6D]/[0.03] ring-2 ring-[#0E2A6D]" : ""}`}>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                {hero.showTrustBadge !== false && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E2A6D]/10 text-[#0E2A6D] text-[11px] font-extrabold">
                    <Sparkles className="w-3.5 h-3.5 text-[#0E2A6D]" />
                    {safeText(hero.trustBadge, "Advanced Laser Dental Center")}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                  {safeText(hero.title, "Painless Laser Dentistry & Advanced Dental Care")}
                </h1>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {safeText(hero.subtitle, "Experience world-class dental care in Eluru with Dr. K. Ravindra Babu.")}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button className="px-5 py-2.5 rounded-xl bg-[#0E2A6D] text-white text-xs font-bold shadow-md shadow-[#0E2A6D]/20">
                    {safeText(hero.primaryCtaText, "Book Appointment")}
                  </button>
                  <button className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                    {safeText(hero.secondaryCtaText, "Explore Treatments")}
                  </button>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="w-56 h-64 rounded-3xl bg-gradient-to-tr from-[#0E2A6D] to-blue-500 p-1 relative overflow-hidden shadow-xl">
                  <SafeImage
                    src={hero.heroImage || "/assets/images/doctors/dr-ravindra-babu.webp"}
                    alt="Hero Visual"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC HERO STATISTIC CARDS */}
            {statCards.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((sc, idx) => (
                  <div key={sc.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-extrabold text-[#0E2A6D]">{safeText(sc.number)}</div>
                      <div className="p-1.5 rounded-lg bg-white border border-slate-100">{renderStatIcon(sc.icon)}</div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">{safeText(sc.label)}</div>
                    {sc.description && <p className="text-[9px] text-slate-400 font-medium line-clamp-1">{sc.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 2. ABOUT PREVIEW */}
          <section data-section-id="about" className={`p-8 border-b border-slate-100 ${selectedSectionId === "about" ? "bg-[#0E2A6D]/[0.03] ring-2 ring-[#0E2A6D]" : ""}`}>
            <div className="max-w-3xl mx-auto space-y-3 text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0E2A6D]">About Our Clinic</span>
              <h2 className="text-xl font-extrabold text-slate-900">{safeText(aboutPreview.heading, "Eluru's Most Trusted Dental Care Center")}</h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">{safeText(aboutPreview.description)}</p>
            </div>
          </section>

          {/* 3. FEATURED TREATMENTS PREVIEW */}
          <section data-section-id="treatments" className={`p-8 border-b border-slate-100 ${selectedSectionId === "treatments" ? "bg-[#0E2A6D]/[0.03] ring-2 ring-[#0E2A6D]" : ""}`}>
            <div className="max-w-4xl mx-auto space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0E2A6D] block text-center">Our Specialties</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {treatments.slice(0, 6).map((trt, idx) => (
                  <div key={trt.id || idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-[#0E2A6D]/10 text-[#0E2A6D] flex items-center justify-center font-bold">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{safeText(trt.name)}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{safeText(trt.shortDesc)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer data-section-id="footer" className="p-6 bg-slate-900 text-slate-400 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-white font-extrabold text-sm block">Kavuturu Dental Clinic</span>
                <span className="text-[10px]">{safeText(footer.shortDesc)}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">{safeText(footer.copyrightText)}</div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
