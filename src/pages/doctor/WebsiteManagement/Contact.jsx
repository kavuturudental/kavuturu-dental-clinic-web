// src/pages/doctor/WebsiteManagement/Contact.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Share2, 
  Check, 
  Loader2, 
  MessageCircle,
  Globe,
  AlertCircle
} from "lucide-react";
import contactService from "../../../services/website/contactService";

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

/**
 * Extract clean URL if full <iframe src="..."> HTML code was pasted
 */
const extractMapsUrl = (rawStr) => {
  if (!rawStr || typeof rawStr !== "string") return "";
  const trimmed = rawStr.trim();
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1];
  }
  return trimmed;
};

/**
 * Email format regex validation helper
 */
const isValidEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * URL format validation helper
 */
const isValidUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== "string" || !urlStr.trim()) return true;
  const cleanUrl = extractMapsUrl(urlStr);
  try {
    new URL(cleanUrl);
    return true;
  } catch (err) {
    return false;
  }
};

export default function ContactCMS() {
  const { triggerToast, handlePreviewWebsite } = useOutletContext() || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [formData, setFormData] = useState({
    address: "",
    primaryPhone: "",
    secondaryPhone: "",
    email: "",
    mapsLink: "",
    timings: {
      monFri: "9:00 AM – 8:00 PM",
      saturday: "9:00 AM – 6:00 PM",
      sunday: "Closed",
    },
    socialLinks: {
      instagram: "",
      facebook: "",
      whatsapp: "",
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await contactService.getContact();
      if (res.data) {
        setFormData({
          address: res.data.address || "",
          primaryPhone: res.data.primaryPhone || "",
          secondaryPhone: res.data.secondaryPhone || "",
          email: res.data.email || "",
          mapsLink: res.data.mapsLink || "",
          timings: {
            monFri: res.data.timings?.monFri || "9:00 AM – 8:00 PM",
            saturday: res.data.timings?.saturday || "9:00 AM – 6:00 PM",
            sunday: res.data.timings?.sunday || "Closed",
          },
          socialLinks: {
            instagram: res.data.socialLinks?.instagram || "",
            facebook: res.data.socialLinks?.facebook || "",
            whatsapp: res.data.socialLinks?.whatsapp || "",
          },
        });
      }
    } catch (err) {
      console.error("Failed to load contact information:", err);
      setLoadError("Failed to load Contact Information from backend. Please try again.");
      if (triggerToast) triggerToast("Failed to load contact information.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();

    const errs = {};

    const cleanMapsLink = extractMapsUrl(formData.mapsLink);

    if (!formData.address.trim()) errs.address = "Clinic Address is required.";
    if (!formData.primaryPhone.trim()) errs.primaryPhone = "Primary Phone Number is required.";
    if (!formData.email.trim()) {
      errs.email = "Email Address is required.";
    } else if (!isValidEmail(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!cleanMapsLink) {
      errs.mapsLink = "Google Maps Link is required.";
    } else if (!isValidUrl(cleanMapsLink)) {
      errs.mapsLink = "Please enter a valid URL for Google Maps.";
    }

    if (formData.socialLinks.instagram && !isValidUrl(formData.socialLinks.instagram)) {
      errs.instagram = "Please enter a valid URL for Instagram.";
    }
    if (formData.socialLinks.facebook && !isValidUrl(formData.socialLinks.facebook)) {
      errs.facebook = "Please enter a valid URL for Facebook.";
    }
    if (formData.socialLinks.whatsapp && !isValidUrl(formData.socialLinks.whatsapp)) {
      errs.whatsapp = "Please enter a valid URL for WhatsApp.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstError = Object.values(errs)[0];
      if (triggerToast) triggerToast(firstError, "error");
      return;
    }

    setErrors({});
    setSaving(true);

    const payload = {
      ...formData,
      mapsLink: cleanMapsLink,
    };

    try {
      const res = await contactService.updateContact(payload);
      if (res.success) {
        setFormData(prev => ({ ...prev, mapsLink: cleanMapsLink }));
        if (triggerToast) triggerToast("Contact Information updated successfully!", "success");
      }
    } catch (err) {
      console.error("Failed to save contact information:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to update contact information.";
      if (triggerToast) triggerToast(errMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto py-16 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0E2A6D]" />
        <span className="text-xs font-semibold">Loading Contact Information from backend...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full max-w-[1280px] mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-sm font-bold text-red-900">{loadError}</h3>
          <button
            type="button"
            onClick={loadContactData}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 select-none font-sans w-full max-w-[1280px] mx-auto pb-8">
      <form onSubmit={handleSaveAll} className="space-y-5 text-xs">
        
        {/* SECTION A: CLINIC ADDRESS & PHONES & EMAIL */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#2563EB]" />
              Clinic Contact Details
            </h2>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="px-5 h-9 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
              <span>{saving ? "Saving..." : "Save All Changes"}</span>
            </button>
          </div>

          {/* Clinic Address */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Clinic Address *
            </label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
              placeholder="e.g. Kavuturu Dental Clinic, Near XXX Road, Tirupati, Andhra Pradesh - 517501"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 font-medium text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white leading-relaxed"
            />
            {errors.address && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.address}</p>}
          </div>

          {/* Phones & Email Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Primary Phone */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Phone Number *
              </label>
              <input
                type="text"
                value={formData.primaryPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryPhone: e.target.value }))}
                required
                placeholder="e.g. +91 9876543210"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
              {errors.primaryPhone && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.primaryPhone}</p>}
            </div>

            {/* Secondary Phone (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Secondary Phone Number (Optional)
                </label>
              </div>
              <input
                type="text"
                value={formData.secondaryPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, secondaryPhone: e.target.value }))}
                placeholder="e.g. +91 9123456789"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Leave empty to hide on public website</span>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="e.g. contact@kavuturudental.com"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
              {errors.email && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.email}</p>}
            </div>

          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Google Maps Link / Embed Code *
            </label>
            <input
              type="text"
              value={formData.mapsLink}
              onChange={(e) => setFormData(prev => ({ ...prev, mapsLink: e.target.value }))}
              required
              placeholder='Paste URL or full iframe snippet (e.g. <iframe src="https://www.google.com/maps/embed...">'
              className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Paste your Google Maps location URL or full HTML &lt;iframe src="..."&gt; code</span>
            {errors.mapsLink && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.mapsLink}</p>}
          </div>

        </div>

        {/* SECTION B: CLINIC TIMINGS */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0E2A6D]" />
              Clinic Working Hours
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Monday – Friday */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Monday – Friday *
              </label>
              <input
                type="text"
                value={formData.timings.monFri}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timings: { ...prev.timings, monFri: e.target.value }
                }))}
                required
                placeholder="e.g. 9:00 AM – 8:00 PM"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
            </div>

            {/* Saturday */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Saturday *
              </label>
              <input
                type="text"
                value={formData.timings.saturday}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timings: { ...prev.timings, saturday: e.target.value }
                }))}
                required
                placeholder="e.g. 9:00 AM – 6:00 PM"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
            </div>

            {/* Sunday */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sunday *
              </label>
              <input
                type="text"
                value={formData.timings.sunday}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timings: { ...prev.timings, sunday: e.target.value }
                }))}
                required
                placeholder="e.g. Closed"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION C: SOCIAL MEDIA LINKS */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#0E2A6D]" />
              Social Media Links (Optional)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Instagram */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                Instagram Link
              </label>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                }))}
                placeholder="e.g. https://instagram.com/kavuturudental"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
              {errors.instagram && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.instagram}</p>}
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />
                Facebook Link
              </label>
              <input
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                }))}
                placeholder="e.g. https://facebook.com/kavuturudental"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
              {errors.facebook && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.facebook}</p>}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Link
              </label>
              <input
                type="url"
                value={formData.socialLinks.whatsapp}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, whatsapp: e.target.value }
                }))}
                placeholder="e.g. https://wa.me/919876543210"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-bold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
              {errors.whatsapp && <p className="text-[10px] text-red-600 font-bold mt-1">{errors.whatsapp}</p>}
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
