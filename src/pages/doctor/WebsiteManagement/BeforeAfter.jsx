// src/pages/doctor/WebsiteManagement/BeforeAfter.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Loader2, 
  Upload, 
  Image as ImageIcon,
  AlertCircle,
  Info
} from "lucide-react";
import beforeAfterService from "../../../services/website/beforeAfterService";

export default function BeforeAfterCMS() {
  const { triggerToast } = useOutletContext() || {};

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [deletingCase, setDeletingCase] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    treatmentName: "",
    beforeImage: "",
    afterImage: "",
    showOnHomepage: false,
    homepageOrder: 1,
    displayOrder: 1,
    status: "Active"
  });

  const [beforePreview, setBeforePreview] = useState("");
  const [afterPreview, setAfterPreview] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const res = await beforeAfterService.getBeforeAfterCases();
      setCases(res.data || []);
    } catch (err) {
      console.error("Failed to load Before & After cases:", err);
      if (triggerToast) triggerToast("Failed to load Before & After cases.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Image Helper to Validate WEBP format & Dimensions (Minimum 1000x750 px, Recommended 1200x900 px 4:3)
  const handleImageUpload = (file, imageType) => {
    if (!file) return;

    // 1. WEBP Format Validation
    const isWebpExtension = file.name.toLowerCase().endsWith(".webp");
    const isWebpMime = file.type === "image/webp";

    if (!isWebpExtension && !isWebpMime) {
      if (triggerToast) {
        triggerToast("Format Error: Only WEBP (.webp) images are allowed. Please convert to .webp format.", "error");
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

        // 2. Minimum Resolution Check (1000 x 750 px)
        if (width < 1000 || height < 750) {
          if (triggerToast) {
            triggerToast(
              `Resolution Error: Image is ${width} × ${height} px. Minimum required resolution is 1000 × 750 px (4:3 aspect ratio). Recommended: 1200 × 900 px.`,
              "error"
            );
          }
          return;
        }

        if (imageType === "before") {
          setFormData(prev => ({ ...prev, beforeImage: result }));
          setBeforePreview(result);
        } else {
          setFormData(prev => ({ ...prev, afterImage: result }));
          setAfterPreview(result);
        }

        if (triggerToast) {
          triggerToast(`WEBP Image verified successfully (${width} × ${height} px, 4:3 ratio)!`, "success");
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddModal = () => {
    setEditingCase(null);
    setFormData({
      treatmentName: "",
      beforeImage: "",
      afterImage: "",
      showOnHomepage: false,
      homepageOrder: cases.length + 1,
      displayOrder: cases.length + 1,
      status: "Active"
    });
    setBeforePreview("");
    setAfterPreview("");
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (caseItem) => {
    setEditingCase(caseItem);
    setFormData({
      treatmentName: caseItem.treatmentName || caseItem.treatment || "",
      beforeImage: caseItem.beforeImage || "",
      afterImage: caseItem.afterImage || "",
      showOnHomepage: Boolean(caseItem.showOnHomepage),
      homepageOrder: caseItem.homepageOrder || 1,
      displayOrder: caseItem.displayOrder || 1,
      status: caseItem.status || "Active"
    });
    setBeforePreview(caseItem.beforeImage || "");
    setAfterPreview(caseItem.afterImage || "");
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (caseItem) => {
    setDeletingCase(caseItem);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const errs = {};
    if (!formData.treatmentName.trim()) errs.treatmentName = "Treatment Name is required.";
    if (!formData.beforeImage) errs.beforeImage = "Before Image is required.";
    if (!formData.afterImage) errs.afterImage = "After Image is required.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (triggerToast) triggerToast(Object.values(errs)[0], "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        treatmentName: formData.treatmentName.trim(),
        beforeImage: formData.beforeImage,
        afterImage: formData.afterImage,
        showOnHomepage: formData.showOnHomepage,
        homepageOrder: Number(formData.homepageOrder) || 1,
        displayOrder: Number(formData.displayOrder) || 1,
        status: formData.status
      };

      if (editingCase) {
        await beforeAfterService.updateBeforeAfterCase(editingCase._id || editingCase.id, payload);
        if (triggerToast) triggerToast("Before & After case updated successfully!", "success");
      } else {
        await beforeAfterService.createBeforeAfterCase(payload);
        if (triggerToast) triggerToast("New Before & After case added successfully!", "success");
      }

      setIsModalOpen(false);
      loadCases();
    } catch (err) {
      console.error("Failed to save Before & After case:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save Before & After case.";
      if (triggerToast) triggerToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCase) return;
    setSubmitting(true);
    try {
      await beforeAfterService.deleteBeforeAfterCase(deletingCase._id || deletingCase.id);
      if (triggerToast) triggerToast("Before & After case deleted successfully!", "success");
      setIsDeleteModalOpen(false);
      loadCases();
    } catch (err) {
      console.error("Failed to delete case:", err);
      if (triggerToast) triggerToast("Failed to delete case.", "error");
    } finally {
      setSubmitting(false);
      setDeletingCase(null);
    };
  }

  return (
    <div className="space-y-4 select-none font-sans w-full max-w-[1280px] mx-auto pb-8">
      {/* TOP ACTION ROW */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4.5 h-9.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Before & After</span>
        </button>
      </div>

      {/* 2. CASES LIST */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
          <span className="text-xs font-semibold">Loading Before & After cases...</span>
        </div>
      ) : cases.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Transformations Found</h3>
          <p className="text-xs text-slate-400">Click "Add Before & After" to publish your first treatment case.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                
                {/* Badges Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${
                        item.showOnHomepage
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      Homepage: {item.showOnHomepage ? "ON" : "OFF"}
                    </span>

                    {item.showOnHomepage && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                        HP Order: #{item.homepageOrder || 1}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    Page Order: #{item.displayOrder || 1}
                  </span>
                </div>

                {/* Images Preview Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Before */}
                  <div className="space-y-1">
                    <span className="block text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Before
                    </span>
                    <div className="h-32 w-full rounded-2xl bg-white p-2 border border-slate-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.beforeImage}
                        alt={`${item.treatmentName} Before`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>

                  {/* After */}
                  <div className="space-y-1">
                    <span className="block text-center text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                      After
                    </span>
                    <div className="h-32 w-full rounded-2xl bg-white p-2 border border-emerald-200/70 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.afterImage}
                        alt={`${item.treatmentName} After`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Treatment Name */}
                <div className="pt-1 text-center">
                  <h3 className="text-base font-extrabold text-[#0E2A6D] font-outfit line-clamp-1">
                    {item.treatmentName || item.treatment}
                  </h3>
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
          ADD / EDIT MODAL
      ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0E2A6D]" />
                {editingCase ? "Edit Before & After Case" : "Add Before & After Case"}
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
              
              {/* Treatment Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Treatment Name *
                </label>
                <input
                  type="text"
                  value={formData.treatmentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, treatmentName: e.target.value }))}
                  required
                  placeholder="e.g. Laser Root Canal Treatment"
                  className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
              </div>

              {/* WEBP Image Upload Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Before Image */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Before Image (.WEBP Only) *
                  </label>

                  <div className="relative h-36 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center p-2 overflow-hidden transition-all">
                    {beforePreview ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img src={beforePreview} alt="Before Preview" className="max-h-full max-w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => { setBeforePreview(""); setFormData(p => ({ ...p, beforeImage: "" })); }}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-1.5 text-center p-2">
                        <Upload className="w-6 h-6 text-slate-400" />
                        <span className="text-[11px] font-bold text-[#0E2A6D]">Upload Before (.webp)</span>
                        <input
                          type="file"
                          accept=".webp,image/webp"
                          onChange={(e) => handleImageUpload(e.target.files[0], "before")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* After Image */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    After Image (.WEBP Only) *
                  </label>

                  <div className="relative h-36 w-full rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/50 flex flex-col items-center justify-center p-2 overflow-hidden transition-all">
                    {afterPreview ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img src={afterPreview} alt="After Preview" className="max-h-full max-w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => { setAfterPreview(""); setFormData(p => ({ ...p, afterImage: "" })); }}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-1.5 text-center p-2">
                        <Upload className="w-6 h-6 text-emerald-600" />
                        <span className="text-[11px] font-bold text-emerald-700">Upload After (.webp)</span>
                        <input
                          type="file"
                          accept=".webp,image/webp"
                          onChange={(e) => handleImageUpload(e.target.files[0], "after")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

              </div>

              {/* Required Specifications Helper Text */}
              <div className="p-3 bg-sky-50/80 border border-sky-200/80 rounded-2xl flex items-start gap-2 text-[11px] text-slate-700 leading-relaxed">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Recommended:</strong> WEBP format, 1200 × 900 px (4:3). Both Before and After images should have the same dimensions for the best display quality.
                </div>
              </div>

              {/* Homepage Toggle & Ordering Inputs */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                
                {/* Show on Homepage Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Show on Homepage</span>
                    <span className="block text-[11px] text-slate-500">
                      ON $\rightarrow$ Displays in Homepage Section (Max 3 items). OFF $\rightarrow$ Dedicated page only.
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

                {/* Homepage Order & Display Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Homepage Order {formData.showOnHomepage ? "(Active)" : "(Inactive)"}
                    </label>
                    <input
                      type="number"
                      min="1"
                      disabled={!formData.showOnHomepage}
                      value={formData.homepageOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, homepageOrder: e.target.value }))}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Display Order (Ascending)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: e.target.value }))}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D]"
                    />
                  </div>
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
                  <span>{submitting ? "Saving..." : editingCase ? "Save Changes" : "Add Case"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}
      {isDeleteModalOpen && deletingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Delete Before & After Case</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete this Before & After case?
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
