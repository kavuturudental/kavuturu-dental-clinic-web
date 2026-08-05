// src/components/about/AboutSection.jsx

import React, { useEffect, useState } from "react";
import aboutData from "../../../data/website/aboutData";
import AboutBadge from "./AboutBadge";
import AboutContent from "./AboutContent";
import AboutImage from "./AboutImage";
import { getAboutContent } from "../../../services/website/aboutService";

const AboutSection = () => {
  const [content, setContent] = useState({
    heading: aboutData.heading,
    description: aboutData.description
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await getAboutContent();
        if (response.success && response.data) {
          setContent({
            heading: response.data.heading || aboutData.heading,
            description: response.data.description || aboutData.description
          });
        }
      } catch (err) {
        console.error("Failed to load backend About section:", err);
      }
    };

    fetchAboutData();

    const handleUpdate = () => fetchAboutData();
    window.addEventListener("STATE_UPDATED", handleUpdate);
    window.addEventListener("ABOUT_UPDATED", handleUpdate);

    return () => {
      window.removeEventListener("STATE_UPDATED", handleUpdate);
      window.removeEventListener("ABOUT_UPDATED", handleUpdate);
    };
  }, []);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-[#FCFCFD] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        {/* Mobile Badge */}
        <div className="mb-6 lg:hidden">
          <AboutBadge>{aboutData.badge}</AboutBadge>
        </div>

        <div
          className="
            grid
            items-center
            gap-10
            lg:grid-cols-2
            lg:gap-16
          "
        >
          {/* Content */}
          <div className="order-2 lg:order-1">
            <AboutContent
              data={{
                ...aboutData,
                heading: content.heading,
                description: content.description,
                badge: null,
              }}
            />
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <AboutImage image={aboutData.image} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;