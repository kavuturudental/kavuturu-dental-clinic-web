import aboutPageData from "../../../data/website/aboutPageData";
import AboutBadge from "./AboutBadge";

const OurStory = () => {
  const { story } = aboutPageData;

  return (
    <section
      aria-labelledby="our-story-heading"
      className="relative overflow-hidden bg-white py-20 lg:py-28"
    >
      {/* Background Decorations */}

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
        <div className="grid items-start gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Left Column */}
          <div className="lg:col-span-4">
            <AboutBadge>{story.title}</AboutBadge>

            <div className="mt-10 flex items-start gap-8">
              <span
                className="
                  select-none
                  text-7xl
                  font-black
                  leading-none
                  tracking-tight
                  text-[#0E2A6D]/8
                  sm:text-8xl
                  lg:text-9xl
                "
              >
                2025
              </span>

              <div className="mt-2 h-32 w-px bg-gradient-to-b from-[#0E2A6D] via-blue-300 to-transparent" />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8">
            <h2
              id="our-story-heading"
              className="
                max-w-3xl
                text-4xl
                font-bold
                leading-tight
                tracking-tight
                text-[#0E2A6D]
                sm:text-5xl
              "
            >
              Building Healthy Smiles Through Trust, Innovation, and Compassion
            </h2>

            <div className="mt-8 space-y-6">
              <p className="text-lg leading-8 text-slate-600">
                Founded in{" "}
                <span className="font-semibold text-[#0E2A6D]">2025</span>,
                Kavuturu Dental Clinic was established with a simple vision—to
                make modern dental care accessible, comfortable, and trustworthy
                for every family in Tirupati.
              </p>

              <p className="text-lg leading-8 text-slate-600">
                Under the leadership of{" "}
                <span className="font-semibold text-[#0E2A6D]">
                  Dr. Ravindrababu
                </span>
                , our clinic combines advanced dental technology with genuine
                compassion. Every treatment is carefully planned around each
                patient's unique needs, ensuring a comfortable experience and
                long-term oral health.
              </p>

              <p className="text-lg leading-8 text-slate-600">
                Today, we proudly serve thousands of patients with ethical
                dentistry, modern treatment techniques, and a commitment to
                creating healthy, confident smiles that last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;