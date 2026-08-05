import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { heroData } from "../../../data/website/heroData";
import HeroButtons from "./HeroButtons";
import { getHeroContent } from "../../../services/website/heroService";

function MobileHeroContent() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await getHeroContent();
        setHero(response.data);
      } catch (error) {
        console.error("Failed to load hero content:", error);
      }
    };

    fetchHero();

    const handleUpdate = () => fetchHero();
    window.addEventListener("STATE_UPDATED", handleUpdate);
    window.addEventListener("HERO_UPDATED", handleUpdate);

    return () => {
      window.removeEventListener("STATE_UPDATED", handleUpdate);
      window.removeEventListener("HERO_UPDATED", handleUpdate);
    };
  }, []);

  return (
    <div
      className="
        px-5
        pt-2
        pb-10
        lg:hidden
      "
    >
      {/* Trust Badge */}
      <div className="flex justify-start">
        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-sky-200
            bg-sky-50/90
            backdrop-blur-md
            px-4
            py-1.5
            shadow-sm
          "
        >
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />

          <span
            className="
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-sky-700
            "
          >
            {hero?.trustBadge || heroData.badge.text}
          </span>
        </div>
      </div>

      {/* Heading */}
      <h1
        className="
          mt-5
          text-[32px]
          sm:text-[38px]
          font-extrabold
          leading-[1.12]
          tracking-tight
          text-primary
        "
      >
        {hero?.heading || heroData.heading}
      </h1>

      {/* Accent Subheading */}
      <p
        className="
          mt-2
          font-['Playfair_Display',serif]
          italic
          font-semibold
          tracking-wide
          text-emerald-600
          text-xl
          sm:text-2xl
        "
      >
        {hero?.accentSubheading || heroData.accentSubheading}
      </p>

      {/* Description */}
      <p
        className="
          mt-4
          text-base
          leading-7
          text-slate-600
        "
      >
        {hero?.description || heroData.description}
      </p>

      {/* CTA Buttons */}
      <HeroButtons className="mt-6" />
    </div>
  );
}

export default MobileHeroContent;