// src/components/about/HighlightCard.jsx

import React from "react";
import { Award, Activity, Heart, Sparkles } from "lucide-react";

const iconMap = {
  Award: Award,
  Activity: Activity,
  Heart: Heart,
  Sparkles: Sparkles,
};

const HighlightCard = ({ item }) => {
  const IconComponent = item.icon ? iconMap[item.icon] || Award : null;

  return (
    <article
      className="
        group
        relative
        flex
        h-full
        w-full
        flex-col
        justify-between
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        p-6
        sm:p-7
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-sky-200
        hover:shadow-xl
      "
    >
      {/* Background Ambient Glow */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-100/30 blur-2xl transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          {/* Top Row: Icon Badge & Stat Value side-by-side with close spacing */}
          <div className="flex items-center gap-3.5 mb-3.5">
            {IconComponent && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100/80 transition-transform duration-300 group-hover:scale-105">
                <IconComponent size={20} />
              </div>
            )}
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0E2A6D] font-outfit whitespace-nowrap">
              {item.value}
            </span>
          </div>

          {/* Label */}
          <h3 className="text-base font-bold text-slate-800 font-outfit leading-snug line-clamp-1">
            {item.label}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Bottom Accent Gradient Line */}
        <div className="mt-5 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#0E2A6D] to-emerald-500 transition-all duration-300 group-hover:w-full" />
      </div>
    </article>
  );
};

export default HighlightCard;