// src/services/websiteService.js

const STORAGE_KEYS = {
  HOMEPAGE: "kdc_cms_homepage",
  ABOUT: "kdc_cms_about",
  TREATMENTS: "kdc_cms_treatments",
  DOCTORS: "kdc_cms_doctors",
  BEFORE_AFTER: "kdc_cms_before_after",
  GALLERY: "kdc_cms_gallery",
  TESTIMONIALS: "kdc_cms_testimonials",
  BLOGS: "kdc_cms_blogs",
  FAQ: "kdc_cms_faq",
  CONTACT: "kdc_cms_contact",
  SETTINGS: "kdc_cms_settings",
  ACTIVITIES: "kdc_cms_activities",
  FEATURED_DOCTOR: "kdc_cms_featured_doctor",
  OTHER_DOCTORS: "kdc_cms_other_doctors"
};

// Default Initial Mock Data for All 11 Sections + Dynamic Stat Cards
const initialFeaturedDoctor = {
  name: "Dr. K. Ravindra Babu",
  qualification: "BDS, MDS – Conservative Dentistry & Endodontics",
  designation: "Chief Endodontist & Laser Root Canal Specialist",
  summary: "With over a decade of clinical experience, Dr. Ravindra Babu specializes in laser-assisted root canal treatments and advanced restorative dentistry. He is committed to delivering precise, comfortable, and patient-focused dental care using modern technology and evidence-based techniques.",
  photo: "/assets/images/doctors/dr-ravindra-babu.webp",
  highlights: [
    { id: "hl-1", value: "14+", label: "Years Clinical Experience", order: 1 },
    { id: "hl-2", value: "20,000+", label: "Root Canal Treatments", order: 2 },
    { id: "hl-3", value: "State 10th Rank", label: "MDS Entrance", order: 3 },
    { id: "hl-4", value: "Root Canal Treatment", label: "Specialist", order: 4 }
  ]
};

const initialOtherDoctors = [
  {
    id: "doc-other-1",
    name: "Dr. K. Dharani Chowdary",
    qualification: "M.D.S.",
    designation: "Oral & Maxillofacial Surgeon",
    expertise: "Impacted Wisdom Teeth Extraction, Facial Trauma & Jaw Surgery",
    summary: "Specialist surgeon managing complex surgical extractions, dental implants, and corrective jaw procedures with minimal discomfort.",
    experience: "15+ Years Experience",
    order: 1
  }
];

const initialAboutData = {
  homepagePreview: {
    heading: "Eluru's Most Trusted Dental Care Center",
    shortDescription: "Kavuturu Dental Clinic is equipped with state-of-the-art Waterlase laser technology, delivering pain-free endodontic care and advanced smile transformations for over 18 years.",
    ctaText: "Read Our Story",
    ctaLink: "/about"
  },
  hero: {
    title: "About Kavuturu Dental Clinic",
    subtitle: "10+ Years of Compassionate Dental Care by Eluru's Trusted Smile Experts"
  },
  introduction: {
    title: "Welcome to Kavuturu Dental Clinic",
    description: "Founded by Dr. Ravindra Babu, Kavuturu Dental Clinic combines advanced dental technology with compassionate, patient-focused care. Since opening, we have been committed to providing comfortable, reliable, and high-quality dental treatments for every smile.\n\nFrom routine dental check-ups and root canal treatments to dental implants, cosmetic dentistry, and family dental care, we offer comprehensive dental solutions tailored to every patient's needs."
  },
  story: {
    title: "Our Story",
    heading: "Building Healthy Smiles Through Trust, Innovation, and Compassion",
    description: "Kavuturu Dental Clinic was established with a simple vision—to make modern dental care accessible, comfortable, and trustworthy for every family in Eluru.\n\nUnder the leadership of Dr. Ravindra Babu, our clinic combines advanced dental technology with genuine compassion. Every treatment is carefully planned around each patient's unique needs, ensuring a comfortable experience and long-term oral health.\n\nToday, we proudly serve thousands of patients with ethical dentistry, modern treatment techniques, and a commitment to creating healthy, confident smiles that last a lifetime."
  },
  missionVision: {
    heading: "Guided by Purpose, Driven by Patient Care",
    description: "Everything we do is guided by our commitment to clinical excellence, compassionate care, and building long-lasting relationships with every patient who trusts us with their smile.",
    mission: {
      title: "Our Mission",
      description: "To deliver accessible, pain-free, and high-precision dental care using FDA-approved laser technology with absolute commitment to patient safety."
    },
    vision: {
      title: "Our Vision",
      description: "To be the premier center of excellence for laser endodontics, dental implantology, and cosmetic dentistry across Andhra Pradesh."
    }
  },
  values: {
    heading: "Our Values",
    description: "The core principles that guide our clinical practice and patient care.",
    cards: [
      { id: "val-1", number: "01", title: "Patient First", description: "Every treatment begins with your comfort, safety, and well-being.", order: 1 },
      { id: "val-2", number: "02", title: "Clinical Precision", description: "Utilizing advanced diagnostic tools and laser technology for maximum accuracy.", order: 2 },
      { id: "val-3", number: "03", title: "Ethical Dentistry", description: "Transparent communication, honest treatment plans, and zero hidden costs.", order: 3 }
    ]
  },
  highlights: [
    { id: "hl-1", value: "14+", label: "Years Experience", description: "Dedicated clinical excellence in Eluru", order: 1 },
    { id: "hl-2", value: "25,000+", label: "Happy Patients", description: "Smiles restored with gentle care", order: 2 },
    { id: "hl-3", value: "99.4%", label: "Success Rate", description: "Precision laser root canal success", order: 3 }
  ],
  whyTrustUs: {
    heading: "Why Patients Trust Us",
    description: "Reasons why families choose Kavuturu Dental Clinic for their oral healthcare.",
    cards: [
      { id: "ft-1", title: "Experienced & Compassionate Dental Team", description: "Our experienced dental specialists provide personalized care with compassion, precision, and clinical excellence.", order: 1 },
      { id: "ft-2", title: "US-FDA Approved Waterlase Technology", description: "Painless laser treatments minimizing vibrations, drills, and post-op discomfort.", order: 2 },
      { id: "ft-3", title: "Strict Sterilization Protocol", description: "4-tier hospital-grade sterilization ensuring complete infection control.", order: 3 }
    ]
  }
};

