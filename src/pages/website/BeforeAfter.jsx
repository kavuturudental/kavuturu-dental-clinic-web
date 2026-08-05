import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Sparkles } from "lucide-react";
import BeforeAfterList from "../../components/website/before-after/BeforeAfterList";
import InnerPageCTA from "../../components/common/InnerPageCTA";
import Footer from "../../components/website/footer/Footer";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";

const BeforeAfter = () => {
  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden">
      <PublicPageBackground />
      <div className="relative z-10">
        {/* Breadcrumb */}
        <section className="border-b border-slate-200/80 bg-transparent">
          <div className="mx-auto flex h-16 max-w-[1280px] items-center px-5 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
              <Link to="/" className="flex items-center gap-2 text-slate-500 transition-colors hover:text-sky-600">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="font-medium text-slate-900">Before & After</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-transparent py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                  Smile Gallery
                </span>
              </div>

              {/* Heading */}
              <h1 className="mt-6 font-outfit text-4xl sm:text-[40px] md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900">
                Before & After <br />
                <span className="text-[#0E2A6D]">Transformations</span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
                Witness the power of advanced laser dentistry, cosmetic makeovers, and custom alignments. 
                Here are actual smile restoration cases from Kavuturu Dental Clinic.
              </p>
            </div>
          </div>
        </section>

        {/* All Transformations List */}
        <BeforeAfterList />

        {/* CTA */}
        <InnerPageCTA />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default BeforeAfter;
