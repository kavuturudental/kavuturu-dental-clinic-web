import React from "react";

const StructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",

    "@id": "https://www.kavuturudentalclinic.com/#dentist",

    name: "Kavuturu Dental Clinic",

    url: "https://www.kavuturudentalclinic.com",

    image: "https://www.kavuturudentalclinic.com/logo.png",

    logo: "https://www.kavuturudentalclinic.com/logo.png",

    description:
      "Advanced laser dentistry, dental implants, smile makeovers, cosmetic dentistry and family dental care in Tirupati.",

    email: "kavuturudentalclinic@gmail.com",

    telephone: [
      "+91 8309479901",
      "+91 8790302211",
    ],

    priceRange: "₹₹",

    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Lakshmi Towers, 22-7-54/1A, Karakambadi Rd, Near Leela Mahal Circle, Subbareddy Nagar, Akkarampalle",
      addressLocality: "Tirupati",
      addressRegion: "Andhra Pradesh",
      postalCode: "517501",
      addressCountry: "IN",
    },

    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:30",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "13:30",
      },
    ],

    areaServed: {
      "@type": "City",
      name: "Tirupati",
    },

    availableLanguage: [
      "English",
      "Telugu",
      "Hindi",
    ],

    hasMap:
      "https://maps.google.com/?q=Lakshmi+Towers+22-7-54/1A+Karakambadi+Road+Tirupati",

    sameAs: [
      "https://www.instagram.com/",
      "https://www.facebook.com/"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
};

export default StructuredData;