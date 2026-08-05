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

  return (
    <section
      className="
        relative
        z-30
        mt-0
        lg:-mt-32
        pb-16
      "
    >
      <div
        className="
          mx-auto
          max-w-[1280px]
          px-5
          lg:px-6
        "
      >
        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200/80
            bg-white
            shadow-[0_8px_24px_rgba(14,42,109,0.06)]
            transition-all
            duration-300
            hover:border-sky-300
            hover:shadow-xl
          "
        >
          <div
            className="
              grid
              grid-cols-2
              divide-x
              divide-y
              divide-slate-100

              lg:grid-cols-[1fr_1.15fr_0.95fr_1.25fr]
              lg:divide-y-0
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
                  className="
                    flex
                    items-center
                    gap-4

                    px-4
                    py-4.5

                    lg:gap-5
                    lg:px-7
                    lg:py-6
                  "
                >
                  {/* Icon */}
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      lg:h-11
                      lg:w-11
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      bg-emerald-50/80
                    "
                  >
                    <Icon
                      strokeWidth={1.75}
                      className="
                        h-4.5
                        w-4.5
                        lg:h-5.5
                        lg:w-5.5
                        text-secondary
                      "
                    />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col justify-center min-w-0">
                    <h3
                      className={`
                        font-black
                        leading-tight
                        text-[#0E2A6D]
                        ${
                          isLongTextValue
                            ? "text-base sm:text-lg lg:text-[20px] whitespace-nowrap"
                            : "text-xl sm:text-2xl lg:text-3xl"
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
                        whitespace-nowrap
                        text-slate-700
                      "
                    >
                      {title}
                    </p>

                    {subtitle && (
                      <p
                        className="
                          mt-0.5
                          text-xs
                          leading-4
                          text-slate-500
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