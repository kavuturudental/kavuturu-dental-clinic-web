// src/components/seo/SEO.jsx

import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Kavuturu Dental Clinic | Best Dental Clinic & Dentist in Tirupati",
  description = "Kavuturu Dental Clinic is a trusted dental clinic in Tirupati offering dental implants, root canal treatment, smile makeovers, cosmetic dentistry, teeth whitening, braces, and complete family dental care with advanced technology.",
  canonical = "https://www.kavuturudentalclinic.com/",
  ogType = "website",
  ogImage = "https://www.kavuturudentalclinic.com/logo.png",
  twitterCard = "summary_large_image",
}) => {
  const fullTitle = title.includes("Kavuturu Dental")
    ? title
    : `${title} | Kavuturu Dental Clinic Tirupati`;

  return (
    <Helmet>
      {/* Primary Title */}
      <title>{fullTitle}</title>

      {/* Meta Description */}
      <meta name="description" content={description} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook / WhatsApp Tags */}
      <meta property="og:site_name" content="Kavuturu Dental Clinic" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
