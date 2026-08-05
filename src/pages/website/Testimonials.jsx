// src/pages/website/Testimonials.jsx

import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import TestimonialsHero from "../../components/website/testimonials/TestimonialsHero";
import TestimonialsGrid from "../../components/website/testimonials/TestimonialsGrid";
import Footer from "../../components/website/footer/Footer";
import InnerPageCTA from "../../components/common/InnerPageCTA";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";

const Testimonials = () => {
  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden">
      <PublicPageBackground />
      <div className="relative z-10">
        {/* Inline Breadcrumb Section */}
        <section className="border-b border-slate-200/80 bg-transparent">
          <div className="mx-auto flex h-16 max-w-[1280px] items-center px-5 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm"
            >
              <Link
                to="/"
                className="flex items-center gap-2 text-slate-500 transition-colors hover:text-sky-600"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <ChevronRight className="h-4 w-4 text-slate-400" />

              <span className="font-medium text-slate-900">
                Testimonials
              </span>
            </nav>
          </div>
        </section>

        {/* Hero */}
        <TestimonialsHero />

        {/* Testimonials Grid (Max 15, Sorted Newest First) */}
        <TestimonialsGrid />

        {/* CTA */}
        <InnerPageCTA />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Testimonials;
