import aboutPageData from "../../../data/website/aboutPageData";
import AboutBadge from "./AboutBadge";
import ValueCard from "./ValueCard";

const OurValues = () => {
  const { values } = aboutPageData;

  return (
    <section
      aria-labelledby="our-values-heading"
      className="relative overflow-hidden bg-white py-20 lg:py-28"
    >
      {/* Blue Glow */}
      <div className="absolute -top-32 -right-40 h-[30rem] w-[30rem] rounded-full bg-blue-100/50 blur-3xl" />

      {/* Green Glow */}
      <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-emerald-100/40 blur-3xl" />

      {/* Dot Pattern */}
      <div className="absolute bottom-20 left-16 hidden opacity-20 lg:block">
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
        {/* Header */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <AboutBadge>Our Values</AboutBadge>
          </div>

          <h2
            id="our-values-heading"
            className="mt-6 text-4xl font-bold tracking-tight text-[#0E2A6D] sm:text-5xl"
          >
            The Values That Shape Every Patient Experience
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            At Kavuturu Dental Clinic, every interaction is guided by principles
            that prioritize trust, compassion, innovation, and clinical
            excellence. These values define how we care for every patient,
            every day.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {values.map((value, index) => (
            <ValueCard
              key={value.id}
              value={value}
              number={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;