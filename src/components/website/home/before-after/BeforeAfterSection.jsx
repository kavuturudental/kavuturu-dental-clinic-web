// src/components/home/before-after/BeforeAfterSection.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import BeforeAfterCard from "./BeforeAfterCard";
import staticBeforeAfterData from "../../../../data/website/beforeAfterData";
import { getBeforeAfterCases } from "../../../../services/website/beforeAfterService";

const BeforeAfterSection = () => {
  const [casesList, setCasesList] = useState([]);

  useEffect(() => {
    const fetchHomepageCases = async () => {
      try {
        // Query homepage=true -> returns max 3 cases where showOnHomepage = true, sorted by homepageOrder
        const response = await getBeforeAfterCases({ homepage: "true" });
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setCasesList(response.data);
        } else {
          setCasesList(staticBeforeAfterData.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load homepage Before & After cases:", err);
        setCasesList(staticBeforeAfterData.slice(0, 3));
      }
    };

    fetchHomepageCases();
  }, []);

  const displayCases = (casesList.length > 0 ? casesList : staticBeforeAfterData).slice(0, 3);

  return (
    <section id="before-after" className="relative overflow-hidden bg-[#FCFCFD] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Clinic Showcase design */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Smile Transformations
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0E2A6D] sm:text-4xl lg:text-5xl font-outfit">
            Real Smiles. Real Transformations.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Explore genuine smile transformations achieved through advanced dental treatments at Kavuturu Dental Clinic.
          </p>
        </div>

        {/* 3-Column Responsive Grid (Max 3 Cases) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {displayCases.map((caseItem) => (
            <BeforeAfterCard key={caseItem._id || caseItem.id} caseItem={caseItem} />
          ))}
        </div>

        {/* Section Bottom CTA (View All Cases) */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/before-after"
            className="group inline-flex items-center gap-2.5 rounded-xl border border-[#0E2A6D]/25 bg-white/90 backdrop-blur-sm px-6 py-3 text-xs sm:text-sm font-bold text-[#0E2A6D] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0E2A6D] hover:bg-[#0E2A6D] hover:text-white hover:shadow-md cursor-pointer"
          >
            <span>View All Cases</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BeforeAfterSection;