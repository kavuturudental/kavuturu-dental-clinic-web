import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/website/treatments/Breadcrumb";
import TreatmentsHero from "../../components/website/treatments/TreatmentsHero";
import TreatmentList from "../../components/website/treatments/TreatmentList";
import TreatmentCTA from "../../components/website/treatments/TreatmentCTA";
import Footer from "../../components/website/footer/Footer";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";

const Treatments = () => {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");

  useEffect(() => {
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [section]);

  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden">
      <PublicPageBackground />
      <div className="relative z-10">
        <Breadcrumb />
        <TreatmentsHero />
        <TreatmentList />
        <TreatmentCTA />
      </div>
      <Footer />
    </main>
  );
};

export default Treatments;