// src/components/gallery/GalleryGrid.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GalleryCard from "./GalleryCard";
import GalleryLightboxModal from "./GalleryLightboxModal";
import staticGalleryData from "../../../data/website/galleryData";
import { getGalleryImages } from "../../../services/website/galleryService";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const GalleryGrid = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imagesList, setImagesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllGalleryImages = async () => {
      try {
        const response = await getGalleryImages();
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setImagesList(response.data);
        } else {
          setImagesList(staticGalleryData);
        }
      } catch (err) {
        console.error("Failed to load gallery images:", err);
        setImagesList(staticGalleryData);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGalleryImages();
  }, []);

  const displayList = imagesList.length > 0 ? imagesList : staticGalleryData;

  const handleCardClick = (index) => {
    setActiveImageIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <section
      id="gallery-section"
      className="bg-white py-16 lg:py-24"
      aria-labelledby="gallery-grid-heading"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
            Clinic Gallery
          </span>

          <h2
            id="gallery-grid-heading"
            className="mt-6 text-3xl font-bold tracking-tight text-[#0E2A6D] sm:text-4xl md:text-5xl font-outfit"
          >
            Explore Moments From Our Clinic
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Browse our collection of clinic interiors, treatment rooms, consultations, facilities, and memorable patient moments.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {displayList.map((item, idx) => (
            <motion.div key={item._id || item.id || idx} variants={itemVariants}>
              <GalleryCard
                image={item.image}
                alt={item.alt || item.title}
                title={item.title}
                onClick={() => handleCardClick(idx)}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Reusable Lightbox Modal */}
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

export default GalleryGrid;