const initialHomepage = {
  hero: {
    trustBadge: "US-FDA Approved Waterlase Laser Technology",
    title: "Painless Laser Dentistry & Advanced Dental Care",
    subtitle: "Experience world-class dental care in Eluru with Dr. K. Ravindra Babu. Specialized in painless laser root canals, dental implants, and aesthetic smile design.",
    primaryCtaText: "Book Appointment",
    primaryCtaLink: "/appointment",
    secondaryCtaText: "Explore Treatments",
    secondaryCtaLink: "/treatments",
    heroImage: "/assets/images/doctors/dr-ravindra-babu.webp",
    showTrustBadge: true,
    showStats: true
  },
  statCards: [
    {
      id: "stat-1",
      icon: "users",
      number: "25,000+",
      label: "Happy Patients",
      description: "Patients treated with quality dental care.",
      enabled: true,
      order: 1
    },
    {
      id: "stat-2",
      icon: "calendar",
      number: "18+",
      label: "Years of Experience",
      description: "Delivering painless laser dental care.",
      enabled: true,
      order: 2
    },
    {
      id: "stat-3",
      icon: "award",
      number: "99.4%",
      label: "Success Rate",
      description: "Highest precision endodontic success.",
      enabled: true,
      order: 3
    },
    {
      id: "stat-4",
      icon: "star",
      number: "4.9/5",
      label: "Google Rating",
      description: "Based on 500+ verified patient reviews.",
      enabled: true,
      order: 4
    }
  ],
  aboutPreview: {
    heading: "Eluru's Most Trusted Dental Care Center",
    description: "Kavuturu Dental Clinic is equipped with state-of-the-art Waterlase laser technology, digital 3D diagnostics, and strict 7-step sterilization protocols to deliver seamless, pain-free dental treatments.",
    image: "/assets/images/gallery/doctor-consultation.webp",
    buttonText: "Read Our Story",
    buttonLink: "/about"
  },
  appointmentCta: {
    heading: "Ready for a Healthy, Confident Smile?",
    description: "Schedule your consultation with our chief endodontist today and experience pain-free laser treatment.",
    primaryButtonText: "Book Your Visit Now",
    primaryButtonLink: "/appointment",
    secondaryButtonText: "Call Clinic Directly",
    secondaryButtonLink: "tel:+919848012345",
    bgImage: "/assets/images/gallery/treatment-room.webp"
  }
};

