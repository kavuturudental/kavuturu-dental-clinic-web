// src/data/treatments.js

import laserRootCanal from "../../assets/images/treatments/laser-root-canal.webp";
import dentalImplants from "../../assets/images/treatments/dental-implants.webp";
import laserGumTreatment from "../../assets/images/treatments/laser-gum.webp";
import teethWhitening from "../../assets/images/treatments/teeth-whitening.webp";
import crownsBridges from "../../assets/images/treatments/crowns-bridges.webp";
import bracesAligners from "../../assets/images/treatments/braces-aligners.webp";
import childrensDentistry from "../../assets/images/treatments/childrens-dentistry.webp";
import digitalDiagnostics from "../../assets/images/treatments/digital-diagnostics.webp";

const treatments = [
  {
    id: 1,
    slug: "dental-implants",
    title: "Dental Implants",
    image: dentalImplants,
    description:
      "Dental implants provide a durable and natural-looking replacement for missing teeth. They restore chewing ability, improve confidence, and help maintain long-term oral health.",
    highlights: [
      "Permanent tooth replacement",
      "Natural appearance and function",
      "Supports jawbone health",
      "Long-lasting solution",
    ],
  },
  {
    id: 2,
    slug: "braces-aligners",
    title: "Clear Aligners & Braces",
    image: bracesAligners,
    description:
      "Orthodontic treatments help align teeth and improve bite function using traditional braces or nearly invisible clear aligners tailored to your needs.",
    highlights: [
      "Straightens teeth",
      "Improves bite alignment",
      "Clear aligner options",
      "Customized treatment plans",
    ],
  },
  {
    id: 3,
    slug: "laser-root-canal",
    title: "Laser Root Canal Treatment",
    image: laserRootCanal,
    description:
      "Laser-assisted root canal treatment is a modern approach that removes infection with greater precision while preserving the natural tooth. It offers a comfortable treatment experience and supports faster healing for many patients.",
    highlights: [
      "Advanced laser-assisted technology",
      "Precise cleaning of infected canals",
      "Preserves the natural tooth",
      "Comfortable treatment experience",
    ],
  },
  {
    id: 4,
    slug: "laser-gum-treatment",
    title: "Laser Gum Treatment",
    image: laserGumTreatment,
    description:
      "Laser gum treatment effectively manages gum disease using minimally invasive technology. It promotes healthier gums while improving patient comfort during the procedure.",
    highlights: [
      "Minimally invasive procedure",
      "Improves gum health",
      "Reduced bleeding",
      "Faster recovery",
    ],
  },
  {
    id: 5,
    slug: "teeth-whitening",
    title: "Teeth Whitening",
    image: teethWhitening,
    description:
      "Professional teeth whitening safely removes stains and discoloration, revealing a brighter smile. Treatments are customized to achieve natural-looking results.",
    highlights: [
      "Noticeably brighter smile",
      "Professional-grade whitening",
      "Safe for tooth enamel",
      "Quick in-clinic procedure",
    ],
  },
  {
    id: 6,
    slug: "crowns-bridges",
    title: "Dental Crowns & Bridges",
    image: crownsBridges,
    description:
      "Crowns restore damaged teeth while bridges replace missing teeth to improve function, appearance, and long-term oral health.",
    highlights: [
      "Restores damaged teeth",
      "Replaces missing teeth",
      "Improves bite function",
      "Natural appearance",
    ],
  },
  {
    id: 7,
    slug: "childrens-dentistry",
    title: "Children's Dentistry",
    image: childrensDentistry,
    description:
      "Our pediatric dental care focuses on preventive treatments and creating a positive dental experience for children of all ages.",
    highlights: [
      "Child-friendly environment",
      "Preventive dental care",
      "Gentle treatment approach",
      "Regular growth monitoring",
    ],
  },
  {
    id: 8,
    slug: "digital-diagnostics",
    title: "Digital Dental Diagnostics",
    image: digitalDiagnostics,
    description:
      "Digital diagnostic technology provides accurate imaging and detailed treatment planning, helping deliver efficient and precise dental care.",
    highlights: [
      "High-precision digital imaging",
      "Early problem detection",
      "Accurate treatment planning",
      "Reduced radiation exposure",
    ],
  },
];

export default treatments;