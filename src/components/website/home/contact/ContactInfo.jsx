// src/components/home/contact/ContactInfo.jsx

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Mail, Share2, MessageCircle } from "lucide-react";
import ContactCard from "./ContactCard";
import { contactData as defaultData } from "../../../../data/website/contactData";
import { getContact } from "../../../../services/website/contactService";

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

const YoutubeIcon = ({ size = 16, className = "" }) => (
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
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

export const ContactInfo = () => {
  const [data, setData] = useState(null);

  const fetchContact = async () => {
    try {
      const res = await getContact();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load contact info:", err);
    }
  };

  useEffect(() => {
    fetchContact();

    const handleUpdate = (e) => {
      if (e.detail) {
        setData(e.detail);
      } else {
        fetchContact();
      }
    };

    window.addEventListener("STATE_UPDATED", handleUpdate);
    window.addEventListener("CONTACT_UPDATED", handleUpdate);

    return () => {
      window.removeEventListener("STATE_UPDATED", handleUpdate);
      window.removeEventListener("CONTACT_UPDATED", handleUpdate);
    };
  }, []);

  const address = data?.address || defaultData.info.address.value;
  const primaryPhone = data?.primaryPhone || defaultData.phone;
  const secondaryPhone = data?.secondaryPhone;
  const email = data?.email || defaultData.email;
  const mapsLink = data?.mapsLink || defaultData.directionsUrl;

  const monSatHours = data?.timings?.monSat || data?.timings?.monFri || "9:30 AM – 9:00 PM";
  const sundayHours = data?.timings?.sunday || "10:00 AM – 1:30 PM";

  const facebookUrl = data?.socialLinks?.facebook;
  const instagramUrl = data?.socialLinks?.instagram;
  const whatsappUrl = data?.socialLinks?.whatsapp;
  const callPhoneNum = data?.socialLinks?.callPhone;
  const youtubeUrl = data?.socialLinks?.youtube;

  const hasSocialLinks = facebookUrl || instagramUrl || whatsappUrl || callPhoneNum || youtubeUrl;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Address Card */}
      <ContactCard
        icon={MapPin}
        title="Visit Us"
        description="Kavuturu Dental Clinic"
        colorClass="bg-sky-50 text-sky-600 border-sky-100"
      >
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sky-600 transition-colors leading-relaxed block text-[13px] font-bold text-slate-800"
        >
          {address}
        </a>
      </ContactCard>

      {/* Phone Numbers Card */}
      <ContactCard
        icon={Phone}
        title="Call Us"
        description="Available during clinic hours"
        colorClass="bg-emerald-50 text-emerald-600 border-emerald-100"
      >
        <div className="flex flex-col gap-1 w-full">
          <a
            href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
            className="hover:text-emerald-600 transition-colors text-[15px] font-extrabold text-slate-800"
          >
            {primaryPhone}
          </a>

          {secondaryPhone && (
            <a
              href={`tel:${secondaryPhone.replace(/\s+/g, "")}`}
              className="hover:text-emerald-600 transition-colors text-[15px] font-extrabold text-slate-800"
            >
              {secondaryPhone}
            </a>
          )}
        </div>
      </ContactCard>

      {/* Timings Card */}
      <ContactCard
        icon={Clock}
        title="Clinic Hours"
        colorClass="bg-violet-50 text-violet-600 border-violet-100"
      >
        <div className="flex flex-col gap-1.5 w-full text-[13px]">
          <div className="flex justify-between text-slate-700">
            <span>Mon – Sat</span>
            <span className="font-bold text-slate-800">{monSatHours}</span>
          </div>
          <div className="border-t border-slate-100" />
          <div className="flex justify-between text-slate-700">
            <span>Sunday</span>
            <span className="font-bold text-slate-800">{sundayHours}</span>
          </div>
        </div>
      </ContactCard>

      {/* Email Card */}
      <ContactCard
        icon={Mail}
        title="Email Us"
        description="For appointments & queries"
        colorClass="bg-rose-50 text-rose-600 border-rose-100"
      >
        <a
          href={`mailto:${email}`}
          className="hover:text-rose-600 transition-colors text-[14px] font-bold text-slate-800 break-all"
        >
          {email}
        </a>
      </ContactCard>

      {/* Social & Contact Links Card */}
      {hasSocialLinks && (
        <div className="sm:col-span-2">
          <ContactCard
            icon={Share2}
            title="Connect With Us"
            description="Social media & direct contact channels"
            colorClass="bg-amber-50 text-amber-600 border-amber-100"
          >
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <FacebookIcon className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </a>
              )}

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 text-xs font-bold hover:bg-pink-100 transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-600" />
                  <span>Instagram</span>
                </a>
              )}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              )}

              {callPhoneNum && (
                <a
                  href={callPhoneNum.startsWith("tel:") ? callPhoneNum : `tel:${callPhoneNum.replace(/\s+/g, "")}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold hover:bg-sky-100 transition-colors"
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Call: {callPhoneNum}</span>
                </a>
              )}

              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  <YoutubeIcon className="w-4 h-4 text-red-600" />
                  <span>YouTube</span>
                </a>
              )}
            </div>
          </ContactCard>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
