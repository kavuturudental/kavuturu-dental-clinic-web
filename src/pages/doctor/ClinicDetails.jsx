// src/pages/doctor/ClinicDetails.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Phone, 
  MapPin, 
  Clock, 
  Share2, 
  Upload, 
  X, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Map
} from "lucide-react";
import doctorService from "../../services/doctorService";
import { useDialog } from "../../context/DialogContext";

export default function ClinicDetails() {
  const { showConfirm } = useDialog();
  const [formData, setFormData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // 'info', 'contact', 'location', 'hours', 'social'
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const details = doctorService.getClinicDetails();
    // Default fallback values if missing
    if (!details.contact) {
      details.contact = {
        primaryPhone: "+91 98480 12345",
        secondaryPhone: "+91 88860 12345",
        email: "contact@kavuturudental.com",
        whatsapp: "+91 98480 12345"
      };
    }
    if (!details.location) {
      details.location = {
        address: "D.No: 23B-5-1, Opposite SBI Main Branch, Fire Station Road",
        city: "Eluru",
        state: "Andhra Pradesh",
        pincode: "534001",
        googleMapsLink: "https://maps.google.com/?q=Kavuturu+Dental+Clinic+Eluru"
      };
    }
    if (!details.workingHours) {
      details.workingHours = [
        { day: "Monday", openTime: "09:00 AM", closeTime: "08:00 PM", isOpen: true },
        { day: "Tuesday", openTime: "09:00 AM", closeTime: "08:00 PM", isOpen: true },
        { day: "Wednesday", openTime: "09:00 AM", closeTime: "08:00 PM", isOpen: true },
        { day: "Thursday", openTime: "09:00 AM", closeTime: "08:00 PM", isOpen: true },
        { day: "Friday", openTime: "09:00 AM", closeTime: "08:00 PM", isOpen: true },
        { day: "Saturday", openTime: "09:00 AM", closeTime: "08:00 PM", isOpen: true },
        { day: "Sunday", openTime: "09:00 AM", closeTime: "01:00 PM", isOpen: true }
      ];
    }
    if (!details.social) {
      details.social = {
        website: "https://kavuturudental.com",
        googleBusiness: "https://g.page/kavuturudental",
        facebook: "https://facebook.com/kavuturudental",
        instagram: "https://instagram.com/kavuturudental",
        youtube: "https://youtube.com/kavuturudental",
        linkedin: "https://linkedin.com/company/kavuturudental"
      };
    }
    setFormData(JSON.parse(JSON.stringify(details)));
    setInitialData(JSON.parse(JSON.stringify(details)));
  };

  const triggerToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const isDirty = formData && initialData && JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleReset = async () => {
    const confirmed = await showConfirm(
      "Are you sure you want to reset all unsaved changes to the last saved state?",
      "Reset Unsaved Changes",
      "Reset",
      "Cancel"
    );
    if (confirmed) {
      setFormData(JSON.parse(JSON.stringify(initialData)));
      triggerToast("Changes reset", "info");
    }
  };

  const handleSave = () => {
    const result = doctorService.saveClinicDetails(formData);
    if (result.success) {
      setInitialData(JSON.parse(JSON.stringify(formData)));
      triggerToast("Clinic information updated successfully!", "success");
    } else {
      triggerToast(result.message || "Failed to save settings", "error");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!formData) return null;

  return (
    <div className="space-y-6 select-none font-sans w-full max-w-4xl mx-auto pb-24">
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl border shadow-xl text-xs font-semibold ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : toast.type === "info"
                ? "bg-blue-50 border-blue-100 text-blue-700"
                : "bg-rose-50 border-rose-100 text-rose-700"
            }`}
          >
            {toast.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-slate-500" />}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================
          1. FIVE SECTION TABS ONLY (NO DASHBOARD METRICS)
      ==================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar p-1.5 bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        {[
          { id: "info", label: "Clinic Information", icon: Building2 },
          { id: "contact", label: "Contact Information", icon: Phone },
          { id: "location", label: "Clinic Location", icon: MapPin },
          { id: "hours", label: "Working Hours", icon: Clock },
          { id: "social", label: "Social Links", icon: Share2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#0E2A6D] text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>


      {/* ====================================================
          2. TAB CONTENT PANELS
      ==================================================== */}
      
      {/* TAB 1: CLINIC INFORMATION */}
      {activeTab === "info" && (
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-[#0E2A6D]" />
              Clinic Information
            </h3>
            <span className="text-xs text-slate-400 font-medium">Identity & Branding</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Logo Section */}
            <div className="space-y-2 flex flex-col items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Clinic Logo
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden relative group transition-colors"
              >
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Clinic Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 space-y-1">
                    <Upload className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Upload Logo</span>
                  </div>
                )}
              </div>
              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logoUrl: "" })}
                  className="text-[11px] text-rose-600 font-semibold hover:underline"
                >
                  Remove Logo
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </div>

            {/* Inputs Section */}
            <div className="md:col-span-2 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinic Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-semibold text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinic Tagline *
                </label>
                <input
                  type="text"
                  value={formData.tagline || ""}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-semibold text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Registration Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.registrationNo || ""}
                  onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                  placeholder="e.g. AP/MED/2012/8472"
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono font-semibold text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  About Clinic *
                </label>
                <textarea
                  rows={4}
                  value={formData.about || "Kavuturu Dental Clinic is Eluru's premier laser dentistry and oral healthcare center, dedicated to providing pain-free treatments with cutting-edge dental technology."}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 font-medium text-slate-800 outline-none focus:border-slate-400 focus:bg-white leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT INFORMATION */}
      {activeTab === "contact" && (
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Phone className="w-4.5 h-4.5 text-[#0E2A6D]" />
              Contact Information
            </h3>
            <span className="text-xs text-slate-400 font-medium">Used in Website Contact Us Section</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Phone Number *
              </label>
              <input
                type="text"
                value={formData.contact.primaryPhone || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, primaryPhone: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono font-semibold text-slate-900 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Secondary Phone Number (Optional)
              </label>
              <input
                type="text"
                value={formData.contact.secondaryPhone || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, secondaryPhone: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono font-semibold text-slate-900 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Clinic Email Address *
              </label>
              <input
                type="email"
                value={formData.contact.email || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-semibold text-slate-900 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp Number *
              </label>
              <input
                type="text"
                value={formData.contact.whatsapp || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, whatsapp: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono font-semibold text-slate-900 outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLINIC LOCATION */}
      {activeTab === "location" && (
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-4.5 h-4.5 text-[#0E2A6D]" />
              Clinic Location & Map
            </h3>
            <span className="text-xs text-slate-400 font-medium">Physical Address</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Clinic Street Address *
              </label>
              <input
                type="text"
                value={formData.location.address || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-semibold text-slate-900 outline-none focus:border-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.location.city || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })}
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-semibold text-slate-900 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.location.state || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value }
                  })}
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-semibold text-slate-900 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  value={formData.location.pincode || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, pincode: e.target.value }
                  })}
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono font-semibold text-slate-900 outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Google Maps Embed / Share Link *
              </label>
              <input
                type="text"
                value={formData.location.googleMapsLink || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, googleMapsLink: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono text-slate-800 outline-none focus:border-slate-400"
              />
            </div>

            {/* Google Maps Preview */}
            <div className="space-y-1 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Google Maps Preview</span>
              <div className="h-40 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-semibold gap-2">
                <Map className="w-5 h-5 text-[#0E2A6D]" />
                <span>Map Location Preview ({formData.location.city || "Eluru"}, {formData.location.state || "AP"})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WORKING HOURS */}
      {activeTab === "hours" && (
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-[#0E2A6D]" />
              Clinic Working Hours
            </h3>
            <span className="text-xs text-slate-400 font-medium">Weekly Schedule Table</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Opening Time</th>
                  <th className="py-3 px-4">Closing Time</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.workingHours.map((wh, idx) => (
                  <tr key={wh.day} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {wh.day}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <input
                        type="text"
                        disabled={!wh.isOpen}
                        value={wh.openTime}
                        onChange={(e) => {
                          const updated = [...formData.workingHours];
                          updated[idx].openTime = e.target.value;
                          setFormData({ ...formData, workingHours: updated });
                        }}
                        className="h-8 px-3 rounded-xl border border-slate-200 font-mono text-slate-900 disabled:opacity-40 outline-none"
                      />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <input
                        type="text"
                        disabled={!wh.isOpen}
                        value={wh.closeTime}
                        onChange={(e) => {
                          const updated = [...formData.workingHours];
                          updated[idx].closeTime = e.target.value;
                          setFormData({ ...formData, workingHours: updated });
                        }}
                        className="h-8 px-3 rounded-xl border border-slate-200 font-mono text-slate-900 disabled:opacity-40 outline-none"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.workingHours];
                          updated[idx].isOpen = !updated[idx].isOpen;
                          setFormData({ ...formData, workingHours: updated });
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          wh.isOpen
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-600 border border-rose-200"
                        }`}
                      >
                        {wh.isOpen ? "Open" : "Closed"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SOCIAL LINKS */}
      {activeTab === "social" && (
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Share2 className="w-4.5 h-4.5 text-[#0E2A6D]" />
              Social Media & Business Profiles
            </h3>
            <span className="text-xs text-slate-400 font-medium">Public Profile Links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Website URL
              </label>
              <input
                type="text"
                value={formData.social.website || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, website: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono text-slate-900 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Google Business Profile
              </label>
              <input
                type="text"
                value={formData.social.googleBusiness || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, googleBusiness: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono text-slate-900 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Facebook Page
              </label>
              <input
                type="text"
                value={formData.social.facebook || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, facebook: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono text-slate-900 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Instagram Handle / Link
              </label>
              <input
                type="text"
                value={formData.social.instagram || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, instagram: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono text-slate-900 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                YouTube Channel
              </label>
              <input
                type="text"
                value={formData.social.youtube || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, youtube: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono text-slate-900 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                LinkedIn Page
              </label>
              <input
                type="text"
                value={formData.social.linkedin || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, linkedin: e.target.value }
                })}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono text-slate-900 outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>
      )}


      {/* ====================================================
          3. STICKY BOTTOM ACTION BAR (ACTIVATES ONLY ON CHANGE)
      ==================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200/80 py-3.5 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            {isDirty ? (
              <strong className="text-amber-600 font-bold">• Unsaved changes detected</strong>
            ) : (
              <span className="text-slate-400 font-normal">All settings match current live state</span>
            )}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isDirty
                  ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                  : "border-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              Reset Changes
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all text-white cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                isDirty
                  ? "bg-[#2563EB] hover:bg-[#1D4ED8]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
