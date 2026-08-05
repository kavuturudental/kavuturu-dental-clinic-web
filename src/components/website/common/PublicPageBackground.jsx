// src/components/website/common/PublicPageBackground.jsx

import React from "react";

/**
 * PublicPageBackground
 * Multi-layered, luxury dental background theme for public pages.
 * 
 * Layer 1: Base Color #FCFCFD (Soft Warm White)
 * Layer 2: Soft Radial Gradients (<5% opacity)
 * Layer 3: Large Abstract Flowing Curves (Edges only)
 * Layer 4: Extremely Thin Edge Wave Lines
 * Layer 5: Corner Dotted Grids (<5% opacity)
 * Layer 6: Light Circular Outlines (Edges only)
 * Layer 7: ONLY TWO Decorative Tooth Vector Icons (Upper-Left & Lower-Right at ~8% opacity)
 */
export const PublicPageBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
      
      {/* SVG Definitions for Shared Gradients */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <linearGradient id="glossyToothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#E0F2FE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="edgeWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0.02" />
          </linearGradient>
        </defs>
      </svg>

      {/* LAYER 2: Soft Ambient Radial Gradients (<5% opacity) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-gradient-to-b from-[#2563EB]/[0.035] via-[#38BDF8]/[0.02] to-transparent blur-3xl" />
      <div className="absolute top-[28%] -left-36 w-[600px] h-[600px] rounded-full bg-[#2563EB]/[0.025] blur-3xl" />
      <div className="absolute top-[55%] -right-36 w-[650px] h-[650px] rounded-full bg-[#38BDF8]/[0.025] blur-3xl" />
      <div className="absolute bottom-[10%] left-1/4 w-[750px] h-[750px] rounded-full bg-gradient-to-t from-[#2563EB]/[0.03] to-transparent blur-3xl" />

      {/* LAYER 3 & 4: Large Flowing Curves & Thin Edge Wave Lines (Outer Margins Only) */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 lg:w-48 overflow-hidden">
        <svg className="h-full w-full opacity-60" viewBox="0 0 100 1200" preserveAspectRatio="none" fill="none">
          <path d="M-20 0 C40 300 -10 600 50 900 C15 1050 30 1200 -20 1200" stroke="url(#edgeWaveGrad)" strokeWidth="1.5" />
          <path d="M-10 100 C30 350 0 650 35 950 C10 1100 20 1200 -10 1200" stroke="#2563EB" strokeOpacity="0.025" strokeWidth="1" strokeDasharray="6 6" />
        </svg>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 lg:w-48 overflow-hidden">
        <svg className="h-full w-full opacity-60" viewBox="0 0 100 1200" preserveAspectRatio="none" fill="none">
          <path d="M120 0 C60 300 110 600 50 900 C85 1050 70 1200 120 1200" stroke="url(#edgeWaveGrad)" strokeWidth="1.5" />
          <path d="M110 100 C70 350 100 650 65 950 C90 1100 80 1200 110 1200" stroke="#2563EB" strokeOpacity="0.025" strokeWidth="1" strokeDasharray="6 6" />
        </svg>
      </div>

      {/* LAYER 5: Corner Dotted Grids (Opacity under 5%) */}
      <div 
        className="absolute top-6 left-6 w-48 h-48 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(14, 42, 109, 0.5) 1px, transparent 0)`,
          backgroundSize: "20px 20px"
        }}
      />
      <div 
        className="absolute top-6 right-6 w-48 h-48 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(14, 42, 109, 0.5) 1px, transparent 0)`,
          backgroundSize: "20px 20px"
        }}
      />
      <div 
        className="absolute bottom-12 left-6 w-48 h-48 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(14, 42, 109, 0.5) 1px, transparent 0)`,
          backgroundSize: "20px 20px"
        }}
      />
      <div 
        className="absolute bottom-12 right-6 w-48 h-48 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(14, 42, 109, 0.5) 1px, transparent 0)`,
          backgroundSize: "20px 20px"
        }}
      />

      {/* LAYER 6: Light Circular Outlines (Edges Only) */}
      <div className="absolute top-24 -left-20 w-72 h-72 rounded-full border border-blue-400/[0.04]" />
      <div className="absolute top-28 -left-12 w-56 h-56 rounded-full border border-sky-300/[0.04]" />
      <div className="absolute bottom-36 -right-24 w-96 h-96 rounded-full border border-blue-400/[0.04]" />
      <div className="absolute bottom-44 -right-14 w-72 h-72 rounded-full border border-sky-300/[0.04]" />

      {/* LAYER 7: ONLY TWO DECORATIVE TEETH */}
      
      {/* TOOTH 1: Upper-Left Area (Glossy White, ~8% Opacity) */}
      <div className="absolute top-28 left-4 lg:left-12 opacity-[0.08] transition-opacity duration-300">
        <svg width="220" height="260" viewBox="0 0 100 120" fill="url(#glossyToothGrad)" stroke="#2563EB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50 15 C35 15 22 25 22 42 C22 58 30 75 35 95 C38 105 44 105 46 95 C48 85 50 78 50 78 C50 78 52 85 54 95 C56 105 62 105 65 95 C70 75 78 58 78 42 C78 25 65 15 50 15 Z" />
          <path d="M38 35 C42 32 58 32 62 35" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* TOOTH 2: Lower-Right Area (Glossy White, ~8% Opacity) */}
      <div className="absolute bottom-48 right-4 lg:right-12 opacity-[0.08] transition-opacity duration-300">
        <svg width="240" height="280" viewBox="0 0 100 120" fill="url(#glossyToothGrad)" stroke="#2563EB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50 15 C35 15 22 25 22 42 C22 58 30 75 35 95 C38 105 44 105 46 95 C48 85 50 78 50 78 C50 78 52 85 54 95 C56 105 62 105 65 95 C70 75 78 58 78 42 C78 25 65 15 50 15 Z" />
          <path d="M38 35 C42 32 58 32 62 35" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" strokeDasharray="3 3" />
        </svg>
      </div>

    </div>
  );
};

export default PublicPageBackground;
