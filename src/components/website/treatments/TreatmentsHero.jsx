// src/components/treatments/TreatmentsHero.jsx

import React from "react";
import { Stethoscope } from "lucide-react";
import heroImage from "../../../assets/images/treatments/hero.webp";

const TreatmentsHero = () => {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Advanced Dental Treatments"
          className="h-full w-full object-cover object-center"
        />

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-white/20" />

        {/* Left Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />

        {/* Top Fade */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/60 to-transparent" />

        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[480px] max-w-[1280px] items-center px-5 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 shadow-sm">
            <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Our Treatments
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-outfit text-4xl sm:text-[40px] md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900">
            Advanced Dental Treatments
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
            Experience comprehensive dental care using advanced technology,
            laser dentistry, dental implants, cosmetic smile enhancements,
            orthodontics, and preventive treatments designed for healthy,
            confident smiles.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TreatmentsHero;