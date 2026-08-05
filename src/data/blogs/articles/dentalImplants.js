// src/data/blogs/articles/dentalImplants.js

import dentalImplants from "../../../assets/images/blogs/dental-implants.webp";
import doctorImage from "../../../assets/images/doctors/dr-ravindra-babu.webp";

const dentalImplantsArticle = {
  id: 2,
  slug: "dental-implants-guide",
  title: "Dental Implants: The Permanent Solution for Missing Teeth",
  category: "Dental Implants",
  image: dentalImplants,
  date: "May 03, 2026",
  readTime: "6 min read",
  author: {
    name: "Dr. Ravindra Babu",
    image: doctorImage,
    role: "Chief Dental Surgeon",
  },
  content: [
    {
      type: "paragraph",
      text: "Missing teeth can impact more than just your self-esteem; they can also affect your speech, dietary options, and long-term oral health. When a tooth is lost, the surrounding jawbone starts to deteriorate over time due to lack of stimulation. Fortunately, dental implants provide a permanent, natural-looking solution that replicates both the root and crown of your missing tooth."
    },
    {
      type: "heading2",
      text: "What Exactly is a Dental Implant?"
    },
    {
      type: "paragraph",
      text: "A dental implant consists of three main components: a titanium post that is surgically placed into the jawbone (acting as a root), an abutment that fits over the post, and a custom-made crown that matches the color and shape of your surrounding teeth. Through a natural process called osseointegration, the titanium post fuses with the bone, creating an exceptionally stable support system."
    },
    {
      type: "heading3",
      text: "Understanding Osseointegration"
    },
    {
      type: "paragraph",
      text: "Osseointegration is the biological process where bone cells grow and attach directly to the titanium surface of the implant. This takes a few months to complete but ensures that the implant is securely anchored, behaving exactly like a natural tooth root."
    },
    {
      type: "heading2",
      text: "Advantages of Choosing Dental Implants"
    },
    {
      type: "list-numbered",
      items: [
        "**Natural Look & Feel**: Implants look and behave exactly like your natural teeth, giving you complete confidence when smiling and eating.",
        "**Durability & Strength**: With proper maintenance and regular checkups, dental implants can last a lifetime.",
        "**Preserves Jawbone Integrity**: By replacing the tooth root, implants stimulate the jawbone and prevent the bone loss that typically follows tooth loss.",
        "**No Damage to Adjacent Teeth**: Unlike dental bridges, implants do not require grinding down neighboring healthy teeth for support."
      ]
    },
    {
      type: "note",
      text: "Important: Ideal candidates for dental implants should have good general health, healthy gums, and adequate bone density to support the implant post."
    },
    {
      type: "heading2",
      text: "Frequently Asked Questions"
    },
    {
      type: "faq",
      question: "How long does a dental implant last?",
      answer: "With good oral hygiene, regular flossing, and dental checkups, the titanium implant post can last a lifetime. The crown on top may need replacement after 10-15 years due to normal wear."
    },
    {
      type: "faq",
      question: "Is the implant surgery painful?",
      answer: "The surgery is performed under local anesthesia, so you will not feel any pain during the procedure. Some mild soreness is normal afterward, which can be managed with over-the-counter pain medication."
    }
  ]
};

export default dentalImplantsArticle;