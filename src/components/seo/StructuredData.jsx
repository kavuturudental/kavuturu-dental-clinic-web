import React from "react";

const StructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dentist",

        "@id":
          "https://www.kavuturudentalclinic.com/#dentist",

        name: "Kavuturu Dental Clinic",

        url:
          "https://www.kavuturudentalclinic.com/",

        image:
          "https://www.kavuturudentalclinic.com/logo.png",

        logo: {
          "@type": "ImageObject",
          url:
            "https://www.kavuturudentalclinic.com/logo.png",
        },

        description:
          "Kavuturu Dental Clinic is a trusted dental clinic in Tirupati offering dental implants, root canal treatment, smile makeovers, cosmetic dentistry, teeth whitening, braces, and complete family dental care with advanced technology.",

        email:
          "kavuturudentalclinic@gmail.com",

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
            "@type":
              "OpeningHoursSpecification",

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
            "@type":
              "OpeningHoursSpecification",

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
      },

      {
        "@type": "WebSite",

        "@id":
          "https://www.kavuturudentalclinic.com/#website",

        name: "Kavuturu Dental Clinic",

        alternateName: "Kavuturu Dental",

        url:
          "https://www.kavuturudentalclinic.com/",

        description:
          "Kavuturu Dental Clinic is a trusted dental clinic in Tirupati offering dental implants, root canal treatment, smile makeovers, cosmetic dentistry, teeth whitening, braces, and complete family dental care with advanced technology.",

        publisher: {
          "@id":
            "https://www.kavuturudentalclinic.com/#dentist",
        },
      },
    ],
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