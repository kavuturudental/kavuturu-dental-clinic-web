import Breadcrumb from "../../components/website/doctors/Breadcrumb";
import DoctorsHero from "../../components/website/doctors/DoctorsHero";
import DoctorProfile from "../../components/website/home/doctors/DoctorProfile";
import DoctorsGrid from "../../components/website/doctors/DoctorsGrid";
import DoctorsCTA from "../../components/website/doctors/DoctorsCTA";
import Footer from "../../components/website/footer/Footer";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";
import { UserCheck } from "lucide-react";
import SEO from "../../components/seo/SEO";

const Doctors = () => {
  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden">
      <SEO
        title="Our Dental Specialists & Doctors | Kavuturu Dental Clinic Tirupati"
        description="Meet Chief Endodontist Dr. K. Ravindra Babu and expert visiting dental specialists at Kavuturu Dental Clinic in Tirupati."
        canonical="https://www.kavuturudentalclinic.com/doctors"
      />
      <PublicPageBackground />
      <div className="relative z-10">
        <Breadcrumb />
        <DoctorsHero />

        {/* Chief Dental Specialist Section */}
        <section className="bg-white py-16 lg:py-24 border-b border-slate-100">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 mb-3.5 shadow-xs">
                <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                  Chief Specialist
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#0E2A6D] sm:text-4xl lg:text-5xl font-outfit">
                Head Dental Surgeon & Founder
              </h2>
            </div>
            <DoctorProfile />
          </div>
        </section>

        <DoctorsGrid />
        <DoctorsCTA />
      </div>
      <Footer />
    </main>
  );
};

export default Doctors;