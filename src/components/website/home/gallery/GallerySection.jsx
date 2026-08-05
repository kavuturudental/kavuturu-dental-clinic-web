// src/components/home/gallery/GallerySection.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import staticGalleryData from "../../../../data/website/galleryData";
import GalleryLightboxModal from "../../gallery/GalleryLightboxModal";
import { getGalleryImages } from "../../../../services/website/galleryService";

const marqueeStyle = `
  @keyframes gallery-marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-gallery-marquee {
    display: flex;
    gap: 1.25rem;
    width: max-content;
    animation: gallery-marquee 40s linear infinite;
  }

  .animate-gallery-marquee:hover {
    animation-play-state: paused;
  }
`;

const GallerySection = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchHomepageGallery = async () => {
      try {
        const response = await getGalleryImages({ homepage: "true" });
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setGalleryImages(response.data);
        } else {
          setGalleryImages(staticGalleryData.slice(0, 8));
        }
      } catch (err) {
        console.error("Failed to load homepage gallery images:", err);
        setGalleryImages(staticGalleryData.slice(0, 8));
      }
    };

    fetchHomepageGallery();
  }, []);

  const displayList = galleryImages.length > 0 ? galleryImages : staticGalleryData.slice(0, 8);
  // Duplicate gallery images for seamless continuous loop
  const duplicatedImages = [...displayList, ...displayList];

  const handleImageClick = (index) => {
    setActiveImageIndex(index % displayList.length);
    setIsLightboxOpen(true);
  };

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#FCFCFD] py-12 sm:py-16 lg:py-20"
    >
      <style dangerouslySetInnerHTML={{ __html: marqueeStyle }} />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        {/* Section Header with integrated "View Gallery" button */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 mb-3.5 shadow-sm">
              <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Clinic Showcase
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#0E2A6D] sm:text-4xl lg:text-5xl font-outfit">
              Explore Our Modern <span className="text-[#0E2A6D]">Dental Clinic</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              A quick glimpse inside our state-of-the-art treatment facilities and welcoming environment in Tirupati.
            </p>
          </div>

          <Link
            to="/gallery"
            className="group hidden md:inline-flex items-center gap-2.5 rounded-xl border border-[#0E2A6D]/25 bg-white/90 backdrop-blur-sm px-6 py-3 text-xs sm:text-sm font-bold text-[#0E2A6D] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0E2A6D] hover:bg-[#0E2A6D] hover:text-white hover:shadow-md cursor-pointer self-start md:self-auto"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Horizontal Marquee / Continuous Scrolling Image Strip */}
        <div className="relative w-full overflow-hidden rounded-3xl py-2">
          {/* Subtle edge shadow fades */}
          <div className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none md:w-20" />
          <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none md:w-20" />

          <div className="animate-gallery-marquee py-2">
            {duplicatedImages.map((item, index) => (
              <div
                key={`${item._id || item.id || index}-${index}`}
                onClick={() => handleImageClick(index)}
                className="group relative flex-shrink-0 w-64 sm:w-80 h-44 sm:h-52 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-[0_8px_24px_rgba(14,42,109,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-sky-300 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.alt || item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-5">
                  <span className="text-xs font-bold text-white tracking-wide drop-shadow-sm">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Section Bottom CTA */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2.5 rounded-xl border border-[#0E2A6D]/25 bg-white/90 backdrop-blur-sm px-6 py-3 text-xs font-bold text-[#0E2A6D] shadow-sm transition-all duration-300 hover:border-[#0E2A6D] hover:bg-[#0E2A6D] hover:text-white hover:shadow-md cursor-pointer"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <GalleryLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={displayList}
        currentIndex={activeImageIndex}
        setCurrentIndex={setActiveImageIndex}
      />
    </section>
  );
};

export default GallerySection;