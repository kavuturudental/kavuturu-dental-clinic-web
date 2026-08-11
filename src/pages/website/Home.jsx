import React, { useEffect } from "react";

import Hero from "../../components/website/hero/Hero";
import HeroStats from "../../components/website/hero/HeroStats";
import AboutSection from "../../components/website/about/AboutSection";
import TreatmentsSection from "../../components/website/home/TreatmentsSection";
import DoctorsSection from "../../components/website/home/doctors/DoctorsSection";
import BeforeAfterSection from "../../components/website/home/before-after/BeforeAfterSection";
import TestimonialsSection from "../../components/website/testimonials/TestimonialsSection";
import GallerySection from "../../components/website/home/gallery/GallerySection";
import BlogSection from "../../components/website/home/blogs/BlogSection";
import InnerPageCTA from "../../components/common/InnerPageCTA";
import ContactSection from "../../components/website/home/contact/ContactSection";
import Footer from "../../components/website/footer/Footer";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";

import SEO from "../../components/seo/SEO";
import StructuredData from "../../components/seo/StructuredData";

function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      const element = document.getElementById(hash);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
          });
        }, 300);
      }
    }
  }, []);

  return (
    <main className="relative bg-[#FCFCFD] text-slate-800 overflow-hidden font-sans">
      {/* =========================
          HOMEPAGE SEO
      ========================== */}

      <SEO
        title="Kavuturu Dental Clinic | Best Dental Clinic & Dentist in Tirupati"
        description="Kavuturu Dental Clinic is a trusted dental clinic in Tirupati offering dental implants, root canal treatment, smile makeovers, cosmetic dentistry, teeth whitening, braces, and complete family dental care with advanced technology."
        canonical="https://www.kavuturudentalclinic.com/"
        ogType="website"
        ogImage="https://www.kavuturudentalclinic.com/logo.png"
      />

      {/* =========================
          STRUCTURED DATA
      ========================== */}

      <StructuredData />

      {/* =========================
          PAGE BACKGROUND
      ========================== */}

      <PublicPageBackground />

      {/* =========================
          HOMEPAGE CONTENT
      ========================== */}

      <div className="relative z-10">
        {/* Hero */}
        <Hero />

        {/* Hero Statistics */}
        <HeroStats />

        {/* About */}
        <AboutSection />

        {/* Treatments */}
        <TreatmentsSection />

        {/* Doctors */}
        <DoctorsSection />

        {/* Before & After */}
        <BeforeAfterSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Gallery */}
        <GallerySection />

        {/* Blogs */}
        <BlogSection />

        {/* CTA */}
        <InnerPageCTA />

        {/* Contact */}
        <ContactSection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

export default Home;