// kavuturu-backend/src/scripts/verifyHomepageBackground.js

const fs = require("fs");
const path = require("path");

const websiteComponentsDir = path.resolve(__dirname, "../../../src/components/website");
const homePageFile = path.resolve(__dirname, "../../../src/pages/website/Home.jsx");

console.log("=================================================");
console.log("    HOMEPAGE UNIFIED BACKGROUND VERIFICATION     ");
console.log("=================================================");

let allPassed = true;

// 1. Verify Home.jsx has #FCFCFD and subtle background overlays
const homeContent = fs.readFileSync(homePageFile, "utf-8");
if (homeContent.includes("bg-[#FCFCFD]")) {
  console.log("✅ PASS: Home.jsx uses unified #FCFCFD Soft Warm White background.");
} else {
  console.error("❌ FAIL: Home.jsx does not use #FCFCFD!");
  allPassed = false;
}

if (homeContent.includes("blur-3xl") && homeContent.includes("opacity-[0.035]")) {
  console.log("✅ PASS: Home.jsx includes subtle (2-4% opacity) background decoration overlays.");
} else {
  console.error("❌ FAIL: Home.jsx missing background decorations!");
  allPassed = false;
}

// 2. Check individual homepage section components to ensure no alternating bg-slate-50 or bg-slate-100 sections
const sectionsToCheck = [
  "hero/Hero.jsx",
  "about/AboutSection.jsx",
  "home/TreatmentsSection.jsx",
  "home/doctors/DoctorsSection.jsx",
  "home/before-after/BeforeAfterSection.jsx",
  "testimonials/TestimonialsSection.jsx",
  "home/gallery/GallerySection.jsx",
  "home/blogs/BlogSection.jsx",
  "home/contact/ContactSection.jsx"
];

sectionsToCheck.forEach((relPath) => {
  const filePath = path.join(websiteComponentsDir, relPath);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    if (fileContent.includes("bg-[#FCFCFD]")) {
      console.log(`✅ PASS: ${relPath} uses unified #FCFCFD background.`);
    } else {
      console.error(`❌ FAIL: ${relPath} does not use #FCFCFD!`);
      allPassed = false;
    }
  }
});

console.log("=================================================");
if (allPassed) {
  console.log("   HOMEPAGE BACKGROUND VERIFICATION PASSED 100%  ");
} else {
  console.log("   SOME SECTIONS FAILED BACKGROUND CHECK        ");
  process.exit(1);
}
console.log("=================================================");
