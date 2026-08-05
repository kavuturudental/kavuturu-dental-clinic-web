// src/components/treatments/TreatmentsGrid.jsx

import treatments from "../../../data/website/treatments";
import TreatmentCard from "./TreatmentCard";

const TreatmentsGrid = () => {
  return (
    <section
      className="relative py-16 md:py-20 lg:py-24"
      aria-labelledby="treatments-grid-heading"
    >
      <div className="mx-auto max-w-[960px] px-5 sm:px-6 lg:px-8">
        {/* Hidden heading for accessibility */}
        <h2 id="treatments-grid-heading" className="sr-only">
          All Dental Treatments
        </h2>

        {/* Grid */}
        <div className="grid justify-items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
          {treatments.map((treatment) => (
            <div
              key={treatment.id}
              id={treatment.slug}
              className="w-full max-w-[280px] scroll-mt-36"
            >
              <TreatmentCard
                title={treatment.title}
                slug={treatment.slug}
                shortDescription={treatment.shortDescription}
                image={treatment.image}
                alt={treatment.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TreatmentsGrid;