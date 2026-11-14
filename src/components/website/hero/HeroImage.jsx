// src/components/website/hero/HeroImage.jsx

import React, { useEffect, useState } from "react";
import { getHeroContent } from "../../../services/website/heroService";

const DEFAULT_DESKTOP = "/images/hero/hero-desktop-1672.webp";
const DEFAULT_MOBILE = "/images/hero/hero-mobile-853.webp";

function HeroImage() {
  const [heroImages, setHeroImages] = useState({
    desktop: DEFAULT_DESKTOP,
    mobile: DEFAULT_MOBILE,
  });

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await getHeroContent();
        if (response.success && response.data) {
          const data = response.data;
          setHeroImages({
            desktop: data.desktopImage || data.heroDesktopImage || data.heroImage || DEFAULT_DESKTOP,
            mobile: data.mobileImage || data.heroMobileImage || data.heroImage || DEFAULT_MOBILE,
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

  // Default (optimised) hero images live in /public so index.html can
  // preload them before the JS bundle runs. If the CMS supplies a custom
  // image we use that instead.
  const desktopSrcSet =
    heroImages.desktop === DEFAULT_DESKTOP
      ? "/images/hero/hero-desktop-1280.webp 1280w, /images/hero/hero-desktop-1672.webp 1672w"
      : heroImages.desktop;
  const mobileSrcSet =
    heroImages.mobile === DEFAULT_MOBILE
      ? "/images/hero/hero-mobile-480.webp 480w, /images/hero/hero-mobile-720.webp 720w, /images/hero/hero-mobile-853.webp 853w"
      : heroImages.mobile;

  return (
    <picture className="block">
      <source
        media="(min-width: 1024px)"
        srcSet={desktopSrcSet}
        sizes="100vw"
        width="1672"
        height="941"
      />
      <img
        src={heroImages.mobile}
        srcSet={mobileSrcSet}
        sizes="100vw"
        width="853"
        height="938"
        alt="Advanced Laser & Implant Dentistry in Tirupati"
        className="block w-full h-auto select-none"
        fetchPriority="high"
        decoding="sync"
        draggable={false}
        onError={(e) => {
          if (!e.target.src.includes("/images/hero/")) {
            e.target.srcset = "";
            e.target.src = DEFAULT_MOBILE;
          }
        }}
      />
    </picture>
  );
}

export default HeroImage;
