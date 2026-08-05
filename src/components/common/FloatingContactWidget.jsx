// src/components/common/FloatingContactWidget.jsx

import React, { useState, useEffect, useRef } from "react";
import { Phone, MessageCircle, X, MessageSquare } from "lucide-react";
import { contactData } from "../../data/website/contactData";
import { getClinicStatus } from "../../utils/businessHours";
import { getContact } from "../../services/website/contactService";

const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusInfo, setStatusInfo] = useState(getClinicStatus());
  const [contactInfo, setContactInfo] = useState({
    callUrl: contactData.callUrl,
    whatsappUrl: contactData.whatsappUrl,
  });
  const widgetRef = useRef(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await getContact();
        if (res.success && res.data) {
          const callUrl = res.data.primaryPhone ? `tel:${res.data.primaryPhone.replace(/\s+/g, "")}` : contactData.callUrl;
          const whatsappUrl = res.data.socialLinks?.whatsapp || contactData.whatsappUrl;
          setContactInfo({ callUrl, whatsappUrl });
        }
      } catch (err) {
        console.error("Failed to load contact for FloatingContactWidget:", err);
      }
    };
    fetchContactInfo();
  }, []);

  // Update availability status every 60 seconds automatically
  useEffect(() => {
    const updateStatus = () => {
      setStatusInfo(getClinicStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  // Close widget when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none"
    >
      {/* Expanded Quick Options List */}
      <div
        className={`
          flex flex-col gap-2.5 mb-3 items-end transition-all duration-300 transform origin-bottom-right
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-3 pointer-events-none"
          }
        `}
      >
        {/* Availability Status Indicator Badge */}
        <div
          className="
            flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white/95 px-3.5 py-2
            shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300
          "
        >
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            {statusInfo.isOpen ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            )}
          </span>

          <div className="flex flex-col items-start">
            <span
              className={`text-xs font-bold transition-colors ${
                statusInfo.isOpen ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {statusInfo.statusText}
            </span>
            <span className="text-[10px] font-medium text-slate-500 leading-none mt-0.5">
              {statusInfo.hoursText}
            </span>
          </div>
        </div>

        {/* WhatsApp Button */}
        <a
          href={contactInfo.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsOpen(false)}
          className="
            group flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-2.5
            shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-200
            hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-xl cursor-pointer
          "
        >
          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
            WhatsApp Chat
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-md shadow-emerald-500/25 transition-transform group-hover:scale-105">
            <MessageSquare size={18} />
          </div>
        </a>

        {/* Call Now Button */}
        <a
          href={contactInfo.callUrl}
          onClick={() => setIsOpen(false)}
          className="
            group flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-2.5
            shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-200
            hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/50 hover:shadow-xl cursor-pointer
          "
        >
          <span className="text-xs font-bold text-slate-800 group-hover:text-[#0E2A6D] transition-colors">
            Call Now
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0E2A6D] text-white shadow-md shadow-blue-900/25 transition-transform group-hover:scale-105">
            <Phone size={17} />
          </div>
        </a>
      </div>

      {/* Main Floating Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Contact Options" : "Open Quick Contact Options"}
        aria-expanded={isOpen}
        className={`
          flex h-14 w-14 items-center justify-center rounded-full text-white
          shadow-[0_8px_30px_rgb(14,42,109,0.35)] transition-all duration-300 transform
          hover:scale-105 active:scale-95 cursor-pointer
          ${isOpen ? "bg-slate-800 hover:bg-slate-900 rotate-90" : "bg-[#0E2A6D] hover:bg-[#16398b]"}
        `}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
};

export default FloatingContactWidget;
