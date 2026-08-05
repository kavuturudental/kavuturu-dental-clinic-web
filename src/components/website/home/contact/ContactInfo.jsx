// src/components/home/contact/ContactInfo.jsx

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import ContactCard from "./ContactCard";
import { contactData as defaultData } from "../../../../data/website/contactData";
import { getContact } from "../../../../services/website/contactService";

export const ContactInfo = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
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
    fetchContact();
  }, []);

  const address = data?.address || defaultData.info.address.value;
  const primaryPhone = data?.primaryPhone || defaultData.phone;
  const secondaryPhone = data?.secondaryPhone;
  const email = data?.email || defaultData.email;
  const mapsLink = data?.mapsLink || defaultData.directionsUrl;
  const monFriHours = data?.timings?.monFri || defaultData.info.timings.hours;
  const satHours = data?.timings?.saturday || defaultData.info.timings.hours;
  const sundayHours = data?.timings?.sunday || defaultData.info.timings.sundayHours;

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
            <span className="font-bold text-slate-800">{monFriHours}</span>
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
    </div>
  );
};

export default ContactInfo;
