import HeroImage from "./HeroImage";
import DesktopHeroContent from "./DesktopHeroContent";
import MobileHeroContent from "./MobileHeroContent";

function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#FCFCFD]"
    >
      <HeroImage />

      <DesktopHeroContent />

      <MobileHeroContent />
    </section>
  );
}

export default Hero;