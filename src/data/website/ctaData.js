// src/data/ctaData.js

import { contactData } from "./contactData";

export const ctaData = {
  badge: "Book Your Visit",
  heading: "Ready to Experience Painless Dental Care?",
  description:
    "Whether you need a routine cleaning, advanced root canal, or complete smile makeover, our dental specialists are here to offer exceptional, state-of-the-art care.",
  primaryButton: {
    label: "Book Appointment",
  },
  secondaryButton: {
    label: "Call Now",
    link: contactData.callUrl,
  },
};

export default ctaData;
