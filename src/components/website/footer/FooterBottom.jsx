// src/components/footer/FooterBottom.jsx

import React from "react";
import { Link } from "react-router-dom";
import { bottomLinks } from "./footerData";

/**
 * Normalizes any route URL to ensure it never points to source component files like .jsx
 */
export const normalizeRouteUrl = (url, label = "") => {
  if (!url) {
    if (label.toLowerCase().includes("privacy")) return "/privacy-policy";
    if (label.toLowerCase().includes("terms")) return "/terms-and-conditions";
    return "/";
  }

  const cleanUrl = url.trim();

  if (cleanUrl.includes("PrivacyPolicy") || cleanUrl.toLowerCase().includes("privacy")) {
    return "/privacy-policy";
  }

  if (cleanUrl.includes("TermsAndConditions") || cleanUrl.toLowerCase().includes("terms")) {
    return "/terms-and-conditions";
  }

  if (cleanUrl.endsWith(".jsx")) {
    const basename = cleanUrl.split("/").pop().replace(".jsx", "");
    if (basename === "PrivacyPolicy") return "/privacy-policy";
    if (basename === "TermsAndConditions") return "/terms-and-conditions";
    return `/${basename.toLowerCase()}`;
  }

  return cleanUrl;
};

const FooterBottom = ({ customLinks }) => {
  const linksToRender = Array.isArray(customLinks) && customLinks.length > 0 ? customLinks : bottomLinks;

  return (
    <div className="border-t border-white/10 pt-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Copyright */}
        <p className="text-[13px] text-slate-500 font-sans">
          © {new Date().getFullYear()} Kavuturu Dental Clinic. All Rights Reserved.
        </p>

        {/* Policy Links */}
        <div className="flex items-center gap-6 font-sans">
          {linksToRender.map((link) => {
            const targetUrl = normalizeRouteUrl(link.href, link.label);
            return (
              <Link
                key={link.label}
                to={targetUrl}
                className="text-[13px] text-slate-500 transition-colors duration-300 hover:text-secondary cursor-pointer"
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
