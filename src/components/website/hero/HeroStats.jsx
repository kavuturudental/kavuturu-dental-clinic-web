import { useEffect, useState } from "react";

import { statsData } from "../../../data/website/statsData";
import { getHeroContent } from "../../../services/website/heroService";

function HeroStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchHeroStats = async () => {
      try {
        const response = await getHeroContent();

        if (response.success && response.data.stats) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Failed to load hero stats:", error);
      }
    };

    fetchHeroStats();

    const handleUpdate = () => fetchHeroStats();
    window.addEventListener("STATE_UPDATED", handleUpdate);
    window.addEventListener("HERO_UPDATED", handleUpdate);

    return () => {
      window.removeEventListener("STATE_UPDATED", handleUpdate);
      window.removeEventListener("HERO_UPDATED", handleUpdate);
    };
  }, []);

  const getBorderClass = (index) => {
    switch (index) {
      case 0:
        return "border-b border-blue-800/40 sm:border-r sm:border-b lg:border-0";
      case 1:
        return "border-b border-blue-800/40 sm:border-r-0 sm:border-b lg:border-0";
      case 2:
        return "border-b border-blue-800/40 sm:border-r sm:border-b-0 lg:border-0";
      case 3:
        return "border-b-0 sm:border-r-0 sm:border-b-0 lg:border-0";
      default:
        return "border-blue-800/40";
    }
  };

  return (
    <section
      className="
        relative
        z-30
        mt-0
        lg:-mt-32
        pb-12
        sm:pb-16
        lg:pb-16
        w-full
        max-w-full
        overflow-hidden
      "
    >
      <div
        className="
          mx-auto
          max-w-[1280px]
          px-4
          sm:px-6
          lg:px-8
          w-full
          max-w-full
        "
      >
        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-blue-900/30
            bg-gradient-to-r from-[#0E2A6D] via-[#0D2663] to-[#0A1F52]
            shadow-[0_15px_45px_rgba(14,42,109,0.22)]
            transition-all
            duration-300
            hover:shadow-2xl
            w-full
            max-w-full
          "
        >
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-[1fr_1.15fr_0.95fr_1.25fr]
              lg:divide-x
              lg:divide-y-0
              lg:divide-blue-800/40
              w-full
              max-w-full
            "
          >
            {statsData.map((item, index) => {
              const Icon = item.icon;

              const backendStat = stats[index];

              const value = backendStat?.value || item.value;
              const title = backendStat?.title || item.title;
              const subtitle = backendStat?.subtitle || item.subtitle;

              const isLongTextValue =
                value === "Trusted Dental Care";

              return (
                <div
                  key={item.id}
                  className={`
                    flex
                    items-center
                    gap-3.5
                    sm:gap-4
                    lg:gap-5
                    px-4
                    py-4
                    sm:px-5
                    sm:py-5
                    lg:px-7
                    lg:py-6
                    min-w-0
                    w-full
                    ${getBorderClass(index)}
                  `}
                >
                  {/* Icon */}
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      sm:h-11
                      sm:w-11
                      lg:h-12
                      lg:w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/15
                      backdrop-blur-md
                      border
                      border-white/10
                    "
                  >
                    <Icon
                      strokeWidth={2}
                      className="
                        h-5
                        w-5
                        sm:h-5.5
                        sm:w-5.5
                        lg:h-6
                        lg:w-6
                        text-emerald-400
                      "
                    />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h3
                      className={`
                        font-black
                        leading-tight
                        text-white
                        min-w-0
                        ${
                          isLongTextValue
                            ? "text-base sm:text-lg lg:text-[20px] break-words lg:break-normal lg:whitespace-nowrap"
                            : "text-xl sm:text-2xl lg:text-3xl break-words lg:break-normal lg:whitespace-nowrap"
                        }
                      `}
                    >
                      {value}
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        lg:text-sm
                        font-bold
                        leading-snug
                        text-slate-100
                        min-w-0
                        break-words
                        lg:break-normal
                        lg:whitespace-nowrap
                      "
                    >
                      {title}
                    </p>

                    {subtitle && (
                      <p
                        className="
                          mt-0.5
                          text-[11px]
                          sm:text-xs
                          lg:text-xs
                          leading-4
                          text-blue-200/80
                          min-w-0
                          break-words
                          lg:break-normal
                        "
                      >
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroStats;