// src/components/gallery/GalleryLightboxModal.jsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const GalleryLightboxModal = ({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  setCurrentIndex,
}) => {
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const currentImage = images[currentIndex] || {};

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length, setCurrentIndex]);

  // Lock body scroll & listen for keyboard events
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen || images.length <= 1) return;

    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;

    if (images[nextIndex]?.image) {
      const imgNext = new Image();
      imgNext.src = images[nextIndex].image;
    }
    if (images[prevIndex]?.image) {
      const imgPrev = new Image();
      imgPrev.src = images[prevIndex].image;
    }
  }, [isOpen, currentIndex, images]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;

    // Minimum swipe threshold of 40px
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen || !images.length) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="absolute top-0 inset-x-0 z-50 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white text-xs sm:text-sm font-medium tracking-wide">
          <span className="font-bold text-sky-400">{currentIndex + 1}</span> / {images.length}
        </div>

        <button
          type="button"
          aria-label="Close Lightbox"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation Arrow - Left */}
      <button
        type="button"
        aria-label="Previous Image"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-3 sm:left-6 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 cursor-pointer"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Navigation Arrow - Right */}
      <button
        type="button"
        aria-label="Next Image"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-3 sm:right-6 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 cursor-pointer"
      >
        <ChevronRight size={28} />
      </button>

      {/* Main Image Container */}
      <div
        className="relative max-h-[85vh] max-w-[92vw] sm:max-w-[85vw] md:max-w-[80vw] p-2 flex flex-col items-center justify-center transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={currentImage.id || currentIndex}
          src={currentImage.image}
          alt={currentImage.alt || currentImage.title || "Gallery Showcase"}
          className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl transition-all duration-300 select-none animate-scaleUp"
        />

        {/* Caption */}
        {currentImage.title && (
          <div className="mt-4 text-center">
            <h3 className="text-base sm:text-lg font-bold text-white font-outfit">
              {currentImage.title}
            </h3>
            {currentImage.alt && (
              <p className="mt-1 text-xs text-slate-300 max-w-lg">
                {currentImage.alt}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryLightboxModal;
