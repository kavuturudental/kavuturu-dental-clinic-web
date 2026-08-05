// src/components/treatments/TreatmentSection.jsx

const TreatmentSection = ({ treatment, reverse = false }) => {
  return (
    <section
      id={treatment.slug}
      className="scroll-mt-28 border-b border-slate-200 py-20 lg:py-28"
    >
      <div
        className={`mx-auto grid max-w-[1280px] items-center gap-16 px-5 sm:px-6 lg:grid-cols-2 lg:px-8 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Image */}
        <div>
          <img
            src={treatment.image}
            alt={treatment.title}
            loading="lazy"
            className="w-full rounded-2xl object-cover"
          />
        </div>

        {/* Content */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
            Treatment
          </span>

          <h2 className="mt-4 font-outfit text-4xl font-bold leading-tight text-[#0E2A6D]">
            {treatment.title}
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600">
            {treatment.description}
          </p>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-slate-900">
              Key Highlights
            </h3>

            <ul className="mt-6 space-y-5">
              {treatment.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />

                  <p className="leading-7 text-slate-600">
                    {highlight}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreatmentSection;