import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Kavuturu Dental Clinic";
const SITE_URL = "https://www.kavuturudentalclinic.com";
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

const SEO = ({
  title = "Kavuturu Dental Clinic | Best Dental Clinic & Dentist in Tirupati",

  description =
    "Kavuturu Dental Clinic is a trusted dental clinic in Tirupati offering dental implants, root canal treatment, smile makeovers, cosmetic dentistry, teeth whitening, braces, and complete family dental care with advanced technology.",

  canonical = `${SITE_URL}/`,

  ogType = "website",

  ogImage = DEFAULT_IMAGE,

  noindex = false,
}) => {
  return (
    <Helmet>
      {/* =========================
          BASIC SEO
      ========================== */}

      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <link
        rel="canonical"
        href={canonical}
      />

      {noindex && (
        <meta
          name="robots"
          content="noindex, nofollow"
        />
      )}

      {/* =========================
          OPEN GRAPH
      ========================== */}

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:type"
        content={ogType}
      />

      <meta
        property="og:url"
        content={canonical}
      />

      <meta
        property="og:image"
        content={ogImage}
      />

      <meta
        property="og:image:alt"
        content={SITE_NAME}
      />

      {/* =========================
          TWITTER / X
      ========================== */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={ogImage}
      />

      <meta
        name="twitter:image:alt"
        content={SITE_NAME}
      />
    </Helmet>
  );
};

export default SEO;