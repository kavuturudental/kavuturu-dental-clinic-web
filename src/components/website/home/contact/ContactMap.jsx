// src/components/home/contact/ContactMap.jsx

import React, { useState, useEffect } from "react";
import { contactData as defaultData } from "../../../../data/website/contactData";
import { getContact } from "../../../../services/website/contactService";

export const ContactMap = () => {
  const [mapsLink, setMapsLink] = useState(defaultData.googleMapEmbedUrl);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const res = await getContact();
        if (res.success && res.data) {
          let rawLink = (res.data.mapsLink || "").trim();
          
          if (rawLink) {
            // Extract src if full <iframe src="..."> snippet was pasted
            const srcMatch = rawLink.match(/src=["']([^"']+)["']/i);
            if (srcMatch && srcMatch[1]) {
              rawLink = srcMatch[1];
            }

            if (rawLink.includes("google.com/maps/embed") || rawLink.includes("maps?q=")) {
              setMapsLink(rawLink);
            } else {
              // Convert standard location link or address to working iframe embed URL
              const embedQuery = res.data.address || rawLink;
              setMapsLink(`https://maps.google.com/maps?q=${encodeURIComponent(embedQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load map link:", err);
      }
    };
    fetchMap();
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50 shadow-[0_12px_40px_rgba(14,42,109,0.08)] relative h-[340px] lg:h-full min-h-[340px] lg:min-h-full">
      <iframe
        src={mapsLink}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Clinic Location Map"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default ContactMap;
