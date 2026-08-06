import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Stethoscope } from "lucide-react";
import staticTreatments from "../../../data/website/treatments";
import TreatmentCard from "../treatments/TreatmentCard";
import { getTreatments } from "../../../services/website/treatmentService";

const TreatmentsSection = () => {
  const [treatmentList, setTreatmentList] = useState([]);

  useEffect(() => {
    const fetchTreatmentsData = async () => {
      try {
        // Fetch only treatments configured for Homepage (showOnHomepage = true) sorted by homepageOrder
        const response = await getTreatments({ status: "Active", homepage: "true" });
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setTreatmentList(response.data);
        } else {
          setTreatmentList(staticTreatments);
        }
      } catch (err) {
        console.error("Failed to load homepage treatments:", err);
        setTreatmentList(staticTreatments);
      }
    };

    fetchTreatmentsData();
  }, []);

  const featuredTreatments = (treatmentList.length > 0 ? treatmentList : staticTreatments).slice(0, 6);

  return (
    <section
      id="treatments"
      className="relative overflow-hidden bg-[#FCFCFD] py-12 sm:py-16 lg:py-20"
    >
      {/* Background Gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-sky-100/50 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Clinic Showcase design */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 mb-3.5 shadow-sm">
            <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Our Treatments
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0E2A6D] sm:text-4xl lg:text-5xl font-outfit">
            Advanced Dental Treatments
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            We provide comprehensive dental care using modern technology,
            advanced techniques, and personalized treatment plans for patients
            of every age.
          </p>
        </div>

        {/* Treatment Cards (Max 6) */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredTreatments.map((treatment) => (
            <TreatmentCard
              key={treatment._id || treatment.id || treatment.slug}
              title={treatment.name || treatment.title}
              shortDescription={treatment.previewDescription || treatment.description}
              image={treatment.image || staticTreatments[0]?.image}
              alt={treatment.name || treatment.title}
              slug={treatment.slug || (treatment._id ? `treatment-${treatment._id}` : "laser-root-canal")}
            />
          ))}
        </div>

        {/* Section Bottom CTA (View All Treatments) */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/treatments"
            className="group inline-flex items-center gap-2.5 rounded-xl border border-[#0E2A6D]/25 bg-white/90 backdrop-blur-sm px-6 py-3 text-xs sm:text-sm font-bold text-[#0E2A6D] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0E2A6D] hover:bg-[#0E2A6D] hover:text-white hover:shadow-md cursor-pointer"
          >
            <span>View All Treatments</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TreatmentsSection;