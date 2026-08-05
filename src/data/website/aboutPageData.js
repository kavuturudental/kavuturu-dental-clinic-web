import aboutClinicImage from "../../assets/images/about/about-clinic-treatment-room.webp";
import ctaImage from "../../assets/images/about/about-cta-patient.webp";

const aboutPageData = {
  introduction: {
    badge: "About Kavuturu Dental Clinic",

    heading:
      "10+ Years of Compassionate Dental Care by Tirupati's Trusted Smile Experts",

    introduction:
      "Founded by Dr. Ravindrababu, Kavuturu Dental Clinic combines advanced dental technology with compassionate, patient-focused care. Since opening in 2025, we have been committed to providing comfortable, reliable, and high-quality dental treatments for every smile.",

    description:
      "From routine dental check-ups and root canal treatments to dental implants, cosmetic dentistry, and family dental care, we offer comprehensive dental solutions tailored to every patient's needs.",

    image: {
      src: aboutClinicImage,
      alt: "Modern treatment room at Kavuturu Dental Clinic",
    },

    cta: {
      label: "Book Your Appointment",
      href: "/appointment",
    },
  },

  story: {
    title: "Our Story",

    description:
      "Kavuturu Dental Clinic was founded with a simple vision—to make quality dental care accessible, comfortable, and trustworthy. Guided by clinical excellence and genuine compassion, we provide personalized treatments that help individuals and families in Tirupati achieve healthy, confident smiles.",
  },

  missionVision: {
    mission: {
      badge: "Our Mission",

      heading: "Delivering Exceptional Dental Care with Compassion",

      description:
        "To deliver exceptional dental care through advanced technology, clinical excellence, and compassionate treatment that improves oral health and enhances the quality of life for every patient.",
    },

    vision: {
      badge: "Our Vision",

      heading: "Creating Healthier Smiles for Every Family",

      description:
        "To become Tirupati's most trusted dental clinic by providing ethical, innovative, and personalized dental care while helping every patient achieve a healthy and confident smile.",
    },
  },

  values: [
    {
      id: 1,
      title: "Patient First",
      description:
        "Every treatment begins with your comfort, safety, and well-being.",
    },
    {
      id: 2,
      title: "Clinical Excellence",
      description:
        "We combine experience, precision, and modern dentistry to deliver exceptional care.",
    },
    {
      id: 3,
      title: "Integrity",
      description:
        "We believe in honest guidance, transparent treatment plans, and building lasting trust.",
    },
    {
      id: 4,
      title: "Innovation",
      description:
        "We embrace advanced dental technology to provide safer, more comfortable, and effective treatments.",
    },
  ],

  highlights: [
    {
      id: 1,
      icon: "Award",
      value: "14+",
      label: "Years Experience",
      description: "Dedicated clinical excellence in Tirupati",
    },
    {
      id: 2,
      icon: "Activity",
      value: "20,000+",
      label: "RCTs Completed",
      description: "Painless laser endodontic procedures",
    },
    {
      id: 3,
      icon: "Heart",
      value: "25,000+",
      label: "Happy Patients",
      description: "Restoring confident smiles across families",
    },
    {
      id: 4,
      icon: "Sparkles",
      value: "Advanced",
      label: "Laser Dentistry",
      description: "State-of-the-art digital dental care",
    },
  ],

  trust: [
    {
      id: 1,
      title: "Experienced & Compassionate Dental Team",
      description:
        "Our experienced dental specialists provide personalized care with compassion, precision, and clinical excellence.",
    },
    {
      id: 2,
      title: "Advanced Digital Equipment",
      description:
        "Modern digital dentistry allows faster diagnosis, greater accuracy, and more comfortable treatment.",
    },
    {
      id: 3,
      title: "Safe & Sterile Environment",
      description:
        "Strict sterilization protocols and hygiene standards ensure a safe experience for every patient.",
    },
    {
      id: 4,
      title: "Personalized Treatment Plans",
      description:
        "Every smile is unique, so every treatment plan is customized to meet your individual dental needs.",
    },
    {
      id: 5,
      title: "Transparent & Ethical Care",
      description:
        "We believe in honest communication, ethical dentistry, and treatment recommendations you can trust.",
    },
    {
      id: 6,
      title: "Trusted by Thousands of Happy Patients",
      description:
        "Our commitment to quality care has earned the trust of thousands of families across Tirupati.",
    },
  ],

  cta: {
    heading: "Experience the Kavuturu Dental Clinic Difference",

    description:
      "Whether you need a routine dental check-up or advanced dental treatment, our experienced team is here to provide comfortable, personalized care for you and your family.",

    image: {
      src: ctaImage,
      alt: "Smiling patient with dentist at Kavuturu Dental Clinic",
    },

    button: {
      label: "Book Your Appointment",
      href: "/appointment",
    },
  },
};

export default aboutPageData;