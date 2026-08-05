// src/components/footer/footerData.js

import { contactData } from "../../../data/website/contactData";

export const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Treatments", href: "/treatments" },
  { label: "Doctors", href: "/doctors" },
  { label: "Gallery", href: "/gallery" },
  { label: "Before & After", href: "/before-after" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/#contact" },
];

export const treatments = [
  { label: "Dental Implants", href: "/treatments" },
  { label: "Clear Aligners & Braces", href: "/treatments" },
  { label: "Laser Root Canal Treatment", href: "/treatments" },
  { label: "Laser Gum Treatment", href: "/treatments" },
  { label: "Teeth Whitening", href: "/treatments" },
  { label: "Dental Crowns & Bridges", href: "/treatments" },
];

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/kavuturu_dental_clinic/",
    icon: "Instagram",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/918309479901",
    icon: "WhatsApp",
  },
];

export const contactDetails = {
  phone: contactData.phone,
  callUrl: contactData.callUrl,
  clinicPhone: contactData.clinicPhone,
  clinicCallUrl: contactData.clinicCallUrl,
  doctorPhone: contactData.doctorPhone,
  doctorCallUrl: contactData.doctorCallUrl,
  phones: contactData.phones,
  email: contactData.email,
  mailUrl: contactData.mailUrl,
  address: [
    "Lakshmi Towers,",
    "22-7-54/1A,",
    "Karakambadi Road,",
    "Near Leela Mahal Circle,",
    "Subbareddy Nagar,",
    "Akkarampalle,",
    "Tirupati,",
    "Andhra Pradesh 517501",
  ],
  directionsUrl: contactData.directionsUrl,
  hours: {
    weekdays: "9:30 AM – 9:00 PM",
    sunday: "10:00 AM – 1:30 PM",
  },
};

export const bottomLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];
