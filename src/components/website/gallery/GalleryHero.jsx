// src/components/gallery/GalleryHero.jsx

import React from "react";
import { Image as ImageIcon } from "lucide-react";
import heroImage from "../../../assets/images/gallery/gallery-hero-tooth-family-selfie.webp";

const GalleryHero = () => {
  return (
    <section
      className="relative isolate overflow-hidden bg-white"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background Overlays & Gradients for text readability & blending */}
      <div className="absolute inset-0 -z-10 bg-white/25" aria-hidden="true" />
      
      {/* Left-to-Right white gradient to make text readable */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/80 to-transparent"
        aria-hidden="true"
      />

      {/* Top & Bottom Fades for page consistency */}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-white/60 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-white via-white/50 to-transparent"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex min-h-[480px] max-w-[1280px] items-center px-5 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 shadow-sm">
            <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Gallery
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-outfit text-4xl sm:text-[40px] md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900">
            Explore Our <br />
            <span className="text-[#0E2A6D]">Dental Gallery</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
            Take a closer look inside Kavuturu Dental Clinic through our collection of modern facilities,
            advanced technology, expert doctors, patient care moments, and comfortable treatment spaces.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GalleryHero;