const initialTreatments = [
  { id: "trt-1", name: "Laser Root Canal", shortDesc: "Single sitting, pain-free root canal treatment using advanced diode lasers.", image: "/assets/images/treatments/laser-root-canal.webp", displayOnHomepage: true, order: 1 },
  { id: "trt-2", name: "Dental Implants", shortDesc: "Permanent, natural-looking tooth replacement solution with high success rate.", image: "/assets/images/treatments/dental-implants.webp", displayOnHomepage: true, order: 2 },
  { id: "trt-3", name: "Smile Makeover", shortDesc: "Custom composite veneers & full mouth aesthetic smile alignment.", image: "/assets/images/beforeafter/aesthetic_composite_restorations_after.webp", displayOnHomepage: true, order: 3 },
  { id: "trt-4", name: "Teeth Whitening", shortDesc: "Advanced laser-assisted teeth whitening for a bright, radiant smile.", image: "/assets/images/treatments/teeth-whitening.webp", displayOnHomepage: true, order: 4 },
  { id: "trt-5", name: "Braces & Aligners", shortDesc: "Invisible clear aligners and ceramic braces for perfect teeth alignment.", image: "/assets/images/treatments/braces-aligners.webp", displayOnHomepage: true, order: 5 },
  { id: "trt-6", name: "Children's Dentistry", shortDesc: "Gentle pediatric dental care, cavity prevention, and fluoride treatments.", image: "/assets/images/treatments/childrens-dentistry.webp", displayOnHomepage: true, order: 6 }
];

const initialDoctors = [
  { id: "doc-1", photo: "/assets/images/doctors/dr-ravindra-babu.webp", name: "Dr. K. Ravindra Babu", qualification: "M.D.S.", designation: "Chief Laser Endodontist & Implantologist", yearsOfExperience: "18+ Years Experience", displayOnHomepage: true, order: 1 },
  { id: "doc-2", photo: "https://images.unsplash.com/photo-1594824813566-78a933758f46?w=300", name: "Dr. K. Dharani Chowdary", qualification: "M.D.S.", designation: "Oral & Maxillofacial Surgeon", yearsOfExperience: "15+ Years Experience", displayOnHomepage: true, order: 2 }
];

const initialBeforeAfter = [
  { id: "ba-1", treatment: "Aesthetic Composite Restorations", shortDesc: "Chipped front tooth repaired seamlessly using multilayered composite resin.", beforeImg: "/assets/images/beforeafter/aesthetic_composite_restorations_before.webp", afterImg: "/assets/images/beforeafter/aesthetic_composite_restorations_after.webp", displayOnHomepage: true, order: 1 },
  { id: "ba-2", treatment: "Full Mouth Dental Implants", shortDesc: "Complete lower jaw restoration with fixed implant-supported prosthesis.", beforeImg: "/assets/images/beforeafter/full_mouth_implants_before.webp", afterImg: "/assets/images/beforeafter/full_mouth_implants_after.webp", displayOnHomepage: true, order: 2 }
];

const initialTestimonials = [
  { id: "tst-1", patientName: "M. Satyanarayana", rating: 5, review: "I had severe anxiety about root canals until Dr. Ravindra Babu performed laser RCT on my molar. It was completely painless!", displayOnHomepage: true, order: 1 },
  { id: "tst-2", patientName: "Priya Sharma", rating: 5, review: "Got clear aligners done here. Excellent staff behavior, clean clinic, and great smile results within 6 months.", displayOnHomepage: true, order: 2 }
];

const initialGallery = [
  { id: "gal-1", name: "Modern Reception Area", url: "/assets/images/gallery/reception.webp", displayOnHomepage: true, order: 1 },
  { id: "gal-2", name: "Laser Operating Suite", url: "/assets/images/gallery/treatment-room.webp", displayOnHomepage: true, order: 2 }
];

const initialBlogs = [
  { id: "blog-1", title: "Why Laser Root Canal Treatment is 100% Painless and Faster", cardImage: "/assets/images/treatments/laser-root-canal.webp", publishDate: "2026-07-12", readTime: "4 min read", status: "Published", summary: "Discover how dental lasers disinfect root canals gently without vibration or surgical noise.", isPinned: true },
  { id: "blog-2", title: "Dental Implants vs Traditional Bridges: Which is Right for You?", cardImage: "/assets/images/treatments/dental-implants.webp", publishDate: "2026-06-25", readTime: "5 min read", status: "Published", summary: "A comprehensive comparison of permanent titanium implants versus dental bridges.", isPinned: false }
];

const initialContact = {
  address: "D.No 23B-5-12, Opposite District Hospital, Main Road, Eluru, Andhra Pradesh - 534001",
  phone: "+91 98480 12345",
  email: "info@kavuturudentalclinic.com",
  workingHours: "Monday - Saturday: 09:00 AM - 08:30 PM | Sunday: 10:00 AM - 01:00 PM",
  mapsLink: "https://maps.google.com/?q=Kavuturu+Dental+Clinic+Eluru"
};

