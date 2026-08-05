// src/pages/doctor/WebsiteManagement/Treatments.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Stethoscope, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  AlertCircle,
  Tag,
  Eye,
  CheckCircle2,
  Home,
  ArrowUpDown,
  ListOrdered
} from "lucide-react";
import treatmentService from "../../../services/website/treatmentService";

export default function TreatmentsCMS() {
  const { triggerToast } = useOutletContext() || {};

  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Drawer States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [deletingTreatment, setDeletingTreatment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Field States
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    previewDescription: "",
    fullDescription: "",
    highlights: [],
    status: "Active",
    showOnHomepage: true,
    homepageOrder: 1,
    displayOrder: 1
  });
  const [newHighlightInput, setNewHighlightInput] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    setLoading(true);
    try {
      const response = await treatmentService.getTreatments();
      setTreatments(response.data || []);
    } catch (err) {
      console.error("Failed to load treatments:", err);
      if (triggerToast) triggerToast("Failed to load treatments.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTreatment(null);
    setFormData({
      name: "",
      image: "",
      previewDescription: "",
      fullDescription: "",
      highlights: ["Painless Procedure", "Advanced Technology"],
      status: "Active",
      showOnHomepage: true,
      homepageOrder: treatments.length + 1,
      displayOrder: treatments.length + 1
    });
    setImagePreview("");
    setNewHighlightInput("");
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (treatment) => {
    setEditingTreatment(treatment);
    setFormData({
      name: treatment.name || "",
      image: treatment.image || "",
      previewDescription: treatment.previewDescription || "",
      fullDescription: treatment.fullDescription || "",
      highlights: Array.isArray(treatment.highlights) && treatment.highlights.length > 0
        ? [...treatment.highlights]
        : ["Painless Procedure"],
      status: treatment.status || "Active",
      showOnHomepage: treatment.showOnHomepage !== undefined ? Boolean(treatment.showOnHomepage) : true,
      homepageOrder: treatment.homepageOrder || 1,
      displayOrder: treatment.displayOrder || 1
    });
    setImagePreview(treatment.image || "");
    setNewHighlightInput("");
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (treatment) => {
    setDeletingTreatment(treatment);
    setIsDeleteModalOpen(true);
  };

  // Image Upload Handler (.webp strictly validated)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isWebpType = file.type === "image/webp" || fileName.endsWith(".webp");

    if (!isWebpType) {
      const msg = "Only WEBP (.webp) images are allowed. Please upload a .webp image file.";
      setFormErrors(prev => ({ ...prev, image: msg }));
      if (triggerToast) triggerToast(msg, "error");
      return;
    }

    setFormErrors(prev => ({ ...prev, image: "" }));

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setImagePreview(base64);
      setFormData(prev => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // Highlight Management Handlers
  const handleAddHighlight = () => {
    const trimmed = newHighlightInput.trim();
    if (!trimmed) return;
    if (formData.highlights.includes(trimmed)) {
      if (triggerToast) triggerToast("Highlight already exists.", "error");
      return;
    }
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, trimmed]
    }));
    setNewHighlightInput("");
    if (formErrors.highlights) setFormErrors(prev => ({ ...prev, highlights: "" }));
  };

  const handleRemoveHighlight = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleEditHighlight = (index, newValue) => {
    setFormData(prev => {
      const updated = [...prev.highlights];
      updated[index] = newValue;
      return { ...prev, highlights: updated };
    });
  };

  // Submit Handler (Add / Edit)
  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();

    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedPreview = formData.previewDescription.trim();
    const trimmedFull = formData.fullDescription.trim();

    if (!trimmedName) errors.name = "Treatment Name is required.";
    if (!editingTreatment && !formData.image) errors.image = "Treatment Image (.webp) is required.";
    if (!trimmedPreview) errors.previewDescription = "Preview Description is required.";
    if (!trimmedFull) errors.fullDescription = "Full Description is required.";
    if (formData.highlights.length === 0) errors.highlights = "At least one highlight is required.";
    if (!formData.homepageOrder || Number(formData.homepageOrder) < 1) {
      errors.homepageOrder = "Homepage Order must be a positive number.";
    }
    if (!formData.displayOrder || Number(formData.displayOrder) < 1) {
      errors.displayOrder = "Display Order must be a positive number.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstError = Object.values(errors)[0];
      if (triggerToast) triggerToast(firstError, "error");
      return;
    }

    setFormErrors({});
    setSubmitting(true);

    const payload = {
      name: trimmedName,
      image: formData.image,
      previewDescription: trimmedPreview,
      fullDescription: trimmedFull,
      highlights: formData.highlights,
      status: formData.status,
      showOnHomepage: formData.showOnHomepage,
      homepageOrder: Number(formData.homepageOrder),
      displayOrder: Number(formData.displayOrder)
    };

    try {
      if (editingTreatment) {
        await treatmentService.updateTreatment(editingTreatment._id || editingTreatment.id, payload);
        if (triggerToast) triggerToast("Treatment updated successfully!", "success");
      } else {
        await treatmentService.createTreatment(payload);
        if (triggerToast) triggerToast("New Treatment created successfully!", "success");
      }
      setIsFormModalOpen(false);
      loadTreatments();
    } catch (err) {
      console.error("Failed to save treatment:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save treatment. Please try again.";
      if (triggerToast) triggerToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deletingTreatment) return;
    setSubmitting(true);
    try {
      await treatmentService.deleteTreatment(deletingTreatment._id || deletingTreatment.id);
      if (triggerToast) triggerToast("Treatment deleted successfully!", "success");
      setIsDeleteModalOpen(false);
      loadTreatments();
    } catch (err) {
      console.error("Failed to delete treatment:", err);
      if (triggerToast) triggerToast("Failed to delete treatment.", "error");
    } finally {
      setSubmitting(false);
      setDeletingTreatment(null);
    }
  };

  // Filter Treatments
  const filteredTreatments = treatments.filter((t) =>
    (t.name && t.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.previewDescription && t.previewDescription.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 select-none font-sans w-full max-w-[1280px] mx-auto pb-8">
      {/* SEARCH & CONTROLS ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search treatments by name or description..."
            className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
            Total: <strong className="text-[#2563EB]">{filteredTreatments.length}</strong> Treatments
          </span>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4.5 h-9.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs outline-none active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Treatment</span>
          </button>
        </div>
      </div>

      {/* 3. TREATMENT CARDS GRID */}
      {loading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center text-slate-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
          <span className="text-xs font-semibold">Loading Treatments from backend...</span>
        </div>
      ) : filteredTreatments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Treatments Found</h3>
          <p className="text-xs text-slate-400">Click "Add Treatment" to create your first procedure listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment._id || treatment.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Banner - Continuous White Surface */}
                <div className="relative flex h-44 w-full items-center justify-center bg-white p-3 border-b border-slate-100/60">
                  {treatment.image ? (
                    <img
                      src={treatment.image}
                      alt={treatment.name}
                      className="max-h-full max-w-full object-contain object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${
                        treatment.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {treatment.status || "Active"}
                    </span>

                    {/* Show on Homepage Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border shadow-2xs flex items-center gap-1 ${
                        treatment.showOnHomepage !== false
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <Home className="w-2.5 h-2.5" />
                      <span>{treatment.showOnHomepage !== false ? "Homepage: ON" : "Homepage: OFF"}</span>
                    </span>
                  </div>

                  {/* Order Indicators */}
                  <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
                    {treatment.showOnHomepage !== false && (
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-md">
                        HP Order: #{treatment.homepageOrder || 1}
                      </span>
                    )}
                    <span className="bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[9px] font-bold px-2 py-0.5 rounded-md">
                      Page Order: #{treatment.displayOrder || 1}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2.5">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {treatment.name}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                    {treatment.previewDescription}
                  </p>

                  {/* Highlights Tags */}
                  {Array.isArray(treatment.highlights) && treatment.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {treatment.highlights.slice(0, 3).map((h, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/60">
                          ✓ {h}
                        </span>
                      ))}
                      {treatment.highlights.length > 3 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                          +{treatment.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100/80 mt-3 pt-3">
                <span className="text-[10px] font-mono text-slate-400">
                  {treatment._id ? `ID: ${treatment._id.slice(-6)}` : ""}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(treatment)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDeleteModal(treatment)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. ADD / EDIT TREATMENT MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#0E2A6D]" />
                {editingTreatment ? "Edit Treatment" : "Add New Treatment"}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Treatment Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Treatment Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }));
                  }}
                  required
                  placeholder="e.g. Laser Root Canal Treatment"
                  className={`h-9.5 w-full rounded-xl border ${formErrors.name ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-slate-50/60"} px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white`}
                />
                {formErrors.name && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Treatment Image Upload (.webp strictly) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Treatment Image (.webp ONLY) *
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setFormData(prev => ({ ...prev, image: "" }));
                        }}
                        className="absolute top-1 right-1 p-1 bg-slate-900/70 text-white rounded-full hover:bg-red-600 transition-all cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                      <span className="text-[9px] font-bold">.WEBP</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all border border-slate-200/80">
                      <Upload className="w-3.5 h-3.5 text-[#0E2A6D]" />
                      <span>{imagePreview ? "Replace .WEBP Image" : "Upload .WEBP Image"}</span>
                      <input
                        type="file"
                        accept="image/webp,.webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      Strictly accept `.webp` files only. High-quality web optimized format.
                    </p>
                  </div>
                </div>
                {formErrors.image && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.image}</p>
                )}
              </div>

              {/* Preview Description (Homepage Short Text) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Preview Description (Homepage) *
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${
                    formData.previewDescription.length > 250 ? "text-red-500" : "text-slate-400"
                  }`}>
                    {formData.previewDescription.length} / 250 chars
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={formData.previewDescription}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, previewDescription: e.target.value }));
                    if (formErrors.previewDescription) setFormErrors(prev => ({ ...prev, previewDescription: "" }));
                  }}
                  required
                  maxLength={250}
                  placeholder="Short 1-2 sentence preview for homepage treatment card..."
                  className={`w-full rounded-xl border ${formErrors.previewDescription ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-slate-50/60"} p-3 font-medium text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white`}
                />
                {formErrors.previewDescription && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.previewDescription}</p>
                )}
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Description (Details Page) *
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, fullDescription: e.target.value }));
                    if (formErrors.fullDescription) setFormErrors(prev => ({ ...prev, fullDescription: "" }));
                  }}
                  required
                  placeholder="Detailed multi-paragraph description of procedure, process, and clinical benefits..."
                  className={`w-full rounded-xl border ${formErrors.fullDescription ? "border-red-400 bg-red-50/30" : "border-slate-200 bg-slate-50/60"} p-3 font-medium text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white`}
                />
                {formErrors.fullDescription && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.fullDescription}</p>
                )}
              </div>

              {/* Treatment Highlights */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Treatment Highlights *
                </label>

                {/* Add Highlight Bar */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newHighlightInput}
                    onChange={(e) => setNewHighlightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    placeholder="Add a key feature (e.g. Painless Procedure, Faster Recovery)..."
                    className="h-9 flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-semibold text-slate-800 outline-none focus:border-[#0E2A6D]"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3.5 h-9 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                {/* Highlights Editable List */}
                <div className="space-y-1.5 pt-1">
                  {formData.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                      <Tag className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => handleEditHighlight(idx, e.target.value)}
                        className="flex-1 bg-transparent font-bold text-slate-800 outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove Highlight"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                {formErrors.highlights && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.highlights}</p>
                )}
              </div>

              {/* NEW HOMEPAGE & ORDERING CONTROLS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                {/* 1. Show on Homepage Toggle */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Show on Homepage
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, showOnHomepage: !prev.showOnHomepage }))}
                    className={`w-full h-9.5 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.showOnHomepage
                        ? "bg-sky-50 border-sky-300 text-sky-800 shadow-2xs"
                        : "bg-slate-200/80 border-slate-300 text-slate-600"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>{formData.showOnHomepage ? "ON (Show)" : "OFF (Hide)"}</span>
                  </button>
                </div>

                {/* 2. Homepage Order */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Homepage Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.homepageOrder}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, homepageOrder: e.target.value }));
                      if (formErrors.homepageOrder) setFormErrors(prev => ({ ...prev, homepageOrder: "" }));
                    }}
                    disabled={!formData.showOnHomepage}
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] disabled:opacity-50"
                  />
                  {formErrors.homepageOrder && (
                    <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.homepageOrder}</p>
                  )}
                </div>

                {/* 3. Treatments Page Display Order */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, displayOrder: e.target.value }));
                      if (formErrors.displayOrder) setFormErrors(prev => ({ ...prev, displayOrder: "" }));
                    }}
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D]"
                  />
                  {formErrors.displayOrder && (
                    <p className="text-[10px] font-semibold text-red-500 mt-1">{formErrors.displayOrder}</p>
                  )}
                </div>
              </div>

              {/* Status Select */}
              <div className="pt-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-xs font-extrabold cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === "Active"}
                      onChange={() => setFormData(prev => ({ ...prev, status: "Active" }))}
                      className="accent-[#0E2A6D]"
                    />
                    <span>Active (Displayed on Website)</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs font-extrabold cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formData.status === "Inactive"}
                      onChange={() => setFormData(prev => ({ ...prev, status: "Inactive" }))}
                      className="accent-[#0E2A6D]"
                    />
                    <span>Inactive (Hidden)</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
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
                  <span>{submitting ? "Saving..." : editingTreatment ? "Save Changes" : "Create Treatment"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && deletingTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Delete Treatment</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete <strong className="text-slate-900">{deletingTreatment.name}</strong>? This action will permanently remove it from the database.
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
                <span>{submitting ? "Deleting..." : "Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
