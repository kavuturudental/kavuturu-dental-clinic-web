import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

import { heroData } from "../../../data/website/heroData";
import { useAppointment } from "../bookAppointment";

function HeroButtons({ className = "mt-8" }) {
  const { openModal } = useAppointment();

  return (
    <div
      className={`
        ${className}
        flex
        flex-col
        gap-3.5
        sm:flex-row
        lg:gap-4
        w-full
      `}
    >
      {/* Primary Button */}
      <button
        onClick={() => openModal()}
        className="
          group
          inline-flex
          h-13
          sm:h-14
          items-center
          justify-center
          gap-2.5
          rounded-xl
          bg-secondary
          px-7
          sm:px-8
          text-sm
          sm:text-base
          font-bold
          text-white
          whitespace-nowrap
          shadow-lg
          shadow-green-500/25
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:bg-secondary-dark
          hover:shadow-xl
          hover:shadow-green-500/30
          w-full
          sm:w-auto
          cursor-pointer
          shrink-0
        "
      >
        <span className="whitespace-nowrap">{heroData.buttons.primary.label}</span>
        <Calendar className="h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
      </button>

      {/* Secondary Button */}
      <Link
        to={heroData.buttons.secondary.href}
        className="
          group
          inline-flex
          h-13
          sm:h-14
          items-center
          justify-center
          gap-2.5
          rounded-xl
          border
          border-[#0E2A6D]/25
          bg-white/90
          backdrop-blur-md
          px-7
          sm:px-8
          text-sm
          sm:text-base
          font-bold
          text-[#0E2A6D]
          whitespace-nowrap
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-[#0E2A6D]
          hover:bg-[#0E2A6D]
          hover:text-white
          hover:shadow-md
          w-full
          sm:w-auto
          shrink-0
        "
      >
        <span className="whitespace-nowrap">{heroData.buttons.secondary.label}</span>
        <ArrowRight className="h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export default HeroButtons;