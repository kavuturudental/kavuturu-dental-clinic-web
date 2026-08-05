// src/data/doctorsData.js

import doctorImage from "../../assets/images/doctors/dr-ravindra-babu.webp";

/* -------------------------------------------------------------------------- */
/*                               Featured Doctor                              */
/* -------------------------------------------------------------------------- */

export const featuredDoctor = {
  id: 1,

  slug: "dr-k-ravindra-babu",

  name: "Dr. K. Ravindra Babu",

  qualification:
    "BDS, MDS – Conservative Dentistry & Endodontics",

  specialization:
    "Chief Endodontist & Laser Root Canal Specialist",

  experience: "14+ Years",

  description:
    "With over a decade of clinical experience, Dr. Ravindra Babu specializes in laser-assisted root canal treatments and advanced restorative dentistry. He is committed to delivering precise, comfortable, and patient-focused dental care using modern technology and evidence-based techniques.",

  image: doctorImage,

  highlights: [
    {
      title: "14+",
      subtitle: "Years Clinical Experience",
    },
    {
      title: "20,000+",
      subtitle: "Root Canal Treatments",
    },
    {
      title: "State 10th Rank",
      subtitle: "MDS Entrance",
    },
    {
      title: "Root Canal Treatment",
      subtitle: "Specialist",
    },
  ],

  cta: {
    primary: {
      label: "Book Appointment",
      href: "/appointment",
    },

    secondary: {
      label: "View All Doctors",
      href: "/doctors",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                                Doctors List                                */
/* -------------------------------------------------------------------------- */

export const doctors = [
  featuredDoctor,

  {
    id: 2,
    slug: "dr-k-dharani-chowdary",
    name: "Dr. K. Dharani Chowdary",
    qualification: "MDS",
    specialization:
      "Oral & Maxillofacial Surgeon & Implantologist",
    experience: "15+ Years",
    description:
      "Experienced oral and maxillofacial surgeon providing advanced surgical procedures, dental implants, and comprehensive facial rehabilitation with a patient-first approach.",
    image: doctorImage,
  },

  {
    id: 3,
    slug: "dr-b-yesu-ratnam",
    name: "Dr. B. Yesu Ratnam",
    qualification: "MDS",
    specialization:
      "Oral & Maxillofacial Surgeon & Implantologist",
    experience: "15+ Years",
    description:
      "Dedicated specialist in oral surgery and implant dentistry, focused on delivering safe, predictable, and comfortable treatment outcomes.",
    image: doctorImage,
  },

  {
    id: 4,
    slug: "dr-b-anil-kumar",
    name: "Dr. B. Anil Kumar",
    qualification: "MDS",
    specialization:
      "Prosthodontist & Implantologist",
    experience: "10+ Years",
    description:
      "Expert in prosthodontics, full-mouth rehabilitation, crowns, bridges, dentures, and implant-supported restorations for functional and aesthetic smiles.",
    image: doctorImage,
  },

  {
    id: 5,
    slug: "dr-k-durga-prasad",
    name: "Dr. K. Durga Prasad",
    qualification: "MDS",
    specialization:
      "Oral & Maxillofacial Surgeon",
    experience: "10+ Years",
    description:
      "Specializes in oral surgery, wisdom tooth removal, facial trauma management, and complex surgical dental procedures using modern techniques.",
    image: doctorImage,
  },

  {
    id: 6,
    slug: "dr-k-prasanna-kumar",
    name: "Dr. K. Prasanna Kumar",
    qualification: "MDS",
    specialization: "Orthodontist",
    experience: "10+ Years",
    description:
      "Provides comprehensive orthodontic care including braces, clear aligners, and smile correction for children, teenagers, and adults.",
    image: doctorImage,
  },

  {
    id: 7,
    slug: "dr-k-raga-sreenija-reddy",
    name: "Dr. K. Raga Sreenija Reddy",
    qualification: "MDS",
    specialization: "Pedodontist",
    experience: "10+ Years",
    description:
      "Dedicated pediatric dentist committed to creating positive dental experiences while delivering preventive and restorative care for children.",
    image: doctorImage,
  },

  {
    id: 8,
    slug: "dr-d-siva-sai-prasad-reddy",
    name: "Dr. D. Siva Sai Prasad Reddy",
    qualification: "MDS",
    specialization: "Periodontist",
    experience: "10+ Years",
    description:
      "Specialist in gum disease treatment, periodontal surgery, and implant-supporting procedures focused on long-term oral health.",
    image: doctorImage,
  },

  {
    id: 9,
    slug: "dr-s-gamya-sree",
    name: "Dr. S. Gamya Sree",
    qualification: "BDS",
    specialization: "Dental Surgeon",
    description:
      "General dental practitioner providing preventive, restorative, and family dental care with an emphasis on patient comfort and education.",
    image: doctorImage,
  },
];