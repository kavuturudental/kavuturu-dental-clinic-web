import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare } from "lucide-react";
import TestimonialCard from "./TestimonialCard";
import { getTestimonials } from "../../../services/website/testimonialService";
import { sortTestimonialsByReviewDate } from "../../../utils/reviewDateHelper";

const marqueeStyle = `
  @keyframes marquee-scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-marquee-track {
    display: flex;
    gap: 1.5rem;
    width: max-content;
    animation: marquee-scroll 25s linear infinite;
  }

  .animate-marquee-track:hover {
    animation-play-state: paused;
  }

  @media (hover: none) {
    .animate-marquee-track:hover {
      animation-play-state: running;
    }
  }
`;

const TestimonialsSection = () => {
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageTestimonials = async () => {
      try {
        // Query homepage=true -> returns max 8 most recent reviews sorted by reviewDate chronologically
        const response = await getTestimonials({ homepage: "true" });
        if (response.success && Array.isArray(response.data)) {
          // Guarantee chronological sorting by review date (most recent review date first)
          const sorted = sortTestimonialsByReviewDate(response.data);
          setReviewsList(sorted);
        }
      } catch (err) {
        console.error("Failed to load homepage testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageTestimonials();
  }, []);

  // If database contains 0 reviews, render nothing
  if (!loading && reviewsList.length === 0) {
    return null;
  }

  const duplicatedReviews = [...reviewsList, ...reviewsList];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#FCFCFD] py-12 sm:py-16 lg:py-20"
      aria-labelledby="testimonials-heading"
    >
      {/* Inject encapsulated style block for custom marquee animation */}
      <style dangerouslySetInnerHTML={{ __html: marqueeStyle }} />

      {/* Subtle Background Gradients */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-sky-100/40 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-emerald-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        
        {/* Header matching Clinic Showcase design */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 mb-3.5 shadow-sm">
              <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Patient Stories
              </span>
            </div>
            <h2
              id="testimonials-heading"
              className="text-3xl font-bold tracking-tight text-[#0E2A6D] sm:text-4xl lg:text-5xl font-outfit"
            >
              Real Stories, Real Smiles
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Read genuine experiences shared by patients who trusted Kavuturu Dental Clinic for advanced, comfortable, and personalized dental care.
            </p>
          </div>

          <Link
            to="/testimonials"
            className="group hidden md:inline-flex items-center gap-2.5 rounded-xl border border-[#0E2A6D]/25 bg-white/90 backdrop-blur-sm px-6 py-3 text-xs sm:text-sm font-bold text-[#0E2A6D] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0E2A6D] hover:bg-[#0E2A6D] hover:text-white hover:shadow-md cursor-pointer self-start md:self-auto"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Infinite Horizontal Marquee Container */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Subtle Left & Right Shadow Fades to smooth edges */}
          <div className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none md:w-24" />
          <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none md:w-24" />

          {/* Marquee Motion Track */}
          <div className="animate-marquee-track items-stretch">
            {duplicatedReviews.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial._id || testimonial.id || index}-${index}`}
                patientName={testimonial.patientName || testimonial.name}
                rating={testimonial.rating}
                comment={testimonial.comment || testimonial.text}
                reviewDate={testimonial.reviewDate}
              />
            ))}
          </div>
        </div>

        {/* Mobile Section Bottom CTA */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            to="/testimonials"
            className="group inline-flex items-center gap-2.5 rounded-xl border border-[#0E2A6D]/25 bg-white/90 backdrop-blur-sm px-6 py-3 text-xs font-bold text-[#0E2A6D] shadow-sm transition-all duration-300 hover:border-[#0E2A6D] hover:bg-[#0E2A6D] hover:text-white hover:shadow-md cursor-pointer"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
