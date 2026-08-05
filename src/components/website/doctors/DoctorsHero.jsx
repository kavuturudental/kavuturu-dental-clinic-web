// src/components/doctors/DoctorsHero.jsx

import React from "react";
import { UserCheck } from "lucide-react";
import heroImage from "../../../assets/images/doctors/doctors-hero.webp";

const DoctorsHero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Our Doctors"
          className="h-full w-full object-cover object-right"
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
      <div className="relative z-10 mx-auto flex min-h-[480px] max-w-[1280px] items-center px-5 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 shadow-sm">
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Our Doctors
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-outfit text-4xl sm:text-[40px] md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900">
            Meet Tirupati's Trusted Dental Specialists
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
            Our experienced dental team combines advanced clinical expertise with compassionate,
            patient-focused care to help you and your family achieve healthy, beautiful smiles.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DoctorsHero;