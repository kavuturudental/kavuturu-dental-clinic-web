// src/pages/doctor/WebsiteManagement/Doctors.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  UserCheck, 
  Sparkles, 
  Lock, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Loader2, 
  Clock, 
  Users
} from "lucide-react";
import doctorCmsService from "../../../services/website/doctorCmsService";
import { getStatIcon } from "../../../utils/statIconHelper";
import featuredDoctorImg from "../../../assets/images/doctors/dr-ravindra-babu.webp";

export default function DoctorsCMS() {
  const { triggerToast } = useOutletContext() || {};

  // Section 1: Featured Doctor State
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredSaving, setFeaturedSaving] = useState(false);
  const [featuredForm, setFeaturedForm] = useState({
    name: "",
    qualification: "",
    specialization: "",
    profileSummary: "",
    stats: []
  });
  const [newStat, setNewStat] = useState({ value: "", label: "" });

  // Section 2: Secondary Doctors List State
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deletingDoctor, setDeletingDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    qualification: "",
    specialization: "",
    profileSummary: "",
    experience: "",
    displayOrder: 1
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFeaturedDoctor();
    loadAllDoctors();
  }, []);

  const loadFeaturedDoctor = async () => {
    setFeaturedLoading(true);
    try {
      const res = await doctorCmsService.getFeaturedDoctor();
      if (res.data) {
        setFeaturedForm({
          name: res.data.name || "",
          qualification: res.data.qualification || "",
          specialization: res.data.specialization || "",
          profileSummary: res.data.profileSummary || "",
          stats: Array.isArray(res.data.stats) ? res.data.stats : []
        });
      }
    } catch (err) {
      console.error("Failed to load featured doctor:", err);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const loadAllDoctors = async () => {
    setDoctorsLoading(true);
    try {
      const res = await doctorCmsService.getAllDoctors();
      // EXPLICIT FILTER & SORT: Exclude Featured Doctor and sort secondary doctors by displayOrder ascending
      const secondaryList = (res.data || [])
        .filter(d => 
          !d.isFeatured && 
          !(d.name && d.name.toLowerCase().includes("ravindra"))
        )
        .sort((a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1));
      setDoctors(secondaryList);
    } catch (err) {
      console.error("Failed to load secondary doctors list:", err);
    } finally {
      setDoctorsLoading(false);
    }
  };

  // Section 1: Save Featured Doctor
  const handleSaveFeatured = async (e) => {
    if (e) e.preventDefault();

    if (!featuredForm.name.trim() || !featuredForm.qualification.trim() || !featuredForm.specialization.trim() || !featuredForm.profileSummary.trim()) {
      if (triggerToast) triggerToast("All Featured Doctor fields are required.", "error");
      return;
    }

    setFeaturedSaving(true);
    try {
      await doctorCmsService.updateFeaturedDoctor(featuredForm);
      if (triggerToast) triggerToast("Homepage Featured Doctor updated successfully!", "success");
      loadAllDoctors();
    } catch (err) {
      console.error("Failed to save featured doctor:", err);
      if (triggerToast) triggerToast("Failed to update Featured Doctor.", "error");
    } finally {
      setFeaturedSaving(false);
    }
  };

  // Featured Doctor Stat Handlers
  const handleAddStat = () => {
    if (!newStat.value.trim() || !newStat.label.trim()) {
      if (triggerToast) triggerToast("Statistic Value and Label are required.", "error");
      return;
    }
    setFeaturedForm(prev => ({
      ...prev,
      stats: [...prev.stats, { value: newStat.value.trim(), label: newStat.label.trim() }]
    }));
    setNewStat({ value: "", label: "" });
  };

  const handleRemoveStat = (index) => {
    setFeaturedForm(prev => ({
      ...prev,
      stats: prev.stats.filter((_, idx) => idx !== index)
    }));
  };

  const handleEditStat = (index, field, val) => {
    setFeaturedForm(prev => {
      const updated = [...prev.stats];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, stats: updated };
    });
  };

  // Section 2: Secondary Doctors Management Handlers
  const handleOpenAddModal = () => {
    setEditingDoctor(null);
    const nextOrder = doctors.reduce((max, d) => Math.max(max, Number(d.displayOrder) || 0), 0) + 1;
    setDoctorForm({
      name: "",
      qualification: "",
      specialization: "",
      profileSummary: "",
      experience: "",
      displayOrder: nextOrder
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doc) => {
    setEditingDoctor(doc);
    setDoctorForm({
      name: doc.name || "",
      qualification: doc.qualification || "",
      specialization: doc.specialization || "",
      profileSummary: doc.profileSummary || "",
      experience: doc.experience || "",
      displayOrder: doc.displayOrder || 1
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (doc) => {
    setDeletingDoctor(doc);
    setIsDeleteModalOpen(true);
  };

  const handleDoctorSubmit = async (e) => {
    if (e) e.preventDefault();

    const errs = {};
    if (!doctorForm.name.trim()) errs.name = "Doctor Name is required.";
    if (!doctorForm.qualification.trim()) errs.qualification = "Qualification is required.";
    if (!doctorForm.specialization.trim()) errs.specialization = "Specialization is required.";
    if (!doctorForm.profileSummary.trim()) errs.profileSummary = "Profile Summary is required.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (triggerToast) triggerToast(Object.values(errs)[0], "error");
      return;
    }

    // Client-side duplicate check: Name, Qualification, Specialization, and Experience all matching
    const isDuplicate = doctors.some(d => {
      if (editingDoctor && (d._id || d.id) === (editingDoctor._id || editingDoctor.id)) return false;
      return (
        d.name.trim().toLowerCase() === doctorForm.name.trim().toLowerCase() &&
        (d.qualification || "").trim().toLowerCase() === doctorForm.qualification.trim().toLowerCase() &&
        (d.specialization || "").trim().toLowerCase() === doctorForm.specialization.trim().toLowerCase() &&
        (d.experience || "").trim().toLowerCase() === (doctorForm.experience || "").trim().toLowerCase()
      );
    });

    if (isDuplicate) {
      if (triggerToast) triggerToast("Duplicate doctor details! A doctor with identical Name, Qualification, Specialization, and Experience already exists.", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingDoctor) {
        await doctorCmsService.updateDoctor(editingDoctor._id || editingDoctor.id, doctorForm);
        if (triggerToast) triggerToast("Doctor updated successfully!", "success");
      } else {
        await doctorCmsService.createDoctor(doctorForm);
        if (triggerToast) triggerToast("New Doctor added successfully!", "success");
      }
      setIsModalOpen(false);
      loadAllDoctors();
    } catch (err) {
      console.error("Failed to save doctor:", err);
      const errMsg = err.response?.data?.message || "Failed to save doctor.";
      if (triggerToast) triggerToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDoctor) return;
    setSubmitting(true);
    try {
      await doctorCmsService.deleteDoctor(deletingDoctor._id || deletingDoctor.id);
      if (triggerToast) triggerToast("Doctor deleted successfully!", "success");
      setIsDeleteModalOpen(false);
      loadAllDoctors();
    } catch (err) {
      console.error("Failed to delete doctor:", err);
      if (triggerToast) triggerToast("Failed to delete doctor.", "error");
    } finally {
      setSubmitting(false);
      setDeletingDoctor(null);
    }
  };

  return (
    <div className="space-y-4 select-none font-sans w-full max-w-[1280px] mx-auto pb-8">
      {/* SECTION 1: HOMEPAGE FEATURED DOCTOR */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Section 1 – Homepage Featured Doctor
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Chief Dental Specialist displayed on Homepage and top of Doctors Page.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveFeatured}
            disabled={featuredSaving || featuredLoading}
            className="px-4.5 h-9.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
          >
            {featuredSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400" />
            )}
            <span>{featuredSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

        {featuredLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
            <Loader2 className="w-7 h-7 animate-spin text-[#0E2A6D]" />
            <span className="text-xs font-semibold">Loading Featured Doctor...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Locked Doctor Image */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Doctor Image (LOCKED)
              </label>
              <div className="relative w-full aspect-4/5 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                <img
                  src={featuredDoctorImg}
                  alt={featuredForm.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-4 text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-extrabold">Image Locked by System</span>
                  <p className="text-[10px] text-slate-200 font-medium max-w-[200px]">
                    Project doctor images are fixed assets and cannot be edited or deleted.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Editable Featured Fields */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Doctor Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  value={featuredForm.name}
                  onChange={(e) => setFeaturedForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g. Dr. K. Ravindra Babu"
                  className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white text-xs"
                />
              </div>

              {/* Qualification & Specialization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    value={featuredForm.qualification}
                    onChange={(e) => setFeaturedForm(prev => ({ ...prev, qualification: e.target.value }))}
                    required
                    placeholder="e.g. BDS, MDS (Endodontics)"
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    value={featuredForm.specialization}
                    onChange={(e) => setFeaturedForm(prev => ({ ...prev, specialization: e.target.value }))}
                    required
                    placeholder="e.g. Root Canal Specialist & Dental Surgeon"
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Profile Summary */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Profile Summary *
                </label>
                <textarea
                  rows={3}
                  value={featuredForm.profileSummary}
                  onChange={(e) => setFeaturedForm(prev => ({ ...prev, profileSummary: e.target.value }))}
                  required
                  placeholder="Comprehensive bio and clinical experience background..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 font-medium text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white text-xs"
                />
              </div>

              {/* =========================================================
                  REDESIGNED PREMIUM APPLE-INSPIRED STATISTICS CARDS
              ========================================================= */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Doctor Statistics Cards
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Icons auto-selected based on label keywords
                  </span>
                </div>

                {/* Add Stat Input Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
                  <input
                    type="text"
                    value={newStat.value}
                    onChange={(e) => setNewStat(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Value (e.g. 25,000+)"
                    className="sm:col-span-2 h-9 rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-900 outline-none text-xs"
                  />
                  <input
                    type="text"
                    value={newStat.label}
                    onChange={(e) => setNewStat(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Label (e.g. Happy Patients)"
                    className="sm:col-span-2 h-9 rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-900 outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddStat}
                    className="h-9 bg-[#0E2A6D] hover:bg-[#0a1e4e] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    + Add Stat
                  </button>
                </div>

                {/* Clean, Premium Apple-Inspired Rectangular Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3.5 pt-1">
                  {featuredForm.stats.map((st, idx) => {
                    const StatIcon = getStatIcon(st.label || "");
                    return (
                      <div
                        key={idx}
                        className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 transition-all duration-300 hover:border-sky-300 hover:shadow-md"
                      >
                        {/* Top Row: Icon & Delete Button */}
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0E2A6D] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                            <StatIcon className="w-4.5 h-4.5" />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveStat(idx)}
                            className="p-1 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove Statistic"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Editable Value & Label Inputs */}
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={st.value}
                            onChange={(e) => handleEditStat(idx, "value", e.target.value)}
                            placeholder="Value"
                            className="w-full bg-slate-50/70 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-sky-300 rounded-lg px-2.5 py-1 font-extrabold text-[#0E2A6D] text-base font-outfit outline-none transition-all"
                          />
                          <input
                            type="text"
                            value={st.label}
                            onChange={(e) => handleEditStat(idx, "label", e.target.value)}
                            placeholder="Label"
                            className="w-full bg-slate-50/70 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-sky-300 rounded-lg px-2.5 py-1 font-semibold text-slate-600 text-xs outline-none transition-all"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* =========================================================
          SECTION 2: DOCTORS PAGE MANAGEMENT (ADDITIONAL DOCTORS ONLY)
      ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Section 2 – Doctors Page Management
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Manage additional visiting specialists displayed on the Doctors Page (Featured Doctor excluded).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4.5 h-9.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Doctor</span>
          </button>
        </div>

        {/* Secondary Doctors Grid */}
        {doctorsLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
            <Loader2 className="w-7 h-7 animate-spin text-[#0E2A6D]" />
            <span className="text-xs font-semibold">Loading Additional Doctors...</span>
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-xs font-bold text-slate-700">No Additional Doctors Added</h3>
            <p className="text-[11px] text-slate-400">Click "Add Doctor" to list visiting specialists on the Doctors page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doc) => (
              <div
                key={doc._id || doc.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      Display Order: #{doc.displayOrder || 1}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doc.status || "Active"}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 pt-1">
                    {doc.name}
                  </h3>

                  <p className="text-xs font-bold text-sky-700">
                    {doc.qualification}
                  </p>

                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {doc.specialization}
                  </p>

                  <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed pt-1">
                    {doc.profileSummary}
                  </p>

                  {/* Optional Experience Field Check */}
                  {doc.experience ? (
                    <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>{doc.experience} Experience</span>
                    </div>
                  ) : (
                    <div className="pt-1 text-[10px] font-semibold text-slate-400 italic">
                      (No Experience Specified)
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(doc)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDeleteModal(doc)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          ADD / EDIT DOCTOR MODAL
      ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#0E2A6D]" />
                {editingDoctor ? "Edit Additional Doctor" : "Add New Additional Doctor"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDoctorSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Doctor Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g. Dr. S. A. Rahaman"
                  className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
              </div>

              {/* Qualification & Specialization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    value={doctorForm.qualification}
                    onChange={(e) => setDoctorForm(prev => ({ ...prev, qualification: e.target.value }))}
                    required
                    placeholder="e.g. BDS, MDS (Oral Surgery)"
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm(prev => ({ ...prev, specialization: e.target.value }))}
                    required
                    placeholder="e.g. Consultant Oral Surgeon"
                    className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                </div>
              </div>

              {/* Profile Summary */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Profile Summary / Area of Expertise *
                </label>
                <textarea
                  rows={3}
                  value={doctorForm.profileSummary}
                  onChange={(e) => setDoctorForm(prev => ({ ...prev, profileSummary: e.target.value }))}
                  required
                  placeholder="Specialist expertise summary..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 font-medium text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
              </div>

              {/* Optional Experience & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="e.g. 10+ Years (Leave empty to omit)"
                    className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Order (Ascending)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={doctorForm.displayOrder}
                    onChange={(e) => setDoctorForm(prev => ({ ...prev, displayOrder: e.target.value }))}
                    className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-900 outline-none focus:border-[#0E2A6D]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 h-9 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs outline-none active:scale-98"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 h-9 rounded-xl disabled:opacity-50 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98 ${
                    editingDoctor ? "bg-[#2563EB] hover:bg-[#1D4ED8]" : "bg-[#16A34A] hover:bg-[#15803D]"
                  }`}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Check className="w-4 h-4 text-white" />
                  )}
                  <span>{submitting ? "Saving..." : editingDoctor ? "Save Changes" : "Add Doctor"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}
      {isDeleteModalOpen && deletingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Delete Doctor</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete <strong className="text-slate-900">{deletingDoctor.name}</strong>? This action will remove the doctor from the Doctors page.
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
