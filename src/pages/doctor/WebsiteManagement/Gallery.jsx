// src/pages/doctor/WebsiteManagement/Gallery.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Loader2, 
  Upload, 
  AlertTriangle,
  Info
} from "lucide-react";
import galleryService from "../../../services/website/galleryService";

export default function GalleryCMS() {
  const { triggerToast } = useOutletContext() || {};

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    showOnHomepage: false,
    status: "Active"
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    setLoading(true);
    try {
      const res = await galleryService.getGalleryImages();
      setImages(res.data || []);
    } catch (err) {
      console.error("Failed to load gallery images:", err);
      if (triggerToast) triggerToast("Failed to load gallery images.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Image Helper to Validate WEBP, 1 MB max size, and 800x600 px min resolution (4:3)
  const handleImageUpload = (file) => {
    if (!file) return;

    // 1. File Size Validation (Max 1 MB = 1,048,576 bytes)
    const MAX_SIZE_BYTES = 1 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      if (triggerToast) {
        triggerToast("File Size Error: Maximum file size allowed is 1 MB.", "error");
      }
      return;
    }

    // 2. Strict WEBP format validation
    const isWebpExtension = file.name.toLowerCase().endsWith(".webp");
    const isWebpMime = file.type === "image/webp";

    if (!isWebpExtension && !isWebpMime) {
      if (triggerToast) {
        triggerToast("Format Error: Only WEBP (.webp) images are allowed.", "error");
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // 3. Minimum Resolution Check (800 x 600 px)
        if (width < 800 || height < 600) {
          if (triggerToast) {
            triggerToast(
              `Resolution Error: Image is ${width} × ${height} px. Minimum required resolution is 800 × 600 px (4:3 aspect ratio). Recommended: 1200 × 900 px.`,
              "error"
            );
          }
          return;
        }

        setFormData(prev => ({ ...prev, image: result }));
        setImagePreview(result);

        if (triggerToast) {
          triggerToast(`WEBP Image verified successfully (${width} × ${height} px, 4:3 ratio)!`, "success");
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddModal = () => {
    // 15 Image Capacity Limit Check
    if (images.length >= 15) {
      setIsLimitModalOpen(true);
      return;
    }

    setEditingItem(null);
    setFormData({
      title: "",
      image: "",
      showOnHomepage: false,
      status: "Active"
    });
    setImagePreview("");
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      image: item.image || "",
      showOnHomepage: Boolean(item.showOnHomepage),
      status: item.status || "Active"
    });
    setImagePreview(item.image || "");
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const errs = {};
    if (!formData.title.trim()) errs.title = "Image Title is required.";
    if (!formData.image) errs.image = "Gallery Image is required.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (triggerToast) triggerToast(Object.values(errs)[0], "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        image: formData.image,
        showOnHomepage: formData.showOnHomepage,
        status: formData.status
      };

      if (editingItem) {
        await galleryService.updateGalleryImage(editingItem._id || editingItem.id, payload);
        if (triggerToast) triggerToast("Gallery image updated successfully!", "success");
      } else {
        await galleryService.createGalleryImage(payload);
        if (triggerToast) triggerToast("New Gallery image uploaded successfully!", "success");
      }

      setIsModalOpen(false);
      loadGalleryImages();
    } catch (err) {
      console.error("Failed to save gallery image:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save gallery image.";

      if (err.response?.data?.code === "LIMIT_REACHED") {
        setIsModalOpen(false);
        setIsLimitModalOpen(true);
      } else {
        if (triggerToast) triggerToast(errMsg, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setSubmitting(true);
    try {
      await galleryService.deleteGalleryImage(deletingItem._id || deletingItem.id);
      if (triggerToast) triggerToast("Gallery image deleted successfully!", "success");
      setIsDeleteModalOpen(false);
      loadGalleryImages();
    } catch (err) {
      console.error("Failed to delete gallery image:", err);
      if (triggerToast) triggerToast("Failed to delete gallery image.", "error");
    } finally {
      setSubmitting(false);
      setDeletingItem(null);
    }
  };

  return (
    <div className="space-y-4 select-none font-sans w-full max-w-[1280px] mx-auto pb-8">
      {/* TOP ACTION ROW */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200">
          Capacity: <strong className="text-[#2563EB]">{images.length} / 15</strong> Images
        </span>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4.5 h-9.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Image</span>
        </button>
      </div>

      {/* 2. GALLERY GRID */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
          <span className="text-xs font-semibold">Loading Gallery images...</span>
        </div>
      ) : images.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Gallery Images Found</h3>
          <p className="text-xs text-slate-400">Click "Add Image" to upload your first clinic showcase photo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                
                {/* Image Container */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                        item.showOnHomepage
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-900/80 text-white border-white/20 backdrop-blur-xs"
                      }`}
                    >
                      Homepage: {item.showOnHomepage ? "ON" : "OFF"}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="px-4 pt-1">
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-50/70 border-t border-slate-100 mt-3">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(item)}
                  className="px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenDeleteModal(item)}
                  className="px-3 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          ADD / EDIT MODAL
      ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#0E2A6D]" />
                {editingItem ? "Edit Gallery Image" : "Add Gallery Image"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Image Title */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="e.g. Modern Dental Treatment Suite"
                  className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
              </div>

              {/* WEBP Image Upload Field */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Gallery Image (.WEBP Only, Max 1 MB) *
                </label>

                <div className="relative h-44 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center p-2 overflow-hidden transition-all">
                  {imagePreview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-xl" />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(""); setFormData(p => ({ ...p, image: "" })); }}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-1.5 text-center p-4">
                      <Upload className="w-7 h-7 text-[#0E2A6D]" />
                      <span className="text-xs font-bold text-[#0E2A6D]">Upload WEBP Image</span>
                      <span className="text-[10px] text-slate-400">Drag & drop or click to select</span>
                      <input
                        type="file"
                        accept=".webp,image/webp"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Helper Text Notice */}
                <div className="p-3 bg-sky-50/80 border border-sky-200/80 rounded-2xl flex items-start gap-2 text-[11px] text-slate-700 leading-relaxed">
                  <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Recommended:</strong> WEBP format, 1200 × 900 px (4:3), maximum file size 1 MB.
                  </div>
                </div>
              </div>

              {/* Show on Homepage Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-900">Show on Homepage</span>
                  <span className="block text-[11px] text-slate-500">
                    ON $\rightarrow$ Displays in Homepage Gallery (Max 8 images). OFF $\rightarrow$ Dedicated page only.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, showOnHomepage: !prev.showOnHomepage }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.showOnHomepage ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      formData.showOnHomepage ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 h-9 rounded-xl bg-[#0E2A6D] hover:bg-[#0a1e4e] disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{submitting ? "Saving..." : editingItem ? "Save Changes" : "Upload Image"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          GALLERY LIMIT REACHED MODAL
      ========================================================= */}
      {isLimitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900">Gallery Limit Reached</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have reached the maximum limit of 15 gallery images. Please delete an existing image before adding a new one.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLimitModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => setIsLimitModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#0E2A6D] hover:bg-[#0a1e4e] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Manage Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}
      {isDeleteModalOpen && deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Delete Gallery Image</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete this gallery image?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{submitting ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
