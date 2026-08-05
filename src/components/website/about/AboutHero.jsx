// src/components/about/AboutHero.jsx

import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import heroImage from "../../../assets/images/about/about-hero-reception.webp";
import { getAboutContent } from "../../../services/website/aboutService";

const AboutHero = () => {
  const [content, setContent] = useState({
    heading: "Dedicated to Excellence in Dental Care",
    description: "For over 14 years, Kavuturu Dental Clinic has provided painless, modern dental care in Tirupati. With advanced laser technology, expert doctors, and personalized treatment plans, your smile is our highest responsibility."
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await getAboutContent();
        if (response.success && response.data) {
          setContent({
            heading: response.data.heading || "Dedicated to Excellence in Dental Care",
            description: response.data.description || "For over 14 years, Kavuturu Dental Clinic has provided painless, modern dental care in Tirupati."
          });
        }
      } catch (err) {
        console.error("Failed to load backend About Hero data:", err);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Background Image & Overlays matching inner page hero standard */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="About Kavuturu Dental Clinic"
          className="h-full w-full object-cover object-right"
        />

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-white/20" />

        {/* Left White Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />

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
            <Info className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              About Us
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-outfit text-4xl sm:text-[40px] md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900">
            {content.heading}
          </h1>

          {/* Subtitle / Description */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
            {content.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;