// src/data/ctaData.js

import { contactData } from "./contactData";

export const ctaData = {
  badge: "Contact Us Today",
  heading: "Ready to Experience Painless Dental Care?",
  description:
    "Whether you need a routine cleaning, advanced root canal, or complete smile makeover, our dental specialists are here to offer exceptional, state-of-the-art care.",
  primaryButton: {
    label: "Call Now",
    link: "tel:+918309479901",
  },
  secondaryButton: {
    label: "Call Support",
    link: contactData.callUrl,
  },
};

export default ctaData;
