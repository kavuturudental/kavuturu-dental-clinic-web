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

function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }, []);

  return (
    <main className="relative bg-[#FCFCFD] text-slate-800 overflow-hidden font-sans">
      <SEO
        title="Kavuturu Dental Clinic & Hospital | Dental Implants & Laser Dentistry in Tirupati"
        description="Kavuturu Dental Clinic in Tirupati offers advanced laser dentistry, painless root canals, dental implants, clear aligners, and family dental care by Chief Endodontist Dr. K. Ravindra Babu."
        canonical="https://www.kavuturudentalclinic.com/"
      />
      <PublicPageBackground />

      {/* Homepage Sections */}
      <div className="relative z-10">
        <Hero />
        <HeroStats />
        <AboutSection />
        <TreatmentsSection />
        <DoctorsSection />
        <BeforeAfterSection />
        <TestimonialsSection />
        <GallerySection />
        <BlogSection />
        <InnerPageCTA />
        <ContactSection />
      </div>

      <Footer />
    </main>
  );
}

export default Home;