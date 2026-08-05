import Breadcrumb from "../../components/website/doctors/Breadcrumb";
import DoctorsHero from "../../components/website/doctors/DoctorsHero";
import DoctorsGrid from "../../components/website/doctors/DoctorsGrid";
import DoctorsCTA from "../../components/website/doctors/DoctorsCTA";
import Footer from "../../components/website/footer/Footer";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";

const Doctors = () => {
  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden">
      <PublicPageBackground />
      <div className="relative z-10">
        <Breadcrumb />
        <DoctorsHero />
        <DoctorsGrid />
        <DoctorsCTA />
      </div>
      <Footer />
    </main>
  );
};

export default Doctors;