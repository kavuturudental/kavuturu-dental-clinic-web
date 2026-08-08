// src/pages/website/Contact.jsx

import React from "react";
import Breadcrumb from "../../components/website/contact/Breadcrumb";
import ContactHero from "../../components/website/contact/ContactHero";
import ContactSection from "../../components/website/home/contact/ContactSection";
import Footer from "../../components/website/footer/Footer";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";
import SEO from "../../components/seo/SEO";

const Contact = () => {
  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden">
      <SEO
        title="Contact Us | Kavuturu Dental Clinic Tirupati"
        description="Contact Kavuturu Dental Clinic in Tirupati. Find clinic address, phone numbers, working hours, and Google Maps location."
        canonical="https://www.kavuturudentalclinic.com/contact"
      />
      <PublicPageBackground />

      <div className="relative z-10">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Hero Header */}
        <ContactHero />

        {/* Main Contact Section (Info Cards & Google Maps) */}
        <ContactSection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Contact;
