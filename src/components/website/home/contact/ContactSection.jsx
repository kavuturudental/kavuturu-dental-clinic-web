// src/components/home/contact/ContactSection.jsx

import React from "react";
import ContactHeader from "./ContactHeader";
import ContactInfo from "./ContactInfo";
import ContactMap from "./ContactMap";

export const ContactSection = () => {
  return (
    <section
      id="contact"
      className="bg-[#FCFCFD] py-12 sm:py-16 lg:py-20"
      aria-labelledby="contact-section-heading"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <ContactHeader />

        {/* Main Info and Map Grid */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
          
          {/* Left Column (Info Cards) */}
          <div className="lg:col-span-7">
            <ContactInfo />
          </div>

          {/* Right Column (Google Map Iframe) */}
          <div className="lg:col-span-5">
            <ContactMap />
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
