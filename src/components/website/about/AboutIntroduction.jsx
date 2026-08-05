import React, { useEffect, useState } from "react";
import aboutPageData from "../../../data/website/aboutPageData";
import AboutIntroContent from "./AboutIntroContent";
import AboutIntroImage from "./AboutIntroImage";
import { getAboutContent } from "../../../services/website/aboutService";

const AboutIntroduction = () => {
  const { introduction } = aboutPageData;
  const [content, setContent] = useState({
    heading: introduction.heading,
    description: introduction.description
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await getAboutContent();
        if (response.success && response.data) {
          setContent({
            heading: response.data.heading || introduction.heading,
            description: response.data.description || introduction.description
          });
        }
      } catch (err) {
        console.error("Failed to load backend About introduction data:", err);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <section
      aria-labelledby="about-introduction-heading"
      className="relative overflow-hidden bg-white py-20 lg:py-28"
    >
      {/* Blue Glow */}
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

      {/* Green Glow */}
      <div className="absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-emerald-100/50 blur-3xl" />

      {/* Dot Pattern */}
      <div className="absolute right-12 top-20 hidden opacity-20 lg:block">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 36 }).map((_, index) => (
            <span
              key={index}
              className="h-1 w-1 rounded-full bg-[#0E2A6D]"
            />
          ))}
        </div>
      </div>

      {/* Bottom Wave */}
      <svg
        className="absolute bottom-0 left-0 h-48 w-full opacity-[0.05]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#0E2A6D"
          d="M0,192L80,181.3C160,171,320,149,480,149.3C640,149,800,171,960,181.3C1120,192,1280,192,1360,192L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left Content */}
          <AboutIntroContent
            data={{
              ...introduction,
              heading: content.heading,
              description: content.description
            }}
          />

          {/* Right Image */}
          <AboutIntroImage image={introduction.image} />
        </div>
      </div>
    </section>
  );
};

export default AboutIntroduction;