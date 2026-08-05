// src/components/website/hero/HeroImage.jsx

import React, { useEffect, useState } from "react";
import defaultDesktopWebp from "../../../assets/images/hero/hero-desktop.webp";
import defaultMobileWebp from "../../../assets/images/hero/hero-mobile.webp";
import { getHeroContent } from "../../../services/website/heroService";

function HeroImage() {
  const [heroImages, setHeroImages] = useState({
    desktop: defaultDesktopWebp,
    mobile: defaultMobileWebp,
  });

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await getHeroContent();
        if (response.success && response.data) {
          const data = response.data;
          setHeroImages({
            desktop: data.desktopImage || data.heroDesktopImage || data.heroImage || defaultDesktopWebp,
            mobile: data.mobileImage || data.heroMobileImage || data.heroImage || defaultMobileWebp,
          });
        }
      } catch (err) {
        console.warn("Using default WebP hero images:", err);
      }
    };

    fetchHeroImages();

    const handleUpdate = () => fetchHeroImages();
    window.addEventListener("STATE_UPDATED", handleUpdate);
    window.addEventListener("HERO_UPDATED", handleUpdate);

    return () => {
      window.removeEventListener("STATE_UPDATED", handleUpdate);
      window.removeEventListener("HERO_UPDATED", handleUpdate);
    };
  }, []);

  return (
    <>
      {/* ================= Desktop Hero ================= */}
      <picture className="hidden lg:block">
        <img
          src={heroImages.desktop || defaultDesktopWebp}
          alt="Advanced Laser & Implant Dentistry in Tirupati"
          className="
            block
            w-full
            h-auto
            select-none
          "
          draggable={false}
          onError={(e) => {
            if (e.target.src !== defaultDesktopWebp) {
              e.target.src = defaultDesktopWebp;
            }
          }}
        />
      </picture>

      {/* ================= Mobile Hero ================= */}
      <picture className="block lg:hidden">
        <img
          src={heroImages.mobile || defaultMobileWebp}
          alt="Advanced Laser & Implant Dentistry in Tirupati"
          className="
            block
            w-full
            h-auto
            select-none
          "
          draggable={false}
          onError={(e) => {
            if (e.target.src !== defaultMobileWebp) {
              e.target.src = defaultMobileWebp;
            }
          }}
        />
      </picture>
    </>
  );
}

export default HeroImage;