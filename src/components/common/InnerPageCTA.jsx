// src/components/common/InnerPageCTA.jsx

import React from "react";
import { Calendar, Phone } from "lucide-react";
import { useAppointment } from "../website/bookAppointment";
import ctaData from "../../data/website/ctaData";

const InnerPageCTA = () => {
  const { openModal } = useAppointment();

  return (
    <section className="bg-[#FCFCFD] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0E2A6D] via-[#0B235A] to-[#07173D] px-6 py-12 sm:px-12 md:py-16 text-center md:text-left shadow-[0_25px_60px_rgba(14,42,109,0.18)]">
          {/* Background Ambient Glows */}
          <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
            {/* Left Content Column */}
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md border border-white/10 shadow-sm">
                {ctaData.badge}
              </span>
              
              <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-white font-outfit leading-tight tracking-tight">
                {ctaData.heading}
              </h2>
              
              <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed">
                {ctaData.description}
              </p>
            </div>

            {/* Right Action Column */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openModal()}
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-secondary px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white whitespace-nowrap shadow-lg shadow-green-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary-dark hover:shadow-xl hover:shadow-green-500/30 cursor-pointer w-full sm:w-auto"
              >
                <span className="whitespace-nowrap">{ctaData.primaryButton.label}</span>
                <Calendar size={18} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
              </button>

              {ctaData.secondaryButton && (
                <a
                  href={ctaData.secondaryButton.link}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white whitespace-nowrap shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/50 hover:shadow-md cursor-pointer w-full sm:w-auto"
                >
                  <span className="whitespace-nowrap">{ctaData.secondaryButton.label}</span>
                  <Phone size={18} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnerPageCTA;
