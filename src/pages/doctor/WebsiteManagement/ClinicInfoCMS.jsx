// src/pages/doctor/WebsiteManagement/ClinicInfoCMS.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Phone,
  MapPin,
  Clock,
  Mail,
  Map,
  MessageCircle,
  Globe,
  Check
} from "lucide-react";
import doctorService from "../../../services/doctorService";

// Custom SVG Icons for Social Media
const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export default function ClinicInfoCMS() {
  const { triggerToast, handlePreviewWebsite } = useOutletContext() || {};

  const [address, setAddress] = useState("D.No: 23B-5-1, Opposite SBI Main Branch, Fire Station Road, Eluru, Andhra Pradesh 534001");
  const [phone, setPhone] = useState("+91 98480 12345");
  const [email, setEmail] = useState("contact@kavuturudental.com");
  const [workingHours, setWorkingHours] = useState("Monday – Saturday: 09:00 AM – 08:00 PM | Sunday: 09:00 AM – 01:00 PM");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.9748641151624!2d81.100123!3d16.712345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQyJzg0LjQiTiA4McKwMDYnMDAuNCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin");
  const [facebookUrl, setFacebookUrl] = useState("https://facebook.com/kavuturudental");
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com/kavuturudental");
  const [whatsappUrl, setWhatsappUrl] = useState("https://wa.me/919848012345");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const details = doctorService.getClinicDetails() || {};
    setAddress(details.location?.address || "D.No: 23B-5-1, Opposite SBI Main Branch, Fire Station Road, Eluru, Andhra Pradesh 534001");
    setPhone(details.contact?.primaryPhone || "+91 98480 12345");
    setEmail(details.contact?.email || "contact@kavuturudental.com");
    setWorkingHours(details.hours || "Monday – Saturday: 09:00 AM – 08:00 PM | Sunday: 09:00 AM – 01:00 PM");
    setGoogleMapsUrl(details.location?.googleMapsLink || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.9748641151624!2d81.100123!3d16.712345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQyJzg0LjQiTiA4McKwMDYnMDAuNCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin");
    setFacebookUrl(details.social?.facebook || "https://facebook.com/kavuturudental");
    setInstagramUrl(details.social?.instagram || "https://instagram.com/kavuturudental");
    setWhatsappUrl(details.contact?.whatsapp || "https://wa.me/919848012345");
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!address.trim()) {
      if (triggerToast) triggerToast("Clinic Address is required.", "error");
      return;
    }
    if (!phone.trim()) {
      if (triggerToast) triggerToast("Primary Phone Number is required.", "error");
      return;
    }
    if (!email.trim()) {
      if (triggerToast) triggerToast("Email Address is required.", "error");
      return;
    }
    if (!workingHours.trim()) {
      if (triggerToast) triggerToast("Working Hours is required.", "error");
      return;
    }
    if (!googleMapsUrl.trim()) {
      if (triggerToast) triggerToast("Google Maps Embed URL is required.", "error");
      return;
    }

    const updated = {
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      workingHours: workingHours.trim(),
      googleMapsUrl: googleMapsUrl.trim(),
      facebookUrl: facebookUrl.trim(),
      instagramUrl: instagramUrl.trim(),
      whatsappUrl: whatsappUrl.trim()
    };

    doctorService.saveClinicDetails({
      contact: {
        primaryPhone: updated.phone,
        email: updated.email,
        whatsapp: updated.whatsappUrl
      },
      location: {
        address: updated.address,
        googleMapsLink: updated.googleMapsUrl
      },
      social: {
        facebook: updated.facebookUrl,
        instagram: updated.instagramUrl
      },
      hours: updated.workingHours
    });

    if (triggerToast) triggerToast("Contact Information saved successfully across the website!", "success");
  };

  return (
    <div className="space-y-4 select-none font-sans w-full max-w-[1280px] mx-auto pb-8">
      {/* SINGLE WHITE CONTENT CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-2xs">
        <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#2563EB]" />
            Clinic Contact Details
          </h2>

          <button
            type="button"
            onClick={handleSave}
            className="px-4.5 h-9 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs outline-none active:scale-98"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Save Changes</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Clinic Address (Full Width) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Clinic Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="D.No: 23B-5-1, Opposite SBI Main Branch, Fire Station Road, Eluru, AP 534001"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 font-semibold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
            </div>
          </div>

          {/* Two-Column Responsive Layout for Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 98480 12345"
                  className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 font-mono font-semibold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="contact@kavuturudental.com"
                  className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 font-semibold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Working Hours *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                required
                placeholder="Monday – Saturday: 09:00 AM – 08:00 PM | Sunday: 09:00 AM – 01:00 PM"
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 font-semibold text-slate-900 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
            </div>
          </div>

          {/* Google Maps Embed URL */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Google Maps Embed URL *
            </label>
            <div className="relative">
              <Map className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                required
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="h-9.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 font-mono text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white"
              />
            </div>

            {/* Live Map Preview Verification below input */}
            {googleMapsUrl && (
              <div className="mt-2 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Map Preview Verification</span>
                <div className="w-full h-36 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                  <iframe
                    src={googleMapsUrl}
                    title="Google Map Preview"
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Social Media Links (3-Column Layout) */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Social Media Links (Optional)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Facebook URL</label>
                <div className="relative">
                  <FacebookIcon className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 font-mono text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Instagram URL</label>
                <div className="relative">
                  <InstagramIcon className="w-4 h-4 text-pink-600 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 font-mono text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">WhatsApp URL</label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    placeholder="https://wa.me/..."
                    className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 font-mono text-slate-800 outline-none focus:border-[#0E2A6D] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>

    </div>
  );
}
