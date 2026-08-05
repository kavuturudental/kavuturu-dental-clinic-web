import Breadcrumb from "../../components/website/about/Breadcrumb";
import AboutHero from "../../components/website/about/AboutHero";
import AboutIntroduction from "../../components/website/about/AboutIntroduction";
import OurStory from "../../components/website/about/OurStory";
import MissionVision from "../../components/website/about/MissionVision";
import OurValues from "../../components/website/about/OurValues";
import ClinicHighlights from "../../components/website/about/ClinicHighlights";
import WhyTrustUs from "../../components/website/about/WhyTrustUs";
import AboutCTA from "../../components/website/about/AboutCTA";
import Footer from "../../components/website/footer/Footer";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";

function About() {
  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden">
      <PublicPageBackground />
      <div className="relative z-10">
        <Breadcrumb />
        <AboutHero />
        <AboutIntroduction />
        <OurStory />
        <MissionVision />
        <OurValues />
        <ClinicHighlights />
        <WhyTrustUs />
        <AboutCTA />
      </div>
      <Footer />
    </main>
  );
}

export default About;