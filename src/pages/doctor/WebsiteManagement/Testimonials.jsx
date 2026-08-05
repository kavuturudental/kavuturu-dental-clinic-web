// src/pages/doctor/WebsiteManagement/Testimonials.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Loader2, 
  Star,
  Quote,
  Calendar,
  User,
  AlertTriangle
} from "lucide-react";
import testimonialService from "../../../services/website/testimonialService";

export default function TestimonialsCMS() {
  const { triggerToast } = useOutletContext() || {};

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form State (Patient Name, Review Comment, Rating, Review Date)
  const [formData, setFormData] = useState({
    patientName: "",
    comment: "",
    rating: 5,
    reviewDate: "",
    status: "Active"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const res = await testimonialService.getTestimonials();
      setTestimonials(res.data || []);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      if (triggerToast) triggerToast("Failed to load testimonials.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    // 15 Review Capacity Limit Check
    if (testimonials.length >= 15) {
      setIsLimitModalOpen(true);
      return;
    }

    setEditingItem(null);
    setFormData({
      patientName: "",
      comment: "",
      rating: 5,
      reviewDate: "Recent Patient",
      status: "Active"
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      patientName: item.patientName || item.name || "",
      comment: item.comment || item.text || "",
      rating: item.rating || 5,
      reviewDate: item.reviewDate || "Recent Patient",
      status: item.status || "Active"
    });
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
    if (!formData.patientName.trim()) errs.patientName = "Patient Name is required.";
    if (!formData.comment.trim()) errs.comment = "Review Comment is required.";
    if (!formData.reviewDate.trim()) errs.reviewDate = "Review Date is required.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (triggerToast) triggerToast(Object.values(errs)[0], "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        patientName: formData.patientName.trim(),
        comment: formData.comment.trim(),
        rating: Number(formData.rating) || 5,
        reviewDate: formData.reviewDate.trim(),
        status: formData.status
      };

      if (editingItem) {
        await testimonialService.updateTestimonial(editingItem._id || editingItem.id, payload);
        if (triggerToast) triggerToast("Review updated successfully!", "success");
      } else {
        await testimonialService.createTestimonial(payload);
        if (triggerToast) triggerToast("New Review added successfully!", "success");
      }

      setIsModalOpen(false);
      loadTestimonials();
    } catch (err) {
      console.error("Failed to save review:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save review.";

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
      await testimonialService.deleteTestimonial(deletingItem._id || deletingItem.id);
      if (triggerToast) triggerToast("Review deleted successfully!", "success");
      setIsDeleteModalOpen(false);
      loadTestimonials();
    } catch (err) {
      console.error("Failed to delete review:", err);
      if (triggerToast) triggerToast("Failed to delete review.", "error");
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
          Capacity: <strong className="text-[#2563EB]">{testimonials.length} / 15</strong> Reviews
        </span>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4.5 h-9.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Review</span>
        </button>
      </div>

      {/* 2. REVIEWS GRID */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
          <span className="text-xs font-semibold">Loading Testimonials...</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Patient Reviews Found</h3>
          <p className="text-xs text-slate-400">Click "Add Review" to publish your first patient testimonial.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                
                {/* Header: Rating & Quote */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={i < (item.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                      />
                    ))}
                  </div>

                  <Quote className="h-6 w-6 text-slate-200 rotate-180" />
                </div>

                {/* Comment Text */}
                <p className="text-xs leading-relaxed text-slate-600 font-medium line-clamp-4">
                  "{item.comment || item.text}"
                </p>

                {/* Patient Name & Review Date */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 line-clamp-1">
                    <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{item.patientName || item.name}</span>
                  </h3>

                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.reviewDate || "Recent"}
                  </span>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-slate-50/70 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(item)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenDeleteModal(item)}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
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
          ADD / EDIT REVIEW MODAL
      ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0E2A6D]" />
                {editingItem ? "Edit Patient Review" : "Add Patient Review"}
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
              
              {/* Patient Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                  required
                  placeholder="e.g. Rahul Kumar"
                  className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Review Comment *
                </label>
                <textarea
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  required
                  placeholder="Enter the patient's testimonial review..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 font-medium text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
              </div>

              {/* Star Rating Picker & Review Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Rating (1 to 5 Stars) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-1.5 h-9.5 px-3 rounded-xl border border-slate-200 bg-slate-50/60">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          size={18}
                          className={star <= formData.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-slate-700 text-xs">
                      ({formData.rating} Stars)
                    </span>
                  </div>
                </div>

                {/* Review Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Review Date Display *
                  </label>
                  <input
                    type="text"
                    value={formData.reviewDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, reviewDate: e.target.value }))}
                    required
                    placeholder="e.g. 2 weeks ago, 1 month ago, Dec 2026"
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                </div>

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
                  <span>{submitting ? "Saving..." : editingItem ? "Save Changes" : "Add Review"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          REVIEW LIMIT REACHED MODAL
      ========================================================= */}
      {isLimitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900">Review Limit Reached</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have reached the maximum limit of 15 testimonials. Please edit or delete an existing review before adding a new one.
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
                Manage Reviews
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
              <h3 className="text-base font-extrabold text-slate-900">Delete Review</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete this review?
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
