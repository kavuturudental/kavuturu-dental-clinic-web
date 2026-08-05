// src/components/doctor/website/ImageUploadPreview.jsx

import React, { useState, useEffect } from "react";
import { Upload, RefreshCw, Eye, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageUploadPreview({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  aspectRatio = "h-40",
  maxSizeMB = 5,
  triggerToast
}) {
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [value]);

  const isValidUrl =
    value &&
    typeof value === "string" &&
    value.trim() !== "" &&
    value !== "null" &&
    value !== "undefined" &&
    value !== "broken-url";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!validTypes.includes(file.type) && !["jpg", "jpeg", "png", "webp"].includes(ext)) {
      if (triggerToast) triggerToast("Invalid file format! Only JPG, PNG, and WEBP are supported.", "error");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      if (triggerToast) triggerToast(`File size exceeds ${maxSizeMB} MB limit.`, "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setHasError(false);
      if (onChange) onChange(event.target.result);
      if (triggerToast) triggerToast("Image uploaded successfully!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleImageError = () => {
    setHasError(true);
  };

  const handleRemoveImage = (e) => {
    if (e) e.stopPropagation();
    setHasError(false);
    if (onRemove) onRemove();
    if (triggerToast) triggerToast("Image removed.", "info");
  };

  const showPreview = isValidUrl && !hasError;

  return (
    <div className="space-y-1 select-none font-sans w-full">
      {label && (
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      {showPreview ? (
        /* 1. ACTUAL UPLOADED IMAGE PREVIEW WITH HOVER ACTIONS */
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative w-full ${aspectRatio} rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group bg-slate-100 transition-all`}
        >
          <img
            src={value}
            alt="Preview"
            onError={handleImageError}
            className="w-full h-full object-cover rounded-2xl"
          />

          {/* HOVER OVERLAY WITH 3 ACTIONS: Replace, View, Delete */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center gap-2 p-3 z-10"
              >
                {/* Replace Action */}
                <label className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md">
                  <RefreshCw className="w-3.5 h-3.5 text-[#0E2A6D]" />
                  <span>Replace</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {/* View Full Image */}
                <button
                  type="button"
                  onClick={() => setIsLightBoxOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-700" />
                  <span>View</span>
                </button>

                {/* Delete Image */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* 2. CLEAN UPLOAD AREA PLACEHOLDER (When missing or on error) */
        <label className={`relative w-full ${aspectRatio} rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-[#0E2A6D]/40 transition-all flex flex-col items-center justify-center p-4 cursor-pointer text-center group`}>
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#0E2A6D] shadow-2xs group-hover:scale-105 transition-transform mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">Upload Image</span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            JPG • PNG • WEBP (Max {maxSizeMB}MB)
          </span>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}

      {/* FULL IMAGE LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightBoxOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl p-2 shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
            >
              <button
                type="button"
                onClick={() => setIsLightBoxOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={value}
                alt="Full Preview"
                onError={() => setIsLightBoxOpen(false)}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
