import aboutPageData from "../../../data/website/aboutPageData";
import AboutBadge from "./AboutBadge";
import MissionVisionCard from "./MissionVisionCard";

const MissionVision = () => {
  const { mission, vision } = aboutPageData.missionVision;

  return (
    <section
      aria-labelledby="mission-vision-heading"
      className="relative overflow-hidden bg-slate-50 py-20 lg:py-28"
    >
      {/* Background Decorations */}

      {/* Blue Glow */}
      <div className="absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-blue-100/50 blur-3xl" />

      {/* Green Glow */}
      <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-emerald-100/40 blur-3xl" />

      {/* Dot Pattern */}
      <div className="absolute right-16 top-20 hidden opacity-20 lg:block">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 36 }).map((_, index) => (
            <span
              key={index}
              className="h-1 w-1 rounded-full bg-[#0E2A6D]"
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <AboutBadge>Mission & Vision</AboutBadge>
          </div>

          <h2
            id="mission-vision-heading"
            className="
              mt-6
              text-4xl
              font-bold
              leading-tight
              tracking-tight
              text-[#0E2A6D]
              sm:text-5xl
            "
          >
            Guided by Purpose, Driven by Patient Care
          </h2>

          <p
            className="
              mt-6
              text-lg
              leading-8
              text-slate-600
            "
          >
            Everything we do is guided by our commitment to clinical excellence,
            compassionate care, and building long-lasting relationships with
            every patient who trusts us with their smile.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <MissionVisionCard data={mission} />
          <MissionVisionCard data={vision} />
        </div>
      </div>
    </section>
  );
};

export default MissionVision;