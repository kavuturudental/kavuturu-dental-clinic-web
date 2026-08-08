// src/pages/website/Contact.jsx

import React from "react";
import Breadcrumb from "../../components/website/contact/Breadcrumb";
import ContactHero from "../../components/website/contact/ContactHero";
import ContactSection from "../../components/website/home/contact/ContactSection";
import EmergencySupport from "../../components/website/home/contact/EmergencySupport";
import Footer from "../../components/website/footer/Footer";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";

const Contact = () => {
  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden">
      <PublicPageBackground />

      <div className="relative z-10">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Hero Header */}
        <ContactHero />

        {/* Main Contact Section (Info Cards & Google Maps) */}
        <ContactSection />

        {/* Emergency Assistance Callout */}
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
          <EmergencySupport />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Contact;