const initialFooter = {
  logoUrl: "/assets/images/logos/logo.png",
  shortDesc: "Leading laser endodontics & implant dentistry center in Eluru, providing painless oral healthcare for over 18 years.",
  copyrightText: "© 2026 Kavuturu Dental Clinic. All Rights Reserved."
};

const getItem = (key, defaultData) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === "undefined" || raw === "null") {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    const parsed = JSON.parse(raw);
    if (!parsed) return defaultData;

    if (Array.isArray(defaultData) && !Array.isArray(parsed)) {
      return defaultData;
    }
    return parsed;
  } catch (e) {
    return defaultData;
  }
};

const setItem = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
  }
};

export const websiteService = {
  getHomepage: () => getItem(STORAGE_KEYS.HOMEPAGE, initialHomepage),
  saveHomepage: (data) => { setItem(STORAGE_KEYS.HOMEPAGE, data); return { success: true }; },
  getTreatments: () => {
    const raw = getItem(STORAGE_KEYS.TREATMENTS, initialTreatments);
    const list = Array.isArray(raw) ? raw : initialTreatments;
    
    const uniqueItems = [];
    const seenIds = new Set();
    const seenNames = new Set();

    for (const item of list) {
      if (!item) continue;
      const cleanId = item.id || `trt-${Math.random()}`;
      const cleanName = (item.name || "").trim().toLowerCase();
      if (!seenIds.has(cleanId) && (!cleanName || !seenNames.has(cleanName))) {
        seenIds.add(cleanId);
        if (cleanName) seenNames.add(cleanName);
        uniqueItems.push({ ...item, id: cleanId });
      }
    }

    for (const defItem of initialTreatments) {
      if (uniqueItems.length >= 6) break;
      const defName = defItem.name.trim().toLowerCase();
      if (!seenIds.has(defItem.id) && !seenNames.has(defName)) {
        seenIds.add(defItem.id);
        seenNames.add(defName);
        uniqueItems.push(defItem);
      }
    }

    const result = uniqueItems.slice(0, 6).map((t, idx) => ({ ...t, order: idx + 1 }));
    setItem(STORAGE_KEYS.TREATMENTS, result);
    return result;
  },
  saveTreatments: (list) => { setItem(STORAGE_KEYS.TREATMENTS, list); return { success: true }; },
  getDoctors: () => getItem(STORAGE_KEYS.DOCTORS, initialDoctors),
  saveDoctors: (list) => { setItem(STORAGE_KEYS.DOCTORS, list); return { success: true }; },
  getFeaturedDoctor: () => getItem(STORAGE_KEYS.FEATURED_DOCTOR, initialFeaturedDoctor),
  saveFeaturedDoctor: (data) => { setItem(STORAGE_KEYS.FEATURED_DOCTOR, data); return { success: true }; },
  getOtherDoctors: () => getItem(STORAGE_KEYS.OTHER_DOCTORS, initialOtherDoctors),
  saveOtherDoctors: (list) => { setItem(STORAGE_KEYS.OTHER_DOCTORS, list); return { success: true }; },
  getBeforeAfter: () => getItem(STORAGE_KEYS.BEFORE_AFTER, initialBeforeAfter),
  saveBeforeAfter: (list) => { setItem(STORAGE_KEYS.BEFORE_AFTER, list); return { success: true }; },
  getTestimonials: () => getItem(STORAGE_KEYS.TESTIMONIALS, initialTestimonials),
  saveTestimonials: (list) => { setItem(STORAGE_KEYS.TESTIMONIALS, list); return { success: true }; },
  getGallery: () => getItem(STORAGE_KEYS.GALLERY, initialGallery),
  saveGallery: (list) => { setItem(STORAGE_KEYS.GALLERY, list); return { success: true }; },
  getBlogs: () => getItem(STORAGE_KEYS.BLOGS, initialBlogs),
  saveBlogs: (list) => { setItem(STORAGE_KEYS.BLOGS, list); return { success: true }; },
  getContact: () => getItem(STORAGE_KEYS.CONTACT, initialContact),
  saveContact: (data) => { setItem(STORAGE_KEYS.CONTACT, data); return { success: true }; },
  getAbout: () => getItem(STORAGE_KEYS.ABOUT, initialAboutData),
  saveAbout: (data) => { setItem(STORAGE_KEYS.ABOUT, data); return { success: true }; },
  getFooter: () => getItem(STORAGE_KEYS.SETTINGS + "_footer", initialFooter),
  saveFooter: (data) => { setItem(STORAGE_KEYS.SETTINGS + "_footer", data); return { success: true }; }
};

export default websiteService;
