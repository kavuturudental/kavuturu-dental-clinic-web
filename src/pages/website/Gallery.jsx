import Breadcrumb from "../../components/website/gallery/Breadcrumb";
import GalleryHero from "../../components/website/gallery/GalleryHero";
import GalleryGrid from "../../components/website/gallery/GalleryGrid";
import GalleryCTA from "../../components/website/gallery/GalleryCTA";
import Footer from "../../components/website/footer/Footer";
import PublicPageBackground from "../../components/website/common/PublicPageBackground";
import SEO from "../../components/seo/SEO";

const Gallery = () => {
  return (
    <main className="relative bg-[#FCFCFD] pt-[72px] lg:pt-[88px] overflow-hidden">
      <SEO
        title="Clinic Gallery & Infrastructure | Kavuturu Dental Clinic Tirupati"
        description="Explore photos of our modern dental clinic, laser equipment, sterilization facilities, and patient comfort amenities in Tirupati."
        canonical="https://www.kavuturudentalclinic.com/gallery"
      />
      <PublicPageBackground />
      <div className="relative z-10">
        <Breadcrumb />
        <GalleryHero />
        <GalleryGrid />
        <GalleryCTA />
      </div>
      <Footer />
    </main>
  );
};

export default Gallery;
