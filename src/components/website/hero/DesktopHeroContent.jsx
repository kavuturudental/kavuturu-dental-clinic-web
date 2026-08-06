import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { heroData } from "../../../data/website/heroData";
import HeroButtons from "./HeroButtons";
import { getHeroContent } from "../../../services/website/heroService";

function DesktopHeroContent() {
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
        absolute
        inset-0
        z-20
        hidden
        lg:block
        px-4 sm:px-6 lg:px-8
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          max-w-[1280px]
          w-full
          items-center
          px-6 lg:px-8
        "
      >
        <div
          className="
            w-full
            max-w-[580px]
            -mt-20
          "
        >
          {/* Trust Badge */}

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

          {/* Heading */}

          <h1
            className="
              mt-6
              font-extrabold
              tracking-tight
              text-primary
              text-[54px]
              leading-[1.1]
            "
          >
            {hero?.heading || heroData.heading}
          </h1>

          {/* Accent Subheading */}

          <p
            className="
              mt-2.5
              font-['Playfair_Display',serif]
              italic
              font-semibold
              tracking-wide
              text-emerald-600
              text-[26px]
              leading-snug
            "
          >
            {hero?.accentSubheading || heroData.accentSubheading}
          </p>

          {/* Description */}

          <p
            className="
              mt-4
              max-w-[520px]
              text-lg
              leading-8
              text-slate-600
              whitespace-pre-line
            "
          >
            {hero?.description || heroData.description}
          </p>

          {/* Buttons */}

          <HeroButtons />
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
}

export default DesktopHeroContent;