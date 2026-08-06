// src/components/footer/Footer.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import clinicLogo from "../../../assets/images/logos/footer-logo.png";
import FooterColumn from "./FooterColumn";
import FooterBottom from "./FooterBottom";
import SocialLinks from "./SocialLinks";
import { quickLinks, treatments, contactDetails as defaultDetails } from "./footerData";
import { getContact } from "../../../services/website/contactService";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await getContact();
        if (res.success && res.data) {
          setContactData(res.data);
        }
      } catch (err) {
        console.error("Failed to load footer contact info:", err);
      }
    };
    fetchContactInfo();
  }, []);

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  };

  const primaryPhone = contactData?.primaryPhone || defaultDetails.phones[0]?.number;
  const secondaryPhone = contactData?.secondaryPhone;
  const email = contactData?.email || defaultDetails.email;
  const address = contactData?.address || defaultDetails.address.join(", ");
  const mapsLink = contactData?.mapsLink || defaultDetails.directionsUrl;
  const monFriHours = contactData?.timings?.monFri || defaultDetails.hours.weekdays;
  const satHours = contactData?.timings?.saturday || defaultDetails.hours.weekdays;
  const sundayHours = contactData?.timings?.sunday || defaultDetails.hours.sunday;
  const socialLinksData = contactData?.socialLinks;

  return (
    <footer className="bg-[#0B1D3F] rounded-t-[44px] shadow-[0_-20px_50px_rgba(11,29,63,0.15)]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-18 pb-8">

        {/* Main 4‑column grid */}
        <div className="grid gap-y-12 gap-x-12 md:gap-x-16 lg:gap-x-20 xl:gap-x-24 sm:grid-cols-2 lg:grid-cols-4">

          {/* ── Column 1 : Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <Link to="/" onClick={handleLogoClick} className="inline-block">
              <img
                src={clinicLogo}
                alt="Kavuturu Dental Clinic Logo"
                className="h-14 w-auto"
              />
            </Link>

            {/* Description */}
            <p className="mt-3 text-[13px] leading-relaxed text-slate-400 max-w-[260px]">
              Delivering premium dental care with advanced laser technology, experienced specialists, and a patient-first approach in Tirupati.
            </p>

            {/* Social Icons */}
            <div className="mt-5">
              <SocialLinks socialLinks={socialLinksData} />
            </div>
          </div>

          {/* ── Column 2 : Quick Links ── */}
          <FooterColumn title="Quick Links" links={quickLinks} />

          {/* ── Column 3 : Treatments ── */}
          <FooterColumn title="Our Treatments" links={treatments} showViewAll />

          {/* ── Column 4 : Contact Information ── */}
          <div>
            <h3 className="text-base font-bold text-white font-outfit">
              Contact Information
            </h3>

            <ul className="mt-7 space-y-6">
              {/* Phone */}
              <li className="flex items-start gap-3">
                <Phone size={15} className="mt-0.5 flex-shrink-0 text-secondary" strokeWidth={2.2} />
                <div className="space-y-1">
                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                    className="block text-[14px] font-semibold text-slate-300 transition-colors duration-300 hover:text-secondary"
                  >
                    {primaryPhone}
                  </a>

                  {secondaryPhone && (
                    <a
                      href={`tel:${secondaryPhone.replace(/\s+/g, "")}`}
                      className="block text-[14px] font-semibold text-slate-300 transition-colors duration-300 hover:text-secondary"
                    >
                      {secondaryPhone}
                    </a>
                  )}
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 flex-shrink-0 text-secondary" strokeWidth={2.2} />
                <div>
                  <a
                    href={`mailto:${email}`}
                    className="text-[14px] text-slate-400 transition-colors duration-300 hover:text-secondary break-all"
                  >
                    {email}
                  </a>
                </div>
              </li>

              {/* Address */}
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-secondary" strokeWidth={2.2} />
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] leading-relaxed text-slate-400 transition-colors duration-300 hover:text-secondary"
                >
                  {address}
                </a>
              </li>

              {/* Clinic Hours */}
              <li className="flex items-start gap-3">
                <Clock size={15} className="mt-0.5 flex-shrink-0 text-secondary" strokeWidth={2.2} />
                <div className="text-[13px] text-slate-400 leading-relaxed space-y-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-500 font-medium">Mon – Sat:</span>
                    <span className="font-semibold text-slate-300">{monFriHours}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-500 font-medium">Sun:</span>
                    <span className="font-semibold text-slate-300">{sundayHours}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-12">
          <FooterBottom />
        </div>

      </div>
    </footer>
  );
};

export default Footer;
