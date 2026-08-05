// src/data/blogs/blogsData.js

import laserRootCanal from "../../assets/images/blogs/laser-root-canal.webp";
import dentalImplants from "../../assets/images/blogs/dental-implants.webp";
import laserGumTreatment from "../../assets/images/blogs/Third blog card (Laser Gum Treatment).webp";
import doctorImage from "../../assets/images/doctors/dr-ravindra-babu.webp";

const blogData = [
  {
    id: 1,
    slug: "laser-root-canal-treatment",
    title: "Laser Root Canal Treatment: A Faster, Safer & More Comfortable Way to Save Your Tooth",
    excerpt: "Discover how laser-assisted root canal treatment offers greater precision, minimal discomfort, faster healing, and improved long-term results.",
    category: "Root Canal Treatment",
    image: laserRootCanal,
    author: {
      name: "Dr. Ravindra Babu",
      image: doctorImage,
    },
    date: "May 10, 2026",
    readTime: "5 min read",
    isFeatured: true,
    content: [
      {
        type: "paragraph",
        text: "Root canal treatments have historically carried a reputation for being uncomfortable and time-consuming. However, with modern technological advancements, root canal therapy has been revolutionized. Laser-assisted root canal treatment is at the forefront of this evolution, offering patients a faster, safer, and significantly more comfortable alternative to traditional methods."
      },
      {
        type: "heading",
        text: "How Laser-Assisted Root Canal Treatment Works"
      },
      {
        type: "paragraph",
        text: "In traditional root canal therapy, a dentist uses manual files and chemical rinses to clean out infected pulp tissue from inside the tooth's canal. Laser-assisted root canals use a highly focused light beam (laser) along with specialized dental instruments. The laser energy enters the root canal space, producing shockwaves that thoroughly clean and sterilize the canals, reaching microscopic gaps that traditional files might miss."
      },
      {
        type: "heading",
        text: "Key Benefits of Laser Root Canal Therapy"
      },
      {
        type: "list",
        items: [
          "Microscopic Precision: The laser targets only the infected tissue, preserving a greater amount of your healthy, natural tooth structure.",
          "Enhanced Sterilization: Laser energy destroys 99% of bacteria inside the canals, drastically reducing the risk of re-infection.",
          "Reduced Pain and Discomfort: Because the procedure is less invasive, patients experience far less pain and post-operative sensitivity.",
          "Faster Recovery: Laser treatment promotes quicker tissue healing, allowing you to return to your normal routine almost immediately."
        ]
      },
      {
        type: "heading",
        text: "Why Choose Kavuturu Dental Clinic for Your Treatment"
      },
      {
        type: "paragraph",
        text: "At Kavuturu Dental Clinic, we utilize advanced FDA-approved dental laser systems for root canal treatments. Dr. Ravindra Babu, our chief specialist, has over a decade of clinical experience in conservative and laser endodontics. We are dedicated to providing painless, precise, and highly successful treatments in a warm, welcoming clinical setting."
      }
    ]
  },
  {
    id: 2,
    slug: "dental-implants-guide",
    title: "Dental Implants: The Permanent Solution for Missing Teeth",
    excerpt: "Replace missing teeth with advanced dental implants that look, feel, and function like natural teeth for years to come.",
    category: "Dental Implants",
    image: dentalImplants,
    author: {
      name: "Dr. Ravindra Babu",
      image: doctorImage,
    },
    date: "May 03, 2026",
    readTime: "6 min read",
    isFeatured: true,
    content: [
      {
        type: "paragraph",
        text: "Missing teeth can impact more than just your self-esteem; they can also affect your speech, dietary options, and long-term oral health. When a tooth is lost, the surrounding jawbone starts to deteriorate over time due to lack of stimulation. Fortunately, dental implants provide a permanent, natural-looking solution that replicates both the root and crown of your missing tooth."
      },
      {
        type: "heading",
        text: "What Exactly is a Dental Implant?"
      },
      {
        type: "paragraph",
        text: "A dental implant consists of three main components: a titanium post that is surgically placed into the jawbone (acting as a root), an abutment that fits over the post, and a custom-made crown that matches the color and shape of your surrounding teeth. Through a natural process called osseointegration, the titanium post fuses with the bone, creating an exceptionally stable support system."
      },
      {
        type: "heading",
        text: "Advantages of Choosing Dental Implants"
      },
      {
        type: "list",
        items: [
          "Natural Look & Feel: Implants look and behave exactly like your natural teeth, giving you complete confidence when smiling and speaking.",
          "Durability: With proper maintenance and regular checkups, dental implants can last a lifetime.",
          "Bone Health Preservation: By replacing the tooth root, implants stimulate the jawbone and prevent the bone loss that typically follows tooth loss.",
          "No Damage to Adjacent Teeth: Unlike dental bridges, implants do not require grinding down neighboring healthy teeth for support."
        ]
      },
      {
        type: "heading",
        text: "The Implant Journey at Kavuturu Dental Clinic"
      },
      {
        type: "paragraph",
        text: "Our team offers comprehensive dental implant packages, including 3D digital planning, precise surgical placement, and high-quality zirconia crowns. We ensure that every step of your surgical and restorative treatment is comfortable and custom-tailored to your unique facial aesthetics and dental requirements."
      }
    ]
  },
  {
    id: 3,
    slug: "laser-gum-treatment",
    title: "Laser Gum Treatment: The Advanced Solution for Gum Disease & Aesthetics",
    excerpt: "Learn how laser gum therapy offers a gentle, precise, and highly effective way to treat periodontal issues and contour your gums.",
    category: "Laser Dentistry",
    image: laserGumTreatment,
    author: {
      name: "Dr. Ravindra Babu",
      image: doctorImage,
    },
    date: "April 28, 2026",
    readTime: "4 min read",
    isFeatured: false,
    content: [
      {
        type: "paragraph",
        text: "Healthy gums are the foundation of a healthy smile. Periodontal (gum) disease is one of the most common dental problems worldwide, often leading to bleeding, bad breath, receding gums, and eventually tooth loss. Traditional gum treatments often involve scalpel surgery and sutures. However, laser gum treatment provides a gentle, minimally invasive solution that heals tissues without blades or bleeding."
      },
      {
        type: "heading",
        text: "The Science Behind Laser Periodontal Therapy"
      },
      {
        type: "paragraph",
        text: "Laser gum treatment uses specialized light energy to target and vaporize diseased tissue and bacteria inside gum pockets. The laser is selective; it leaves healthy tissue untouched. Once the bacteria are removed, the laser seals the blood vessels and nerve endings, significantly reducing swelling, bleeding, and sensitivity immediately following the procedure."
      },
      {
        type: "heading",
        text: "Top Reasons to Opt for Laser Gum Treatment"
      },
      {
        type: "list",
        items: [
          "No Scalpels or Sutures: The procedure is completely blade-free and requires no stitches, making the entire experience stress-free.",
          "Minimal Bleeding and Swelling: The laser sanitizes and cauterizes as it cleans, resulting in minimal blood loss and post-operative swelling.",
          "Gum Contouring (Gummy Smile Correction): Lasers can also reshape and contour uneven gum lines, improving your smile's aesthetics in a single visit.",
          "Faster Recovery Time: Healing begins immediately, meaning you won't need to take days off from work or alter your diet significantly."
        ]
      },
      {
        type: "heading",
        text: "Advanced Laser Systems in Action"
      },
      {
        type: "paragraph",
        text: "At Kavuturu Dental Clinic, our state-of-the-art dental lasers allow us to perform everything from deep periodontal cleanings to aesthetic gum reshaping. Dr. Ravindra Babu will assess your gum health and determine if laser therapy is the right choice to restore your smile's strong foundation."
      }
    ]
  }
];

export default blogData;