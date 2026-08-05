// src/components/website/testimonials/TestimonialsGrid.jsx

import React, { useEffect, useState } from "react";
import TestimonialCard from "./TestimonialCard";
import { getTestimonials } from "../../../services/website/testimonialService";
import { sortTestimonialsByReviewDate } from "../../../utils/reviewDateHelper";
import { MessageSquare } from "lucide-react";

const TestimonialsGrid = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTestimonials = async () => {
      try {
        const response = await getTestimonials();
        if (response.success && Array.isArray(response.data)) {
          // Guarantee chronological sorting by review date (most recent review date first)
          const sorted = sortTestimonialsByReviewDate(response.data);
          setReviews(sorted);
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTestimonials();
  }, []);

  if (!loading && reviews.length === 0) {
    return (
      <section className="bg-slate-50/50 py-16">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No Patient Reviews Available</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Check back soon for new patient experiences and smile transformation stories.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50/50 py-20 lg:py-28 border-t border-slate-100">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {reviews.map((testimonial) => (
            <TestimonialCard
              key={testimonial._id || testimonial.id}
              patientName={testimonial.patientName || testimonial.name}
              rating={testimonial.rating}
              comment={testimonial.comment || testimonial.text}
              reviewDate={testimonial.reviewDate}
              className="w-full max-w-full h-[290px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsGrid;
