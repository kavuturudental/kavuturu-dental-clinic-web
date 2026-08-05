// src/data/blogs/articles/laserGumTreatment.js

import laserGumTreatment from "../../../assets/images/blogs/Third blog card (Laser Gum Treatment).webp";
import doctorImage from "../../../assets/images/doctors/dr-ravindra-babu.webp";

const laserGumTreatmentArticle = {
  id: 3,
  slug: "laser-gum-treatment",
  title: "Laser Gum Treatment: The Advanced Solution for Gum Disease & Aesthetics",
  category: "Laser Dentistry",
  image: laserGumTreatment,
  date: "April 28, 2026",
  readTime: "4 min read",
  author: {
    name: "Dr. Ravindra Babu",
    image: doctorImage,
    role: "Chief Dental Surgeon",
  },
  content: [
    {
      type: "paragraph",
      text: "Healthy gums are the foundation of a healthy smile. Periodontal (gum) disease is one of the most common dental problems worldwide, often leading to bleeding, bad breath, receding gums, and eventually tooth loss. Traditional gum treatments often involve scalpel surgery and sutures. However, laser gum treatment provides a gentle, minimally invasive solution that heals tissues without blades or bleeding."
    },
    {
      type: "heading2",
      text: "The Science Behind Laser Periodontal Therapy"
    },
    {
      type: "paragraph",
      text: "Laser gum treatment uses specialized light energy to target and vaporize diseased tissue and bacteria inside gum pockets. The laser is selective; it leaves healthy tissue untouched. Once the bacteria are removed, the laser seals the blood vessels and nerve endings, significantly reducing swelling, bleeding, and sensitivity immediately following the procedure."
    },
    {
      type: "heading2",
      text: "Top Reasons to Opt for Laser Gum Treatment"
    },
    {
      type: "list-bullet",
      items: [
        "**No Scalpels or Sutures**: The procedure is completely blade-free and requires no stitches, making the entire experience stress-free.",
        "**Minimal Bleeding and Swelling**: The laser sanitizes and cauterizes as it cleans, resulting in minimal blood loss and post-operative swelling.",
        "**Gum Reshaping & Contouring**: Lasers can also reshape and contour uneven gum lines, correcting gummy smiles in a single visit.",
        "**Faster Recovery Time**: Healing begins immediately, meaning you won't need to take days off from work or alter your diet significantly."
      ]
    },
    {
      type: "note",
      text: "Tip: Maintaining daily flossing and twice-yearly clinical cleanings is crucial to keeping gum disease from returning after your laser treatment."
    },
    {
      type: "heading2",
      text: "Frequently Asked Questions"
    },
    {
      type: "faq",
      question: "Will my gums bleed after laser treatment?",
      answer: "Bleeding is extremely minimal compared to traditional surgery because the laser automatically cauterizes blood vessels during the cleaning process."
    },
    {
      type: "faq",
      question: "How many sessions will I need?",
      answer: "Depending on the severity of the gum disease, many patients achieve excellent results in just 1 to 2 sessions."
    }
  ]
};

export default laserGumTreatmentArticle;
